import React, { useState } from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  Pickaxe, 
  Factory, 
  Activity, 
  Leaf, 
  Building2, 
  Box, 
  Timer, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
  ArrowUpRight,
  Volume2,
  Eye,
  Palette,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { ARCHITEKTUR_MATERIALITAET } from '@/src/data/architekturMaterialitaet';

export interface ProfilSection {
  title: string;
  icon: React.ReactNode;
  content: string;
}

export interface MaterialProfil {
  name: string;
  subtitle: string;
  sections: {
    rohstoffe: string;
    herstellung: string;
    eigenschaften: {
      technisch: string;
      oekologisch: string;
    };
    anwendungen: string;
    produkte: string;
    dauerhaftigkeit: string;
    kosten: string;
    recycling: string;
    besonderheiten: string;
    innovationen: string;
    historie: string;
  };
}

const BRAND_COLOR_TEXT = "text-shiraz";
const BRAND_COLOR_BG = "bg-shiraz/5";
const BRAND_COLOR_BORDER = "border-shiraz/20";

export const DEFT_PROFILES: Record<string, MaterialProfil> = {
  gesteine: {
    name: "Natursteine & Gesteinskörnungen",
    subtitle: "Magmatite, Sedimentite und Metamorphite im konstruktiven Hoch- und Tiefbau",
    sections: {
      rohstoffe: "Ausgangsmaterialien sind magmatische Tiefen-/Ergussgesteine (z. B. Granit, Basalt), sedimentäre Ablagerungsgesteine (z. B. Kalkstein, Sandstein) oder metamorphe Umwandlungsgesteine (z. B. Marmor, Gneis, Schiefer). Abbau erfolgt im Festgesteinstagebau (Sprengung) oder Nass- und Trockenabbau von Lockergesteinen (Sand/Kies).",
      herstellung: "Bei Naturwerkstein erfolgt der mechanische Nasszuschnitt (Gattersägen, Seilsägen) im Steinmetzbetrieb gefolgt von Oberflächenveredelung (Polieren, Schleißen, Flammen). Gesteinskörnungen für Beton/Asphalt werden im Bohr- und Sprengbetrieb gewonnen, in Brecheranlagen zerkleinert und in Siebmaschinen in genormte Kornklassen fraktioniert.",
      eigenschaften: {
        technisch: "Enorm hohe Druckfestigkeit (Granit ca. 150-250 MPa, Basalt bis zu 350 MPa). Hohe Rohdichte (2.200-3.000 kg/m³). Sprödes Versagensverhalten ohne plastische Zugreserven. Wärmeleitfähigkeit ist hoch (λ ≈ 1.5 - 3.5 W/(m·K)). Mohshärte variiert stark von Weichgestein (Marmor Härte 3) bis Hartgestein (Granit/Quarzit Härte 7).",
        oekologisch: "Hervorragende Ökobilanz als Primärbaustoff. Geringer Treibhausgas-Emissionsgrad bei regionalem Abbau (ca. 5-15 kg CO2-Äq./t für Gesteinskörnung). Extrem hohe Graue Energie entsteht jedoch bei importierten Natursteinen (z.B. Granit aus Fernost-Transportwegen)."
      },
      anwendungen: "Grobe/feine Körnungen als tragendes Skelett in Beton (70-80 Vol.-%) und Asphalt. Naturwerkstein als hinterlüftete Außenwandbekleidung (DIN 18516-3), widerstandsfähige Boden- und Pflasterbeläge im Straßen-/U-Bahnbereich, Bordsteine, Treppenstufen, Gleisschotter (Basalt) und Wasserbasteine im Wasserbau.",
      produkte: "Standardfittings wie Mauersteine (DIN EN 771-6), Pflastersteine (DIN EN 1341), Platten für Außenbekleidungen (DIN EN 1469), Gleisschotter (DIN EN 13450), Gesteinskörnungen für Beton (DIN EN 12620) und Trass-Zemente für die ausblühungsfreie Verlegung.",
      dauerhaftigkeit: "Grundsätzlich extrem dauerhaft (Lebensdauer > 100 Jahre). Kalksteine und Marmore sind jedoch empfindlich gegenüber saurem Regen (Schwefeldioxid wandelt Calcit in lösliche Gipsphasen um: 'Saurer Abbrand'). Frostbeständigkeit ist abhängig von offener Porosität und kapillarer Wasseraufnahme (Gefahr der Eisdrucksprengung).",
      kosten: "Erhebliche Preisspanne: Einfache Gesteinskörnungen sind extrem günstig (ca. 15-35 €/t im Schüttgutwerk). Hochwertige, maßgeschneiderte Naturwerksteinplatten (z.B. geschliffener Carrara-Marmor) gehören zu den teuersten Fassaden- und Bodenmaterialien (150-500 €/m²).",
      recycling: "Sorgloses Recycling möglich. Reiner Gesteinsbruch wird in Aufbereitungsanlagen zu güteüberwachten RC-Baustoffen (Recycling-Schotter/-Splitt) für den Straßenbau verarbeitet oder dient als RC-Gesteinskörnung im Hochbaubeton (Typ-I und Typ-II nach DAfStb-Richtlinie).",
      besonderheiten: "Wichtigste Verlege-Goldregel: Natursteine im Außenbereich niemals mit normalem Portlandzement verlegen! Das freigesetzte freie Calciumhydroxid führt durch Kapillardiffusion zu unlöslichen weißen Ausblühungen und Flecken. Ausschließlich speziellen, thixotropen Trassmörtel verwenden.",
      innovationen: "Entwicklung von feinstgemahlenem, reaktivem Gesteinsmehl zur Packungsdichteoptimierung im UHPC-Beton. Automatisierter CNC-Roboterzuschnitt von Freiform-Fassadenplatten. Einsatz von Photokatalysatoren auf porösen Natursteinoberflächen zur selbsttätigen Schmutzzersetzung.",
      historie: "Bereits seit der Altsteinzeit das erste Baumaterial der Menschheit (Spätestens seit der Jungsteinzeit ein zentrales Baumaterial der Menschheit (Spätestens seit der Jungsteinzeit ein zentrales Baumaterial der Menschheit (Megalithanlagen wie Stonehenge, ca. 3000–1500 v. Chr.)., ca. 3000–1500 v. Chr.).). Im antiken Ägypten, Griechenland und Rom wurden monumentale Steinarchitekturen (Pyramiden, Tempel, Aquädukte) errichtet. Die Einführung von Sprengpulver im 17. Jahrhundert revolutionierte den Abbau in Steinbrüchen vollends."
    }
  },
  mauerwerk: {
    name: "Mauerwerk & Mauersteine (Übersicht)",
    subtitle: "Tragendes, dämmendes und verblendendes Mauerwerk nach DIN EN 1996 (Eurocode 6)",
    sections: {
      rohstoffe: "Abhängig von der Steinart: Sand, Kalk und Wasser bei Kalksandstein (KS). Reiner Ton, Schluff, Lehm und Wasser für gebrannte Mauerziegel (Z) bzw. ungebrannte Lehmbausteine (LH, teils mit Pflanzenfasern wie Stroh/Hanf armiert). Kalk, Zement, Quarzmehl und Aluminiumpulver (Blähmittel) bei Porenbeton (PB). Zementgebundener Leichtbeton mit Bims/Blähton bei Leichtbetonsteinen.",
      herstellung: "Tonziegel werden geformt, getrocknet und bei 900-1100 °C im Tunnelofen gebrannt. Kalksandsteine entstehen durch Pressen der Rohmischung und anschließendes hydrothermalen Härten im Autoklaven unter Wasserdampf (16 bar, 200 °C). Porenbeton gärt zunächst durch die H2-Gasbläschen des Aluminiums auf und wird danach analog autoklaviert. Lehmbausteine werden lediglich mechanisch verdichtet und rein solar an der Luft getrocknet (völlig CO₂-frei).",
      eigenschaften: {
        technisch: "Druckfestigkeiten variieren dramatisch zwischen den Steinklassen: Porenbeton (f_b ≈ 2-8 MPa), Lehmbausteine (f_b ≈ 2-5 MPa, sehr feuchtigkeitsempfindlich), Kalksandstein (f_b ≈ 12-28 MPa) und schwere Tonziegel/Klinker (f_b ≈ 12-45+ MPa). Die Rohdichten reichen von superleichten Wärmedämmsteinen wie PB (300-600 kg/m³) bis hin zu massiven KSV (1.800-2.200 kg/m³) für erstklassigen Schallschutz.",
        oekologisch: "Keramisches Brennen von Ziegeln besitzt aufgrund der Prozesstemperaturen über 1000 °C den höchsten Primärenergiebedarf. Kalksandstein besitzt dank der Kaltpressung und moderaten Erwärmung im Autoklaven (200 °C) eine weitaus vorteilhaftere CO₂-Bilanz. Lehmbausteine sind der absolute ökologische Spitzenreiter (nahezu CO₂-neutral, luftgetrocknet und 100% zirkulär)."
      },
      anwendungen: "Tragendes und aussteifendes Außen- und Innenmauerwerk. Schallschutz-Wohnungstrennwände (bevorzugt schwerer Kalksandstein). Monolithisches hochwärmedämmendes Außenmauerwerk (Hochlochziegel oder Porenbeton). Ökologischer, raumklimatisch hoch-aktiver Innenausbau (Lehmbausteine zur Feuchtigkeitsregulation). Zweischaliges Sicht- und Verblendmauerwerk (Klinker für extremen Wetterschutz).",
      produkte: "Planziegel (mit Perlit-/Mineralwolle gefüllte Hohlkammern), Kalksand-Plansteine (KS-R-P) für ultradünne Klebeverbindung (1-3 mm Lagerfugen), Porenbeton-Planblöcke für schnelle monolithische Montage, Leichtbetonsteine (DIN EN 771-3), Lehmsteine (DIN 18945, Anwendungsklassen Ia, Ib, II).",
      dauerhaftigkeit: "Sehr hoch (> 100 Jahre) bei fachgerechter hydrothermischer Entkopplung. Gebrannte Tonziegel (Klinker) im Außenbereich weisen höchste Frostbeständigkeit auf. Kalksandsteine müssen spritzwassergeschützt verbaut werden. Porenbeton neigt bei Dauerfeuchte zu Tragfähigkeitseinbußen. Ungebrannter Lehm ist hochgradig wasserlöslich und darf ausschließlich im wettergeschützten Innenbereich genutzt werden.",
      kosten: "Kalksandsteinwände mit Dünnbettmörtel bieten unerreicht niedrige Herstellkosten bei hervorragender Statik (ca. 45-70 €/m²). monolithische Wärmedämmziegel- oder Porenbeton-Plansteine weisen merkliche Materialaufschläge auf, machen aber kostspielige außenseitige Wärmedämmverbundsysteme (WDVS) hinfällig. Lehmbauplatten und Lehmsteine sind nischenbedingt zurzeit materialseitig teurer, sparen aber durch einfache Eigenleistung.",
      recycling: "Konventionell vermauertes Steinmaterial lässt sich als sortenreiner Bauschutt brechen (z. B. Ziegelsplitt zur Dachbegrünung, Kalksandkies im Erdbau). Dünnbettvermauerte Wände vereinfachen die werkzeugfreie Trennung beim Abbruch. Ungebrannter Lehm is das Musterbeispiel perfekter Kreislaufwirtschaft: Er lässt sich unbegrenzt oft wieder mit Wasser einsumpfen, kneten und neu verbauen oder schadstofffrei in den Naturkreislauf rückführen.",
      besonderheiten: "Statische Bemessungsgrundlage (EC6): Tragfähigkeit von Mauerwerk ist primär eine Systemfestigkeit und hängt massiv von der Stein-Mörtel-Kombination ab. Dünnbettmörtel erhöht die nutzbare Druckfestigkeit des Mauerwerks um bis zu 40% gegenüber Normalmörtel, da dicke Mörtelfugen Querdehnungen begünstigen.",
      innovationen: "Ziegel mit integrierten Vakuum-Isolationspaneelen (VIP) für Passivhausstandards bei minimalen Wanddicken. Entwicklung geschosshoher Mauerwerks-Montageelemente (Robotervorfertigung im Werk). Leimmörtel in der Sprühdose zur rasanten, wasserlosen Montage auf der Baustelle.",
      historie: "Die baugeschichtliche Entwicklung reicht über 10.000 Jahre zurück zu getrockneten Lehm-Mauersteinen (Jericho). Im antiken Mesopotamien wurden erste Ziegel gebrannt. Die Römer führten mit dem Opus Caementitium und flachen Ziegeln (lateres) eine weitgehende Standardisierung der Mauerwerkstechnik ein."
    }
  },
  mauerziegel: {
    name: "Mauerziegel (Klinker & Hochlochziegel)",
    subtitle: "Keramisch gebrannte Tonsteine für tragende, dämmende und verblendende Wände nach DIN EN 771-1",
    sections: {
      rohstoffe: "Reiner Ton, Schluff, Lehm und Wasser. Gegebenenfalls Beimischungen von Porosierungsstoffen (wie Sägemehl, Styroporkügelchen), die beim Brennen rückstandsfrei verbrennen und isolierende Hohlräume bilden.",
      herstellung: "Der Rohguss wird im Strangpreßverfahren geformt, getrocknet und im Tunnelofen bei 900 °C bis 1100 °C (hochfeste Klinker bis zu 1200 °C) keramisch gebrannt, wodurch die feste Phasensinterung der Tonsilikate eintritt.",
      eigenschaften: {
        technisch: "Sehr hohe Druckfestigkeiten (Standardziegel fb ≈ 12-28 MPa, hochfeste Klinker bis zu 60+ MPa). Rohdichten variieren von extrem gewichtsreduzierten Hochloch-Dämmziegeln (600 kg/m³) bis hin zu massiven Klinkern (2200 kg/m³). Wärmeleitfähigkeit ab λ ≈ 0.05 W/(m·K) (gefüllter Planziegel) bis λ ≈ 0.8 W/(m·K) (Vollziegel).",
        oekologisch: "Aufgrund hoher Prozesstemperaturen (Tunnelofen) hoher Energieaufwand bei der Herstellung (Graue Energie ca. 1.8 - 2.8 MJ/kg). Hoher CO₂-Ausstoß. Die extrem lange Lebensdauer gleicht den ökologischen Rucksack im Gebäude-Lebenszyklus jedoch hervorragend aus."
      },
      anwendungen: "Sichtmauerwerk/Verblendschalen (Klinker), wärmedämmende monolithische Außenwände (moderne gefüllte Hochlochziegel), tragende und nichttragende Innenwände.",
      produkte: "Hochlochziegel (HLz), Hochkantziegel, Planziegel (geschliffene Lagerflächen), Vollklinker, Vormauerziegel, Riemchen.",
      dauerhaftigkeit: "Nahezu unbegrenzt (> 150 Jahre). Gebrannte Tonziegel und insbesondere Klinker weisen eine extrem geringe Wasseraufnahme (< 6 Gew.-%) auf und sind absolut frost- und tausalzbeständig.",
      kosten: "Hochlochziegel und Klinker liegen im mittleren bis oberen Preissegment (monolithische Thermoziegel ca. 80-130 €/m² inkl. Füllung). Dämpfen langfristig Folgekosten durch den Wegfall von künstlichen Wärmedämmverbundsystemen (WDVS).",
      recycling: "Ziegelbruch ist hervorragend stofflich recyclingfähig und wird thermisch-mechanisch als Zuschlag für Vegetationssubstrate (Dachbegrünung), Tennisplatzbeläge (Ziegelmehl) oder als RC-Gesteinskörnung im Wegebau verarbeitet.",
      besonderheiten: "Konstruktionstipp: Um die statische Druckfestigkeit zu optimieren, weisen Planziegel geschliffene Lagerflächen auf. Sie werden mit Dünnbettmörtel verklebt (Lagerfuge nur ca. 1-3 mm dicke Fuge), wodurch das Auspressen dicker Mörtelschichten und elastische Querdehnungen in den Fugen minimiert werden.",
      innovationen: "Mit Vakuumisolationspaneelen (VIP) oder Aerogelen gefüllte Hohlkammerziegel, die extrem geringe Wanddicken bei Erreichen des Passivhausstandards ermöglichen.",
      historie: "Der gebrannte Tonziegel entstand um ca. 3.000 v. Chr. im Zweistromland. Im europäischen Mittelalter prägte die herrschaftliche Backsteingotik weite Landschaften. Die Erfindung des kontinuierlich arbeitenden Hoffmannschen Ringofens im Jahr 1858 ebnete den Weg für die kostengünstige Massenproduktion."
    }
  },
  kalksandstein: {
    name: "Kalksandstein (KS)",
    subtitle: "Hydrothermal gehärtete Kalk-Sand-Mauersteine für tragende Innen- und Trennwände nach DIN EN 771-2",
    sections: {
      rohstoffe: "Branntkalk (CaO, ca. 5-8 Gew.-%), quarzreicher Sand (ca. 90-95 Gew.-%) und Wasser. Keine künstlichen Bindemittel oder umweltgefährdende Additive.",
      herstellung: "Mischen der Rohstoffe und kontrollierte Calciumhydroxid-Zubereitung im Reaktor. Mechanisches Hochdruckpressen der Rohlinge in Steinpressen. Letztendliche Gefügehärtung im Autoklaven unter gesättigtem Wasserdampf (16 bar, 200 °C) für ca. 4-8 Stunden, bei denen sich CSH-Kristalle bilden.",
      eigenschaften: {
        technisch: "Ausgeprägte Steindruckfestigkeiten (fbl ≈ 12 bis 36 MPa, teils bis zu 48 MPa). Hohe Steinrohdichte (1600-2400 kg/m³), woraus ein unerreichtes Schallschutzmaß (Schalldämmung Rw) resultiert. Wärmeleitfähigkeit hoch (λ ≈ 0.79 bis 1.3 W/(m·K)), daher kaum eigenständige Dämmwirkung.",
        oekologisch: "Hervorragend niedrige Graue Energie (nur ca. 0.4 - 0.7 MJ/kg), da die Festigkeit nicht durch Brennen bei 1000 °C, sondern mittels hydrothermaler Reaktion bei energiesparenden 200 °C gebildet wird."
      },
      anwendungen: "Tragende Innenwände, hochbelastete Mauerwerkspfeiler, Wohnungstrennwände (hoher Schallschutzbedarf), Außenwand-Innenschalen mehrschaliger Konstruktionen.",
      produkte: "KS-Plansteine, KS-Quadro (Großformate für maschinengebundenen zügigen Verbau), KS-Lochsteine, Koppelsteine.",
      dauerhaftigkeit: "Hocheffektiv langlebig (> 120 Jahre). Bei dauerhafter Feuchtigkeitseinwirkung (wie Spritzwasser) is eine fachgerechte Bauwerkabdichtung zwingend nötig, um kristalline Karbonatisierungsschäden am CSH-Gitter zu unterbinden.",
      kosten: "Extrem wirtschaftlich. Kalksandstein bietet bezogen auf seine immense statische Tragfähigkeit und Raumausnutzung das weitaus effizienteste Kosten-Nutzen-Verhältnis aller mineralischen Mauerwerkswände (Wände ab 45 €/m²).",
      recycling: "Stofflich komplett kreislauffähig. Abbruchmaterial wird in Brecheranlagen zu sandartigen Kornfraktionen aufbereitet und geht zurück in die Kalksandstein-Körnungsproduktion oder dient als reiner Wegeunterbau.",
      besonderheiten: "Statiker-Tipp: Das hohe Eigengewicht ist bei der Lastweiterleitung (Fundamente/Decken) zu berücksichtigen. Die Steine eignen sich hervorragend für das rationelle Kleben im Dünnbettkleber-Umlaufverfahren.",
      innovationen: "Entwicklung hochgradig automatisierter Roboter-Verlegsysteme, die großformatige KS-Quadros komplett vermassungs- und spachtelfertig einheben. CO₂-Aufnahmeverfahren während der Härtung.",
      historie: "Wilhelm Michaelis erwarb im Jahr 1880 ein deutsches Reichspatent zur hydrothermalen Erhärtung von Sand-Kalk-Mischungen. Ab 1890 setzte die industrielle Fertigung in Deutschland ein, was durch die Erstellung extrem präziser, kostengünstiger Tragsteine den städtischen Wohnungsbau der Gründerzeit befeuerte."
    }
  },
  porenbeton: {
    name: "Porenbeton (PB)",
    subtitle: "Dampfgehärtete monolithische Leichtmauerblöcke für idealen Wärmeschutz nach DIN EN 771-4",
    sections: {
      rohstoffe: "Feinstgemahlenes Quarzsandmehl, Branntkalk (CaO), Portlandzement, Wasser und eine minimale Dosierung Aluminiumpulver (welches als physikalisches Aufblähmittel dient).",
      herstellung: "Anmischen der Rohstoffe. In der Gussform reagiert das Aluminium im basischen Gemisch, setzt Wasserstoffgas frei und bläht die Schlämme auf. Nach der Vorgelierung wird der halbfeste Block mit Schneidedrähten präzise getrennt und im Autoklaven dampfgehärtet.",
      eigenschaften: {
        technisch: "Niedrige mechanische Festigkeiten (fb ≈ 2 bis 8 MPa). Überragend niedrige Porenrohdichten (300-600 kg/m³). Die Wärmeleitfähigkeit ist mit λ ≈ 0.07 bis 0.12 W/(m·K) unerreicht und ermöglicht den monolithischen Bau ohne WDVS-Platten.",
        oekologisch: "Moderat niedriger Energiebedarf (Graue Energie ~1.2 MJ/kg). Extrem rohstoffsparend, da der Porenanteil über 80% des Gesamtvolumens ausmacht, was Materialressourcen schont."
      },
      anwendungen: "Monolithische tragende Außenwände im Wohnungs-, Hallen- und Skelettbau, aussteifende Innenwände, hervorragende Brandwände (nicht brennbar Baustoffklasse A1).",
      produkte: "Porenbeton-Planblöcke, fertig vorkonfektionierte Decken- und Sturzplatten, montagefertige U-Schalen.",
      dauerhaftigkeit: "Sehr beständig bei trockenem Verhalt. Das Porengerüst besitzt eine hohe Offenporigkeit, weshalb Porenbetonstein zwingend vor direkter Witterung und Schlagregen durch einen diffusionsoffenen Putz geschützt werden muss.",
      kosten: "Weist ein vorteilhaftes Preis-Leistungs-Verhältnis für Außenwände auf, da handwerkliche Zusatzgewerke (WDVS-Klebearbeiten) entfallen. Schnelle Einbauzeiten dank Nut-Feder-Fräsung und Tragegriffen.",
      recycling: "Schnittreste des Herstellers fließen direkt zurück in die Primärproduktion. Baustellenreste werden granuliert und als umweltschonende Saugpulver, Filtersubstrate oder mineralische Leichtbetonzuschläge verwertet.",
      besonderheiten: "Baustellen-Tipp: Die Steine lassen sich kinderleicht mit einer einfachen Handsäge schneiden und bearbeiten. Schwere Lasten (Konsolen, Hängeschränke) erfordern jedoch bauaufsichtlich zugelassene Porenbeton-Hinterstichdübel.",
      innovationen: "Hochwärmedämmende Multipor-Mineraldämmplatten zur diffusionsoffenen Innendämmung im Denkmalschutz oder Super-Dämmblöcke mit integriertem Aerogelfaser-Kern.",
      historie: "Der schwedische Architekt Axel Eriksson patentierte im Jahr 1924 die Herstellung von dampfgehärtetem Porenbeton. Ab 1929 wurde der Werkstoff unter einer wegweisenden schwedischen Marke vertrieben und entwickelte sich nach dem Zweiten Weltkrieg zum Standard für hochwärmedämmendes, monolithisches Bauen."
    }
  },
  leichtbeton: {
    name: "Leichtbetonsteine",
    subtitle: "Zementgebundene Mauersteine mit porösen mineralischen Leichtzuschlägen nach DIN EN 771-3",
    sections: {
      rohstoffe: "Zement als Bindemittel, Wasser sowie natürliche oder künstliche poröse Gesteinskörnungen (Naturbims, Blähton, Blähschiefer oder geschäumtes Perlite).",
      herstellung: "Mischen der Komponenten und Verdichtung in Formmaschinen unter mechanischer Vibration. Die Aushärtung geschieht sehr umweltschonend durch Hydratation bei Umgebungstemperatur oder mäßiger Abwärme ohne Autoklavieren und schont Primärenergien.",
      eigenschaften: {
        technisch: "Mittlere Druckfestigkeiten (fb ≈ 2 bis 12 MPa). Mittlere Rohdichten (500-1200 kg/m³). Ausgezeichnete wärmetechnische Leistungsfähigkeit (λ ≈ 0.10 bis 0.22 W/(m·K)). Besitzt durch das Gesteinsskelett eine hocheffiziente Schalldämpfung.",
        oekologisch: "Sehr günstige Umweltbilanz im Vergleich zu klassischen Ziegeln, da keine energieintensiven Brennkammern oder Autoklaven durchlaufen werden müssen. Das spart signifikant Primärenergie (Graue Energie)."
      },
      anwendungen: "Tragende Außen- und Innenwände, einschaliges monolithisches Mauerwerk im Wohnungsbau, exzellente hochschalldämmende Brandschutzwände.",
      produkte: "Leichtbeton-Vollsteine, Hohlblocksteine (Hbl), modernste Plansteine mit maschinell integrierten Mineralwolle- oder EPS-Dämmstoff-Pads.",
      dauerhaftigkeit: "Hervorragend. Die Steinstruktur ist im nassen Zustand feuchtigkeitsstabil, unempfindlich gegenüber Frost-Tau-Zyklen und weist ein extrem geringes materialspezifisches Schwindverhalten auf.",
      kosten: "Im mittleren Preissegment angesiedelt. Zeichnet sich durch eine sehr wirtschaftliche, dauerhafte Erstellung schall- und wärmetechnisch anspruchsvoller Fassaden aus.",
      recycling: "Der mineralische Materialverband kann einfach geschreddert und als RC-Leichtzuschlagstoff in frischen Leichtbetonen oder als Schüttgut im Straßen- und Erdbau kreislaufgeführt werden.",
      besonderheiten: "Weist einen unerreicht griffigen Putzhaftgrund auf, da die Steinoberfläche stark strukturbestimmt und rauh ist. Mörteltaschen an den Stoßfugen sind vollflächig zu vermörteln.",
      innovationen: "Plansteine mit integrierter, nachwachsender Hanffaser-Dämmstofffüllung. Reduktion des CO₂-Zementanteils durch Substitution mit hochreaktiven Flugaschen oder Geopolymeren.",
      historie: "Bereits das antike Rom nutzte leichten vulkanischen Bimsstein (Puzzolane) für die gewichtsreduzierte Betonkuppel des Pantheons (Opus Caementitium). Im 19. Jahrhundert etablierte sich der Abbau im rheinischen Bimskammer-Gebiet, während die Erfindung des industriellen Blähtons (1917) den modernen Leichtbetonbau begründete."
    }
  },
  lehmstein: {
    name: "Lehmbausteine",
    subtitle: "Luftgetrocknete, ungebrannte Ton-Mauersteine nach DIN 18945 für wohngesundes Bauen",
    sections: {
      rohstoffe: "Baulehm (physikalische bindige Tonsubstanz, Schluff, Sand) sowie pflanzliche Zuschlagstoffe (Kaff, Stroh, Gräser oder Flachsfasern als Schwindrissschutz).",
      herstellung: "Verkneten der anstehenden Lehmmischung, Pressen der Grünlinge in automatischen Schlagformpressen und anschließende rein passive, CO₂-freie Lufttrocknung in offenen Lagerräumen an der Umgebungsluft.",
      eigenschaften: {
        technisch: "Geringe Steinfestigkeiten (fbl ≈ 2 bis 5 MPa). Rohdichte hoch (1200-2000 kg/m³). Mechanisch hochempfindlich gegenüber fließendem Wasser (Erosionsgefahr). Phänomenale, extrem rasche Sorption von Luftfeuchtigkeit (reguliert Raumluft auf ca. 50%).",
        oekologisch: "Der ultimative Champion ökologischer Baustoffe. Nahezu keine graue Herstellungsenergie, da kein Brennen und kein Zementbinder genutzt werden. Vollkommen klimaneutral und ungiftig."
      },
      anwendungen: "Nichttragender Innenausbau (Gefach-Ausmauerungen, feuchteregulierende Trennwände), Sanierung historischer Fachwerkhäuser, Deckenbeschwerungen als Raumschalldämpfung.",
      produkte: "Lehmsteine (Anwendungsklassen Ia für verputztes trockenes Mauerwerk, Ib, sowie Klasse II für reine trockenverlegte Innenausbauten), Lehmplatten.",
      dauerhaftigkeit: "Im dauerhaft feuchtegeschützten Innenbereich unbegrenzt haltbar. Ungebrannter Lehm ist stark wasserlöslich, weshalb das Mauerwerk vor direktem Regenkontakt und Spritzwasser geschützt werden muss.",
      kosten: "Geringe Rohstoffkosten, jedoch führen handwerkliche Verlegezeiten und die Nischenproduktion von Lehmfertigteilen zu leicht erhöhten Gesamtkosten. Extrem lohnend bei Eigenleistungen.",
      recycling: "Der Inbegriff perfekten Recyclings: Ausgebauter Lehm lässt sich ohne Qualitätsverluste unendlich oft einsumpfen, kneten, verformen und wieder vermauern – absolut rückstandsfrei für Umwelt und Deponie.",
      besonderheiten: "Konstruktions-Tipp: Muss zwingend mit speziellem Lehmmörtel ohne Zementzusatz vermauert werden, um elastische, rissfreie Verbundkoeffizienten zu gewährleisten. Trocknungsphasen sind abzuwarten.",
      innovationen: "Industrieller 3D-Druck von raumumschließenden Stampflehmelementen aus Baugrubenaushub; hydraulisch hochdruckgepresste Lehm-Plansteine zur Unterstützung tragender Funktionen nach der brandneuen DIN 18940.",
      historie: "Zusammen mit geflochtenen Holzkonstruktionen der älteste gemauerte Werkstoff der Menschheit (historische Bauten im fruchtbaren Halbmond vor ca. 9.000 Jahren). Über Jahrhunderte dominierte er als Ausfachung im Lehmfachwerkbau Nordeuropas und feiert heute wegen seiner unschlagbaren Kreislauf- und Klimabilanz eine glorreiche Wiederkehr."
    }
  },
  putzemoertel: {
    name: "Putze & Mörtel",
    subtitle: "Mineralische Bindemittel und Gesteinskörnungen zur Mauerwerksverbindung und Oberflächenbeschichtung",
    sections: {
      rohstoffe: "Gemisch aus primären mineralischen Bindemitteln (Baukalk nach DIN EN 459, Portlandzement nach DIN EN 197 oder Gips nach DIN EN 13279), Gesteinskörnungen (feiner Grubensand, Quarzsand mit Kornstufen 0-1, 0-2 oder 0-4 mm) sowie rheologischen Additiven (Methylcellulose als Wasserrückhaltemittel, Luftporenbildner).",
      herstellung: "Industrielle Trockenmörtelherstellung im Werk durch exakte, computergesteuerte Dosierung der Silokomponenten. Homogene Vormischung im Intensivmischer. Auslieferung erfolgt als Sackware oder trocken im Baustellensilo mit nachgeschaltetem Durchlaufmischer.",
      eigenschaften: {
        technisch: "Klassifizierung über Festigkeitsklassen (Mörtelklasse M1 bis M20 nach DIN EN 998-2; Putzmörtelklasse GP, LW, CR nach DIN EN 998-1). Druckfestigkeiten liegen im Bereich von ca. 1.0 - 5.0 MPa (Putz) bzw. bis zu 20 MPa (Zementmörtel), E-Modul muss im Putzsystem von innen nach außen abnehmen.",
        oekologisch: "Ökologische Bilanz ist abhängig vom Bindemittelanteil: Zementreiche Mörtel besitzen das höchste Treibhauspotenzial; reine Kalk- oder Gipsmörtel weisen durch deutlich schonendere Rohstoffverarbeitung (niedrige Brenntemperaturen) einen geringeren Carbon Footprint auf."
      },
      anwendungen: "Verbindung von Mauersteinen (Lager- und Stoßfuge). Putzsysteme zur Oberflächenglättung, zum Wetterschutz, zur Regulation des Raumklimas und als Tragmedium für dekorative Anstriche sowie als integraler Bestandteil von Wärmedämmverbundsystemen (WDVS).",
      produkte: "Normalmauermörtel (NM), Leichtmauermörtel (LM) mit Perlitbeimischung zur Kältebrückenvermeidung, Dünnbettmörtel (DM). Unterputze (Kalk-Zementpuz), Oberputze (Scheibenputz, Kratzputz), Sanierputze (DIN EN 998-1) zur Salzeinlagerung bei feuchtem Mauerwerk.",
      dauerhaftigkeit: "Sehr hohe Dauerhaftigkeit im Innenbereich. Im Außenbereich stark schlagregenexponiert. Putzrisse führen zu Frostschäden. Elastizität und Abstimmung der Festigkeiten (Grundregel: 'Weich auf Hart' – der Putz muss immer weicher/verformbarer sein als das darunterliegende Mauerwerk) verhindern Risse.",
      kosten: "Äußerst wirtschaftliche Schichtbaustoffe. Normalmörtel-Sackware ist mit 5-8 € pro 25 kg sehr preisgünstig. Dünnbettkleber ist kilogrammbezogen teurer, kompensiert dies aber durch extrem geringen Materialverbrauch (nur ca. 1-3 mm Fugendicke anstelle von 12 mm).",
      recycling: "Als mineralisches Mischsystem im Verbund schwer stofflich im Hochbau einzusetzen. Im Zuge von Sanierung und Abbruch wird verputztes Mauerwerk als herkömmlicher Bauschutt deponiert, gebrochen oder im Tiefbau als Füllmaterial oder Straßenbau-Unterbau thermisch-mechanisch verwertet.",
      besonderheiten: "Eindringende Baufeuchte im frisch verputzten Zustand zwingend meiden. Auf WDVS-Platten ist der Putzaufbau sorgfältig diffusionsoffen auszuführen, um der Taupunktverschiebung im winterlichen Abkühlungszyklus ohne bauphysikalischen Feuchtigkeitsstau zu trotzen.",
      innovationen: "Entwicklung von Aerogel-Hochleistungsdämmputzen mit Wärmeleitfähigkeiten von λ ≈ 0.028 W/(m·K) zur energetischen Altbausanierung im Denkmalschutz. Selbstreinigende hydrophobe Putze mit Lotuseffekt. Faserarmierte Funktionsputze zur Minimierung von Schwundrissen.",
      historie: "Schon in der Vorgeschichte (ca. 7.000 v. Chr.) wurden Putze aus Gips und Lehm aufgetragen. Vulkansande erlaubten den Römern die Entwicklung hochfester Luft- und Wasserkalke. Mit der Etablierung des Portlandzements im 19. Jahrhundert wuchs das Portfolio der Außenputze zu widerstandsfähigen Mehrschichtsystemen."
    }
  },
  gips: {
    name: "Gips-Baustoffe",
    subtitle: "Luftbindemittel auf Calciumsulfat-Basis für Stuck, Putz und Trockenbaukonstruktionen",
    sections: {
      rohstoffe: "Natürliches Gipsgestein (Calciumsulfat-Dihydrat) aus dem Tagebau oder künstlich anfallender REA-Gips (Rauchgasentschwefelungsanlagen von Kohlekraftwerken). Mit dem Kohleausstieg geht REA-Gips zurück; ersetzt wird er v. a. durch Naturgips und zunehmend durch Recyclinggips..",
      herstellung: "Industrielles Brennen (Entwässern) des Dihydrats bei relativ niedrigen Temperaturen (100-180 °C) zu Stuckgips (Halbhydrat). Bei höheren Brenntemperaturen entsteht zunächst löslicher Anhydrit III (ca. 180–300 °C), ab ca. 300–500 °C schwerlöslicher Anhydrit II. Das getrocknete Pulver wird gemahlen und paketiert oder direkt zu Plattenware geformt.",
      eigenschaften: {
        technisch: "Erhärtet extrem schnell (Bindezeit 10-30 Min, steuerbar durch Verzögerer). Druckfestigkeit liegt typischerweise bei 5 - 15 MPa. Rohdichte von Gipsplatten beträgt ca. 650-900 kg/m³. Das System dehnt sich beim Abbinden kristallin um ca. 1% aus (hervorragend für Gussarbeiten).",
        oekologisch: "Sehr vorteilhafter CO2-Fußabdruck dank geringer Prozesstemperaturen (Brennen erfordert deutlich weniger Energie als Zementkalk-Sintern). Einweg-Kohleausstieg verringert jedoch langfristig die Verfügbarkeit von billigem REA-Gips, wodurch Natursteinabbau oder Gipsrecycling an Relevanz gewinnen."
      },
      anwendungen: "Ausschließlicher Trocken-Innenausbau (Gipskartonplatten zur Beplankung von Leichtmetallständerwänden). Innenwandputze (Kalk-Gipsputz), Spachtelmassen, Brandschutz-Verkleidungen von Holz- und Stahlträgern, Calciumsulfat-Fließestriche im Wohnungsbau.",
      produkte: "Gipskartonplatten (GKB / DIN EN 520), feuchtraumimprägnierte Gipskartonplatten (GKBI, grün durch silikonisierten Gipskern), Feuerschutzplatten (GKF, mit Glasfaserarmierung gegen Gefügezerfall im Brandfall), Gips-Wandbauplatten für massive Leichtwände.",
      dauerhaftigkeit: "Im Trockenbereich extrem formstabil und zeitbeständig. Absolut ungeeignet für den Außenbereich und stark belastete Nasszellen (z.B. öffentliche Duschen): Calciumsulfat besitzt eine stetige Löslichkeit (ca. 2 g/l in Wasser), wodurch Feuchtigkeit das Kristallgitter auflöst und irreversible Festigkeitseinbußen verursacht.",
      kosten: "Enorm wirtschaftliche Systembaustoffe. Standard-Gipskartonplatten gehören mit ca. 3-5 €/m² zu den kostengünstigsten Beplankungsmaterialien des modernen Ausbaus. Fließestriche liegen preislich auf Augenhöhe mit Zementestrichen, sparen aber erhebliche Einbauzeit.",
      recycling: "Theoretisch zu 100 % im geschlossenen Kreislauf (Cradle-to-Cradle) recycelbar. Ausgebaute Gipskartonplatten können mechanisch zerkleinert werden, um Papierkarton vom Gips zu trennen. Das Gipspulver wird erneut gebrannt. Praxisnah verringert schlechte Schutttrennung oft die Recyclingquote.",
      besonderheiten: "Vermeide das berüchtigte 'Ettringittreiben': Gipsbaustoffe dürfen in feuchtem Zustand niemals in direkten Verbund mit Portlandzement gelangen! Die freien Sulfate des Gipses reagieren mit den Aluminaten des Zements unter enormem Volumenwachstum (Sprengwirkung).",
      innovationen: "Entwicklung von Trockenbauplatten mit Phasenwechselmaterialien (PCM-Mikrokapseln mit Wachs), die tagsüber latent Wärme speichern und nachts abgeben, um das sommerliche Überhitzen von Leichtbauten passiv zu drosseln.",
      historie: "Gipsmörtel diente bereits beim Bau der ägyptischen Pyramiden von Gizeh als Fugen- und Gleitbeschleuniger. Die Römer schätzten fein gebrannten Stuckgips für repräsentative Dekore. Die moderne Gipsplatte wurde 1894 vom US-amerikanischen Erfinder Augustine Sackett patentiert und bildet das Fundament des modernen Trockenbaus."
    }
  },
  kalk: {
    name: "Baukalk (Luft- und Wasserkalk)",
    subtitle: "Traditionelle und moderne Kalkbindemittel nach DIN EN 459 für Putze und Denkmalpflege",
    sections: {
      rohstoffe: "Ausgangsstoff ist kohlensaurer Kalk (Kalkstein, Calciumcarbonat CaCO3) mit unterschiedlichen Reinheitsgraden (z. B. weißer Kreidekalk oder magnesiumhaltiger Dolomitkalk) sowie kieselsäurehaltige, tonige Beimengungen bei hydraulischen Wasserkalken.",
      herstellung: "Das Gestein wird im Kalkschachtofen bei ca. 900-1100 °C gebrannt (Kalzinierung zu Branntkalk CaO). Anschließend erfolgt das gesteuerte Trocken- oder Nasslöschen mit Wasser zu Löschkalk Ca(OH)2 (Löschriesel oder Sumpfkalk). Erhärtung erfolgt durch zyklische Rückkarbonatisierung unter CO2-Aufnahme aus der Luft.",
      eigenschaften: {
        technisch: "Sehr langsame Festigkeitsentwicklung. Die Enddruckfestigkeit reiner Luftkalkmörtel ist gering (ca. 1 - 3 MPa). Hohe Diffusions- und Kapillaroffenheit (Wasserdampf-Diffusionswiderstandszahl μ ≈ 5-10). Niedriger E-Modul, dadurch elastisch und überaus spannungsarm verformbar.",
        oekologisch: "Das beim Brennen ausgetriebene CO2 wird während des jahrzehntelangen Lebenszyklus des Bauwerks durch die kontinuierliche Karbonatisierung wieder fast vollständig aus der Luft aufgenommen und gebunden (Kalkkreislauf (beim Brennen freigesetztes CO₂ wird bei der Erhärtung teilweise wieder gebunden))."
      },
      anwendungen: "Traditionelle Innen- und Außenputze. Einzelfugenmörtel im Denkmalschutz, da der weiche Mörtel thermische Zerrungen rissfrei puffert. Historische Kalkanstriche (Kalkmilch) zur ökologischen Desinfektion von Kellern, Ställen und feuchtebelasteten Bauteilen.",
      produkte: "Weißkalk (CL 90, CL 80, CL 70), Baukalke mit hydraulischen Eigenschaften (HL), Natürlich hydraulischer Kalk (NHL 2, NHL 3.5, NHL 5) für Außenbereiche und Trass-Kalk-Mörtel zur spurenfreien Natursteinrestaurierung.",
      dauerhaftigkeit: "Sehr dauerhaft in mäßig feuchtem, luftigem Umfeld. Extrem kalkunverträglich sind dauerhafter Frost in der Abbindephase und schwefelhaltige Luftschadstoffe (saurer Regen wandelt den Kalkstein unter Volumenvergrößerung lokal in bauschädlichen, weichen Gips um).",
      kosten: "Baukalk als Grundstoff ist ein unschlagbar günstiges Massengut (Sackware ca. 5-10 €). Die handwerkliche Verarbeitung (insbesondere Sumpfkalkverarbeitung in der Restaurierung) erfordert jedoch hohes Fachwissen und ist sehr lohnintensiv.",
      recycling: "Stoffliches Recycling ist unkompliziert. Carbonatisiertes Kalkmörtelmauerwerk lässt sich einfach brechen und im Zuge des Betonrecyclings als Kreislaufmaterial einsetzen, da es ungiftige, rein mineralische Calcitstrukturen aufweist.",
      besonderheiten: "Frischer, ungehärteter Löschkalk besitzt durch seinen extrem hohen pH-Wert (ca. 12.6) eine stark alkalische, ätzende Wirkung. Bei Haut- und Augenkontakt drohen irreversible Verätzungen (Erblindungsgefahr!). Strenge persönliche Schutzausrüstung zwingend erforderlich.",
      innovationen: "Entwicklung von carbonatisierenden Nanokalk-Suspensionen zur zerstörungsfreien Festigung von sandenden, historischen Fresken und Denkmälern. Einmischen von kohlensäure-katalysierenden Enzymen zur extremen Beschleunigung der Luftkalkhärtung.",
      historie: "Kalkbrennen gehört zu den ältesten thermischen Prozessen der Menschheit (nachgewiesen im antiken Göbekli Tepe um 9.000 v. Chr.). Römische Architekten formulierten ausgefeilte Rezepturen für hydraulische Kalke. Im 19. Jahrhundert wurde der Luftkalk durch die Erfindung des künstlichen Portlandzements in tragenden Bereichen verdrängt."
    }
  },
  lehmbau: {
    name: "Lehm im Bauwesen",
    subtitle: "Ökologische Baustoffe aus Ton, Schluff und Sand für Stampflehm, Lehmsteine und Designputze",
    sections: {
      rohstoffe: "Natürlich vorkommende Lehmvorkommen. Lehm ist ein physikalisches Gemisch aus tonigen Mineralien (als Bindemittel), Schluff (Feinstsand als Füllstoff) und Sand/Kiesen (als Stützgerüst). Oft mit organischen Zuschlägen (Stroh, Hanffasern) versetzt.",
      herstellung: "Lehm wird trocken oder erdfeucht abgebaut, mechanisch aufbereitet (Zerkleinerung von Tonklumpen) und gemischt. Im Gegensatz zu Zement oder Kalk wird Lehm nicht gebrannt. Er härtet rein physikalisch durch den Entzug von Wasser beim Trocknen aus (reversibles Bindemittel).",
      eigenschaften: {
        technisch: "Geringe Druckfestigkeit (0.5 - 4.0 MPa). Hohe Trockenrohdichte bei Stampflehm (1.700-2.100 kg/m³). Überragende Sorptionsfähigkeit (puffert Feuchtespitzen der Raumluft und wirkt ausgleichend auf die relative Luftfeuchte). Wasserlöslich und quellfähig bei Wasserzufuhr. Schwindmaß beim Trocknen beträgt ca. 1-4%.",
        oekologisch: "Spitzenreiter im ökologischen Bauen. Keine Brennprozesse zur Herstellung nötig, daher sehr geringe graue Energie und niedriges Treibhauspotenzial (Aufbereitung, Trocknung und Transport verursachen dennoch Emissionen). Hervorragende CO2-Bilanz. Kann vollständig schadstoff- und abfallfrei in die Natur zurückgeführt werden."
      },
      anwendungen: "Durch die Produktnormen DIN 18945–18948 und die Bemessungsnorm DIN 18940 (2023) ist tragendes Lehmsteinmauerwerk im Anwendungsbereich der Norm ohne Einzelfallgenehmigung möglich; andere Bauweisen (z. B. tragender Stampflehm) benötigen weiterhin vBG bzw. ZiE. Ausmauerung von Gefachen im Fachwerkbau. Lehmbauplatten als ökologischer Trockenbau. Einschubdecken mit Lehmwickeln als Schall- und Hitzeschutz im Holzbau. Lehm-Dekorputze.",
      produkte: "Lehmsteine (DIN 18945) für aussteifendes Mauerwerk, Lehmmörtel (DIN 18946), Lehmputzmörtel (DIN 18947) zur Dünnschichtverputzung, gebrauchsfertige Lehmbauplatten (DIN 18948) für Wandverkleidungen im Holzständerbau.",
      dauerhaftigkeit: "Im trockenen, vor Schlagregen geschützten Innenbereich unbegrenzt haltbar (jahrhundertelange Überlebensdauer historischer Fachwerkhäuser bewiesen). Im Außenbereich ist Lehm ohne konstruktiven Wetterschutz (Dachüberstand, Sockelabdichtung) extrem frost- und erosionsanfällig.",
      kosten: "Rohmaterialpreis vor Ort im Kieswerk ist unschlagbar billig. Durch den hohen Anteil an handwerklicher Eigenarbeit und zeitintensive Trocknungszyklen im modernen Maschineneinsatz sind Fertigbauprodukte (z.B. Lehmputze, Platten) materialseitig ca. 30-50% teurer als Gips.",
      recycling: "Unstabilisierter, schadstofffreier Lehm lässt sich durch Anfeuchten nahezu verlustfrei wiederverwenden – ein außergewöhnlich hohes Recyclingpotenzial (gilt nicht für zementstabilisierte oder verunreinigte Lehme): Ausgetrockneter oder abgebrochener reiner Lehm muss lediglich mit Wasser angefeuchtet und geschlämmt werden, um sofort wieder als vollwertiger neuer Putz oder Mörtel eingebaut zu werden.",
      besonderheiten: "Achten Sie auf das lineare Schwindverhalten beim Trocknen. Zu schnelles Entziehen des Anmachwassers durch Hitze oder Zugluft verursacht tiefe Trocknungsrisse. Im tragenden Stampflehmbau sind abschnittsweise Schwindfugen konstruktiv einzuplanen.",
      innovationen: "Einsatz von Robotik zur automatisierten additiven Fertigung (3D-Druck) großformatiger, tragender Wohnhäuser aus lokal vor Ort ausgehobener Lehmerde. Carbonfaser-verstärkte, sprühfähige Lehm-Innenputze mit erhöhter Stoßfestigkeit.",
      historie: "Seit der Jungsteinzeit prägt der Lehmbau weltweit die menschliche Architektur (z.B. die mehrgeschossigen Lehmziegelbauten (Adobe) von Shibam im Jemen oder Stampflehmabschnitte der Chinesischen Mauer). Trotz des Aufstiegs industrieller Zemente wohnen heute schätzungsweise immer noch rund ein Drittel aller Menschen weltweit in traditionellen Lehmbauten."
    }
  },
  erdbau: {
    name: "Erdbau & Baugrund",
    subtitle: "Böden als Baustoff, Gründungsträger, Bodenverbesserung und Füllmaterialien",
    sections: {
      rohstoffe: "Natürliche Bodenformationen bestehend aus Lockergesteinen. Einteilung in bindige Böden (Ton, Schluff mit hohem Wasserbindevermögen) und nichtbindige/grobkörnige Böden (Sand, Kies mit hoher mechanischer Reibung) sowie organische Gemische (Mutterboden, Torf).",
      herstellung: "Gewinnung durch Erdaushub mittels Bagger, Planierraupen und Scrapern. Zur Optimierung als Tragschicht wird der anstehende Boden mechanisch stufenweise verdichtet (Vibrationswalzen) oder durch das Einmischen hydraulischer Bindemittel (Zement oder Kalk) chemisch verbessert.",
      eigenschaften: {
        technisch: "Einteilung nach DIN 18196 (Bodenklassifikation). Korngrößenverteilung entscheidet über die Verdichtbarkeit (Proctorversuch). Scherfestigkeit (Scherwinkel φ und Kohäsion c) bestimmt die Standsicherheit von Böschungen. Durchlässigkeitsbeiwert (k_f-Wert) reicht von durchlässig bis abdichtend.",
        oekologisch: "Regionale Weiternutzung von Aushubböden spart immense CO2-Emissionen durch den Wegfall von LKW-Transporten. Bei Zementstabilisierungen entsteht jedoch ein erheblicher sekundärer CO2-Einfluss durch die Klinkerbindung im Erdkorpus."
      },
      anwendungen: "Straßen- und Bahndammbau, Deponieabdichtungen (tonige Schluffe), herstellen von Baugruben und Gründungssohlen, Hinterfüllung von Brückenbauwerken und Kellerwänden, Erosions- und Hochwasserschutzdeiche im Wasserbau.",
      produkte: "Lieferbare mineralische Baustoffgemische für Pflasterbettungen, Frostschutzschichten (FSS nach ZTV SoB-StB), Schottertragschichten (STS), tonige Dichtungsbahnen (Bentonitmatten) und geotechnische Textilien zur Bodenseparierung.",
      dauerhaftigkeit: "Sehr dauerhaft bei kontrollierter Entwässerung. Bindige Böden sind hochgradig frost- und schwellanfällig: Gefrierendes Wasser dehnt sich aus, bildet Eislinsen und verursacht Hebungen; beim Auftauen sackt der Boden schlammig zusammen (Tragfähigkeitsverlust).",
      kosten: "Boden vor Ort ist kostenlos bzw. verursacht kalkulatorisch Abfuhr- und Deponiekosten (30-120 €/t je nach Schadstoffklasse wie Z0-Z5). Bodenaustausch ist sehr kostenintensiv, weshalb In-situ-Bodenverbesserungen (Bodenstabilisierung mit Kalk) oft wirtschaftlicher sind.",
      recycling: "Böden sind zu 100 % recyclingfähig, solange sie schadstofffrei sind (LAGA PN 98 Probenahme). Aufbereitung kontaminierter Böden erfolgt in Bodenwaschanlagen, mikrobiologischen Behandlungszentren oder durch thermische Dekontamination.",
      besonderheiten: "Kritischer Gründungsfehler: Bauen auf ungenügend verdichtetem Boden. Bei anorganischen, bindigen Gesteinen führt Belastung zu langsamen Porenwasser-Überdruck-Entlastungen, was zu zähen, monatelangen Setzungen und Rissbildungen im Tragwerk führt.",
      innovationen: "Biogrout: Verfestigung von rolligen Sandböden durch Mikrobiell Induzierte Calcitpräzipitation (MICP). Injizierte Harnstoff-abbauende Bakterien zementieren den losen Boden geräusch- und erschütterungsfrei zu festem Sandstein im Baugrund.",
      historie: "Die systematische Bodenbewegung und Erddammgründung bildeten das Rückgrat früherer Verkehrswege (antike Römerstraßen wie die Via Appia) und Verteidigungsanlagen. Die wissenschaftliche Erfassung begann 1925 durch Karl von Terzaghi mit seiner 'Erdbaumechanik', die als Geburtsstunde der akademischen Geotechnik gilt."
    }
  },
  glas: {
    name: "Glas im Hochbau",
    subtitle: "Sicherheits- und Funktionsgläser für moderne Tragwerke, transparente Fassaden und Wärmeschutz",
    sections: {
      rohstoffe: "Siliziumdioxid (Quarzsand ca. 70-75 % as Netzwerkbildner), Soda (Natriumcarbonat ca. 12-15 % als Flussmittel zur Senkung der Schmelztemperatur), Kalkstein (Calciumcarbonat ca. 9-12 % als Stabilisator für chemische Beständigkeit) sowie Altglasbruch.",
      herstellung: "Die Rohstoffmischung wird im Glasschmelzofen bei ca. 1500-1600 °C geschmolzen. Bei Floatglas fließt das flüssige Glasband kontinuierlich auf ein langes Bad aus flüssigem Zinn (Floatprozess), kühlt dort absolut plan und spannungsfrei ab und wird geschnitten.",
      eigenschaften: {
        technisch: "Enorm druckfest (> 700-900 MPa), aber geringe Biegezugfestigkeit (ca. 45 MPa für Float, gesteigert durch thermischen Vorspannprozess bei ESG auf ca. 120 MPa). Sprödes Bruchverhalten ohne jegliche Vorwarnung. Dichte beträgt 2500 kg/m³. Transmission bis 90%.",
        oekologisch: "Energieintensives Schmelzen verursacht hohe Treibhausgase (ca. 0.8-1.2 kg CO2-Äq./kg Flachglas). Die hohe Lebensdauer und die Senkung des Heizenergiebedarfs durch moderne Dreifach-Wärmeschutzverglasungen mit Low-E-Beschichtung kompensieren dies jedoch im Betrieb."
      },
      anwendungen: "Transparente Gebäudehüllen (Pfosten-Riegel-Fassaden), Fensterflächen zur solaren Wärmegewinnung, Überkopfverglasungen (Vordächer), absturzsichernde Brüstungen, begehbare Glasböden, tragende Glasschwerter zur Windlastabtragung bei Glasfassaden.",
      produkte: "Floatglas (Standard-Kalknatronglas), Einscheibensicherheitsglas (ESG - thermisch vorgespannt), Verbundsicherheitsglas (VSG - zwei Scheiben verbunden mit zähelastischer PVB-Folie), Mehrscheiben-Isolierglas (MIG) mit Edelgasfüllung (Argon).",
      dauerhaftigkeit: "Nahezu unbegrenzt alterungs- und witterungsbeständig gegen UV-Einstrahlung, Wasser und Standardchemikalien. Gefährdet durch thermische Spannungsbrüche bei stark ungleichmäßiger Erwärmung (z.B. Teilabschattung der Scheibe im Sommer ohne polierte Kanten).",
      kosten: "Flachglas ist als Massenprodukt relativ preiswert. Hochfunktionale Sicherheits- und Verbundsysteme wie VSG mit integriertem Sonnenschutz und Edelgaskammern gehören jedoch zu den gehobenen Investitionskosten des modernen Ingenieurbaus (100-250 €/m²).",
      recycling: "Scherben aus der Produktion sind zu 100 % im Schmelzofen recycelbar, was Schmelzenergie spart. Herausforderung im Rückbau: Ausgebaute Verbundgläser (VSG) erfordern das aufwendige mechanische Trennen der PVB-Sicherheitsfolien von den klebrigen Glasschichten.",
      besonderheiten: "Spontanbruchgefahr bei ESG durch winzige Nickelsulfid-Einschlüsse (NiS), die sich verzögert im Glasgefüge ausdehnen. Wichtigste Sicherheitsregel: Für ESG im Fassadenbereich immer den Heat-Soak-Test (Heißlagerungsprüfung nach DIN EN 14179) vorschreiben!",
      innovationen: "Elektrochromes Glas (schaltbares Smart Glass), das sich per Knopfdruck oder sensorabhängig zur Reduktion solarer Lasten von transparent auf dunkeltürkis einfärbt. Vakuumisolationsglas (VIG) mit hochdämmenden Mikrogitterstäben für minimalste Bautiefe.",
      historie: "Die Phönizier und Ägypter stellten vor ca. 4.000 Jahren erstes Glas her. Die Römer verglasten ab dem 1. Jh. n. Chr. erste repräsentative Villenfenster. Nach dem Londoner Kristallpalast (1851) und Erfindung des kontinuierlichen Zylinderblasverfahrens markierte die Entwicklung des Floatglasprozesses durch Alastair Pilkington (1959) die Moderne."
    }
  },
  stahl: {
    name: "Baustahl & Konstruktionsstahl",
    subtitle: "Duktiler Konstruktions- und Bewehrungsstahl für den Stahlbau und Stahlbetonbau",
    sections: {
      rohstoffe: "Eisenerz, Koks (Kohlenstoffträger) und Zuschlagstoffe (Kalk) beim Primärweg (Hochofenroute) sowie fast ausschließlich Stahlschrott und recycelte Legierungsmetalle beim ressourcenschonenden Sekundärweg (Elektrolichtbogenofen-Route).",
      herstellung: "Erschmelzen des Vormaterials im Hochofen oder Elektroofen, Entkohlen und Frischen im Konverter (Reduktion des Kohlenstoffgehaltes auf unter 2.0% zur Erzielung der Verformbarkeit). Vergießen im Stranggussverfahren und anschließendes Warmwalzen zu Profilen.",
      eigenschaften: {
        technisch: "Hervorragende Zug- und Druckfestigkeit (Streckgrenze f_y von 235 MPa bei S235 bis über 460 MPa bei hochfestem Stahl; Bewehrungsstahl B500B f_yk = 500 MPa). Extrem ausgeprägte Duktilität (elastisch-plastisches Verformungsverhalten). E-Modul E = 210.000 N/mm².",
        oekologisch: "Hochofenroute ist energieintensiv und stößt erhebliche Mengen CO2 aus (ca. 1.8-2.2 t CO2/t Stahl). Der Sekundärweg über Altstahlschrott im Elektrolichtbogenofen reduziert die CO2-Emissionen um ca. 70-80 % auf unter 0.4 t CO2/t."
      },
      anwendungen: "Skeletttragwerke von Hallen- und Hochhäusern, Brückenbau, Fachwerkträger, Schweißkonstruktionen, Bewehrungseinlagen (Betonstahlmatten und Stabstahl) im Verbundbaustoff Stahlbeton zur sicheren Aufnahme der entstehenden Zugkräfte.",
      produkte: "Walzprofile (Breitflanschträger HEA, HEB, HEM und IPE nach DIN 1025), Hohlprofile für Stützen, Betonstahlstäbe (B500B nach DIN 488), Betonstahlmatten (Q- und R-Matten), hochfeste Spannstähle für vorgespannten Beton.",
      dauerhaftigkeit: "Sehr dauerhaft bei dauerhaftem Ausschluss von Feuchtigkeit und Sauerstoff. Unlegierter Baustahl ist korrosionsanfällig (Rostbildung). Ein verlässlicher Korrosionsschutz (Feuerverzinkung, Schutzbeschichtung nach DIN EN ISO 12944) ist obligatorisch.",
      kosten: "Stahleinkaufspreise unterliegen volatilen Weltmarktschwankungen (ca. 600-1.200 €/t im Großhandel). Stahlkonstruktionen erfordern zudem eine hohe Präzision bei Vorfertigung und Schweißarbeiten, was die Gesamtkosten im Vergleich zu Beton anhebt.",
      recycling: "Baustahl ist sehr gut und mehrfach recycelbar; Begleitelemente (z. B. Kupfer) können sich im Schrottkreislauf anreichern.",
      besonderheiten: "Statische Brandschutz-Schwachstelle: Baustahl behält bei 500 °C noch rund 78 % der Streckgrenze, bei 600 °C nur noch rund 47 % (DIN EN 1993-1-2, Tab. 3.1). Brandschutzbekleidungen vorsehen.",
      innovationen: "Wasserstoffbasiertes Direktreduktionsverfahren (klimaneutraler Stahl ohne fossilen Koks). Entwicklung metastabiler austenitischer Stähle mit hohem Festigkeitspotenzial. Hoch-korrosionsbeständiger Bewehrungsstahl.",
      historie: "Die Eisen- und Metallurgie entwickelte sich über Jahrtausende vom handwerklichen Schmieden im Rennfeuer zum industriellen Thomas- und Bessemer-Verfahren im 19. Jahrhundert. Mit der großtechnischen Verbreitung des Siemens-Martin- und LD-Verfahrens im 20. Jahrhundert avancierte Stahl zum universellen und extrem duktilen Spitzenbaustoff."
    }
  },
  metalle: {
    name: "Nichteisenmetalle im Bauwesen",
    subtitle: "Kupfer, Aluminium, Zink und Blei als Spezialwerkstoffe für Gebäudehüllen und Dächer",
    sections: {
      rohstoffe: "Natürlich vorkommende Erzvorkommen wie Bauxit (für Aluminium), Kupferkies/Chalkopyrit (für Kupfer) sowie Galmei/Zinkblende (für Zink). Zudem spielt der Sekundärrücklauf von Metallschrotten eine dominierende Rolle im Schmelzkreislauf.",
      herstellung: "Elektrolytische Reduktion (beispielsweise das Hall-Héroult-Verfahren für Aluminium unter hohem Stromeinsatz) oder pyrometallurgische Verhüttung der Erze. Die Reinmetalle werden legiert, im Strangguss gegossen und zu Dünnblechen oder stranggepressten Profilen umgeformt.",
      eigenschaften: {
        technisch: "Gerings Gewicht bei hoher Festigkeit bei Alulegierungen (Dichte ca. 2700 kg/m³). Hervorragende thermische Leitfähigkeit (λ > 110 - 220 W/(m·K)) und elektrische Leitfähigkeit. Hohe Wärmeausdehnungskoeffizienten (Gefahr thermischer Dehnungspannungen).",
        oekologisch: "Die Primärgewinnung von Aluminium ist extrem strom- und treibhausgasintensiv. Das Recycling von Nichteisenmetallen benötigt dagegen nur ca. 5 % der Primärenergie, weshalb Altschrott-Einsatzquoten von über 85% eine sensationell gute Ökobilanz liefern."
      },
      anwendungen: "Dachdichtungen und Scharenbleche (Zink, Kupfer, Blei), Pfosten-Riegel-Fassadenprofile (Aluminium), First- und Kehlbleche, Regenrinnen und Fallrohre zur Entwässerung, korrosionsbeständige Leitungen im Sanitär- und Elektrobereich.",
      produkte: "Titanzinkbleche (DIN EN 988) für Stehfalzdächer, Aluminiumbleche und -fassadenpaneele, Kupferrohre für Installationssysteme, Blei-Dichtungsstreifen für Schornsteinanschlüsse und Übergänge.",
      dauerhaftigkeit: "Hervorragende inhärente Beständigkeit im Außenbereich durch Selbstpassivierung: Aluminium bildem eine hauchdünne Aluminiumoxidschicht; Kupfer entwickelt die charakteristische grüne Patina (Kupfercarbonat). Schadensgefahr durch Kontaktkorrosion bei direktem Kontakt.",
      kosten: "Deutlich teurer im Vergleich zu Baustahl und Beton. Der Quadratmeterpreis für Stehfalzdeckungen aus Titanzink oder Kupfer liegt bei hohen 80-150 €/m² für das Material, kompensiert sich aber durch absolute Wartungsfreiheit über Jahrzehnte.",
      recycling: "Nichteisenmetalle weisen im Baubereich extrem hohe Rücklaufquoten auf (> 95%), da die Restmaterialien einen sehr hohen Schrottwert besitzen. Die Metalle werden verlustgetreu geschmolzen und ohne Qualitätsminderung zu neuen Walzfabrikaten verarbeitet.",
      besonderheiten: "Achten Sie sorgfältig auf die elektrochemische Spannungsreihe zur Vermeidung von Kontaktkorrosion. Titanzinkbleche dürfen niemals im Fließwasserweg hinter Kupferteilen montiert werden, da gelöste Kupferionen die Zinkschicht innerhalb kürzester Zeit durchlöchern.",
      innovationen: "Anodisch oxidiertes Aluminium mit hocheffizienten schmutzabweisenden Nanobeschichtungen gegen städtische Grauschleier. Konstruktiver Einsatz hochelastischer Formgedächtnislegierungen aus Nickel-Titan zur Erdbebenpufferung.",
      historie: "Kupfer und Blei gehören zu den ersten verarbeiteten Metallen der Kupfersteinzeit (ca. 5.000 v. Chr.). Die Römer setzten Blei im großen Stil für Wasserleitungen und Dächer ein. Zinkblech verbreitete sich ab dem frühen 19. Jahrhundert rasant als Korrosionsschutz an Dächern, während Aluminium erst ab ca. 1900 industriell bedeutsam wurde."
    }
  },
  aluminium: {
    name: "Aluminium",
    subtitle: "Leichtmetall mit passivierender Oxidschicht und hoher Formbarkeit im Fassaden- und Profilbau",
    sections: {
      rohstoffe: "Ausgangsstoff ist primäres Bauxit-Erz. Die Hauptelemente werden im Tagebau vor allem in tropischen Regionen (z. B. Guinea, Australien, Brasilien) gewonnen.",
      herstellung: "Bauxit wird im Bayer-Verfahren zu Aluminiumoxid aufgeschlossen. Die anschließende Schmelzflusselektrolyse (Hall-Héroult-Prozess) erzeugt flüssiges Primäraluminium. Durch Strangpressen entstehen komplexe Fenster- und Tragprofile.",
      eigenschaften: {
        technisch: "Geringe Dichte (~2700 kg/m³). E-Modul mit ~70.000 MPa relativ niedrig (1/3 von Stahl). Zugfestigkeiten von legiertem Konstruktionsaluminium liegen zwischen 150 und 350 MPa. Schmelzpunkt bei 660 °C.",
        oekologisch: "Äußerst energieintensive Primärherstellung (hoher Stromverbrauch, ~15-20 kg CO₂-Äq/kg). Der ökologische Fußabdruck verbessert sich jedoch dramatisch bei der Verwendung von Sekundäraluminium (Recycling spart 95% der Energie)."
      },
      anwendungen: "Tragende und nichttragende Profilkonstruktionen für Glasfassaden (Pfosten-Riegel), Fensterrahmen, Dacheindeckungen (Kantbleche, Stehfalz), Solarträger-Strukturen und dekorative Eloxalanbauteile.",
      produkte: "Extrudierte Profile (DIN EN 755), Bleche und Bänder (DIN EN 485), vorgehängte u. belüftete Fassadenplatten (VHF) sowie genormte Legierungen wie AlMgSi0,5 (EN AW-6060).",
      dauerhaftigkeit: "Sehr witterungsbeständig durch die spontane Bildung einer dichten Al₂O₃-Passivschicht. Extrem anfällig ist Aluminium jedoch für Kontaktkorrosion in Kombination mit elektrochemisch edleren Metallen (z.B. Kupfer) und für alkalische Angriffe (z.B. nasser Frischbeton).",
      kosten: "In der Anschaffung teurer als Baustahl. Komplexe profilextrudierte Geometrien steigern den Wert, amortisieren sich jedoch durch das geringe Montagegewicht, einfache Bearbeitbarkeit und Korrosionsfreiheit.",
      recycling: "Hervorragende Kreislauffähigkeit. Fast 100% sortenreiner Altschrott kann ohne Qualitätsverlust eingeschmolzen und wiederverwendet werden. Hoher Restwert motiviert d. Rückbau.",
      besonderheiten: "Unterbinde jeglichen Direktkontakt zu frischem, alkalischem Zementmörtel oder Beton, da der hohe pH-Wert (>12,5) die schützende Oxidschicht auflöst und das Metall zersetzt. Isolierende Trennlagen einplanen!",
      innovationen: "Entwicklung ultra-leichtgewichtiger Aluminium-Lithium-Legierungen mit erhöhter Steifigkeit und Festigkeit für anspruchsvolle Sonderbauten; hoch-selektive Solar-Absorberbeschichtungen für Energie-Fassaden.",
      historie: "Erst im Jahr 1825 isoliert, galt Aluminium anfangs als seltenes Luxusmetall. Die Erfindung der Schmelzflusselektrolyse (1886) senkte die Herstellungskosten massiv. Das weltberühmte Frühe Bauanwendungen von Aluminium finden sich z. B. an Otto Wagners Postsparkasse Wien (1906); das Empire State Building (1931) machte Aluminium als Fassadenwerkstoff populär im Trag- und Architekturbereich, gefolgt vom Boom stranggepresster Fassadenprofile ab 1950."
    }
  },
  kupfer: {
    name: "Kupfer",
    subtitle: "Edles Nichteisenmetall mit exzellenter Leitfähigkeit und hoher Lebensdauer durch Schutzpatina",
    sections: {
      rohstoffe: "Kupferhaltige Sulfiderze (Kupferkies, Buntkupfererz) aus dem Untertage- oder Tagebau (z. B. in Chile, Peru). Hoher Anteil an Kupfer-Recyclingschrotten schont die natürlichen Ressourcen.",
      herstellung: "Mechanische Aufbereitung und Flotation des Erzes, gefolgt vom Schmelzen im Schwebeschmelzofen zu Kupferstein. Die elektrolytische Raffination reinigt das Rohmetall auf über 99,9% Reinheit. Auswalzen zu flexiblen Blechen.",
      eigenschaften: {
        technisch: "Dichte ~8960 kg/m³. Mittlerer E-Modul (~130.000 MPa). Exzellente thermische und elektrische Leitfähigkeit. Hervorragende Duktilität und Verformbarkeit, auch bei eisigen Temperaturen rissfrei kantbar.",
        oekologisch: "Rohstoffgewinnung und Schmelzprozess belasten d. Umwelt. Kupfer besitzt jedoch eine extrem lange Lebensdauer im Bauwerk (oft >200 Jahre), wodurch sich die graue Energie über die Nutzungszeit vollständig relativiert."
      },
      anwendungen: "Witterungsbeständige Dacheindeckungen, traditionelle und moderne Entwässerungssysteme (Dachrinnen, Fallrohre), witterungsexponierte Fassadenbekleidungen und Rohrleitungssysteme für Haustechnik.",
      produkte: "Bänder und Bleche für d. Bauwesen (DIN EN 1172), nahtlose Rundrohre für Wasser und Gas (DIN EN 1057) sowie vorgefertigte Rinnenkupplungen und Formstücke.",
      dauerhaftigkeit: "Extrem alterungsbeständig. Kupfer bildet an der Luft zunächst eine braune Kupferoxid- und später eine dichte, blau-grüne Patina (basische Kupferkristalle), die das darunterliegende Metall dauerhaft vor Abtrag schützt.",
      kosten: "Kupfer gehört aufgrund seiner edlen Eigenschaften und der hohen globalen Nachfrage zu den teuersten Baumetallen im Hochbau. Seine extreme Langlebigkeit macht es langfristig dennoch wirtschaftlich.",
      recycling: "100% unbegrenzt kreislauffähig. Kupferschrott besitzt einen exzellenten materiellen Marktwert, weshalb Rückbaustoffe sortenrein erfasst und vollständig metallurgisch recycelt werden (Upcycling auf Primärniveau).",
      besonderheiten: "Unbedingt die Fließregel beachten: Kupfer darf niemals oberhalb von unedleren Metallen wie Zink, Titanzink oder verzinktem Stahl verbaut werden, da korrosive Kupferionen im ablaufenden Regenwasser Lochfraß (Kontaktkorrosion) verursachen.",
      innovationen: "Werkseitig vorpatinierte Kupferbleche mit definierten Farbtönen von anfangsanisierter Optik; antimikrobielle Oberflächenlegierungen aus Kupfer für hygienisch sensible Handläufe und Griffe im öffentlichen Raum.",
      historie: "Kupfer bildete die Grundlage der frühesten Metallzeit (Chalkolithikum ab 5.000 v. Chr.). Die Römer deckten repräsentative Monumentalgewölbe mit Bronze- und Kupferplatten. Seit dem europäischen Mittelalter schmücken edle Kupferdächer mit ihrer schützenden grünen Alterungspatina Kirchtürme und repräsentative Bürgerbauten."
    }
  },
  baustahl: {
    name: "Baustahl / Konstruktionsstahl",
    subtitle: "Duktiler Allrounder und tragender Eckpfeiler des modernen Skelett-, Brücken- und Verbundbaus",
    sections: {
      rohstoffe: "Eisenerz (Magnetit, Hämatit), Kohle/Koks als Reduktionsmittel im Hochofen sowie nennenswerte Mengen aufbereiteter Stahlschrott aus dem Abbruch von Gebäuden und Fahrzeugen.",
      herstellung: "Primärweg: Schmelzen im Hochofen unter Zugabe von Koks zum Roheisen, Entkohlen und Frischen im Sauerstoffkonverter. Sekundärweg: Direktes Schmelzen von Stahlschrott im Elektrolichtbogenofen. Anschließend Warmwalzen zu I-Trägern.",
      eigenschaften: {
        technisch: "Hohe Streckgrenze (f_y von 235 bis 460 MPa). Sehr hoher elastischer E-Modul (210.000 MPa). Hohe Duktilität (Bruchdehnung >15%), die plastische Verformungsreserven bei Überlast bietet (sprödes Versagen wird verhindert).",
        oekologisch: "Die Primärroute im Hochofen emittiert erhebliche Mengen Treibhausgase (~1,8-2,2 t CO₂/t). Die sekundäre Elektrostahl-Route erzielt dank des konsequenten Schrott-Recyclings extreme Einsparungen (~75% Reduktion)."
      },
      anwendungen: "Tragende Rahmenkonstruktionen für Hochhäuser, weitgespannte Brückentragwerke, Hallendächer, Bewehrungselemente für Stahlbeton und Spundwände für den anspruchsvollen geotechnischen Tiefbau.",
      produkte: "Warmgewalzte Erzeugnisse wie Träger HEA, HEB (DIN 1025), Betonstahl B500B (DIN 488) für schlaffe Bewehrungen im Betonbau, Konstruktionsrohre und walzblanke Fein- und Grobbleche.",
      dauerhaftigkeit: "Unlegierter Baustahl ist an feuchter Atmosphäre extrem korrosionsanfällig (Rostbildung). Rost besitzt einen größeren Raumbedarf als Stahl, blättert ab und passiviert nicht. Dauerhafter Korrosionsschutz durch Verzinkung oder Lackierung zwingend nötig.",
      kosten: "Hochgradig wirtschaftlicher Konstruktionsbaustoff bezogen auf die hohe Tragfähigkeit. Die reinen Materialkosten schwanken, liegen aber deutlich unter Edelstahl oder Nichteisenmetallen; Vorfertigung im Stahlbaubetrieb erhöht Präzision.",
      recycling: "Baustahl ist sehr gut und mehrfach recycelbar; Begleitelemente (z. B. Kupfer) können sich im Schrottkreislauf anreichern.",
      besonderheiten: "Achten Sie auf das temperaturabhängige Werkstoffverhalten: Baustahl behält bei 500 °C noch rund 78 % der Streckgrenze, bei 600 °C nur noch rund 47 % (DIN EN 1993-1-2, Tab. 3.1). Brandschutzbeschichtungen oder -bekleidungen vorsehen!",
      innovationen: "Direktreduktion von Eisenerz mit grünem Wasserstoff anstelle von Kohle; hochfeste Feinkornbaustahlsorten zur Material- und Gewichtseinsparung bei weitgespannten Tragwerksbauten.",
      historie: "Der Übergang vom spröden Gusseisen des 18. Jahrhunderts (wie bei der weltbekannten Iron Bridge von 1779) über das zähere Schweißeisen zum modernen, kohlenstoffarmen Flussstahl im späten 19. Jahrhundert markiert die Geburtsstunde des reinen Stahlbaus und ermöglichte erst die Ära moderner Wolkenkratzer und weitgespannter Hängebrücken."
    }
  },
  edelstahl: {
    name: "Edelstahl (Nichtrostender Stahl)",
    subtitle: "Hochlegierter, korrosionsbeständiger Werkstoff mit selbstheilender Passivschicht für anspruchsvolle Beanspruchung",
    sections: {
      rohstoffe: "Eisenbasis kombiniert mit hohem Schrottanteil sowie teuren, strategischen Legierungselementen wie Chrom (mindestens 10,5 %), Nickel, Molybdän und Mangan.",
      herstellung: "Zusammenschmelzen der Rohstoffe im Elektrolichtbogenofen. Präzises Einstellen der Legierungszusammensetzung durch Vakuumentgasung. Warm- oder Kaltwalzen zu extrem glatten Blechen, Profilen oder Gewindestangen.",
      eigenschaften: {
        technisch: "Zugfestigkeiten von 500 bis 800 MPa, hoher E-Modul (~200.000 MPa). Schlechte Wärmeleitfähigkeit im Vergleich zu Baustahl. Ausgeprägte Zähigkeit und exzellente Festigkeitswerte auch bei extremen Tieftemperaturen.",
        oekologisch: "Hoher Erstellungsaufwand und Legierungsanteil erhöhen die graue Herstellungsenergie. Edelstahl gleicht dies jedoch durch seine extreme Lebensdauer, völlige Wartungsfreiheit und den Verzicht auf umweltschädliche Korrosionsschutzanstriche aus."
      },
      anwendungen: "Mechanische Befestigungsmittel (Schrauben, Dübel, Anker), Sicht- und Schutzfassaden im architektonischen Premiumsegment, Treppengeländer, Schwimmbadtechnik und Konstruktionen in chemisch aggressiven Medien.",
      produkte: "Flacherzeugnisse und Profile aus nichtrostendem Stahl (DIN EN 10088), hochfeste Verankerungssysteme und legierte Betonstähle (z.B. Werkstoff-Nr. 1.4404 oder 1.4571) für dauerhafte Sanierungen.",
      dauerhaftigkeit: "Exzellente inhärente Beständigkeit. Chrom bildet an Sauerstoff eine atomar dünne, unsichtbare und selbstheilende Passivschicht (Chromoxid). Gefahr droht jedoch in chloridreichen Zonen (Schwimmbadatmosphäre, Tausalz) durch zerstörerischen Lochfraß.",
      kosten: "Edelstahl besitzt spürbar höhere Materialkosten als unlegierter Baustahl (ca. faktor 3 bis 5). Seine Verwendung rentiert sich primär an unzugänglichen Stellen oder in korrosiven Umgebungen, wo Instandhaltungsarbeiten entfallen.",
      recycling: "Zu 100% recyclingfähig. Der hohe Marktpreis für Chrom-Nickel-Schrotte garantiert eine geordeness Erfassung beim selektiven Rückbau und eine fast vollständige metallurgische Rückführung in die Schmelzwerke.",
      besonderheiten: "Achten Sie sorgfältig auf die korrekte Legierungswahl! Für chloridbelastete Bauteile (Schwimmbaddächer, Tunnelbau) reicht Standard-V2A-Edelstahl oft nicht aus; hier ist zwingend molybdänhaltiger V4A-Stahl (z.B. 1.4401) einzusetzen.",
      innovationen: "Entwicklung von Duplex-Stählen (ferritisch-austenitische Struktur), die doppelt so hohe Streckgrenzen wie Standard-Austenite besitzen und so erhebliche Tragwerkseinsparungen bei extremem Korrosionsschutz erlauben.",
      historie: "Im Jahr 1912 meldeten die deutschen Krupp-Ingenieure Benno Strauß und Eduard Maurer ein Patent für nichtrostende Chrom-Nickel-Stähle an. Seine architektonische Feuertaufe feierte der hochfeste Werkstoff 1930 mit der Errichtung der weltberühmten, schimmernden Art-Déco-Turmspitze des Chrysler Buildings in New York."
    }
  },
  zink: {
    name: "Zink und Titanzink",
    subtitle: "Dauerhaftes Legierungsmetall mit blaugrauer Zinkcarbonatpatina für Flaschnerarbeiten und Korrosionsschutz",
    sections: {
      rohstoffe: "Primäre Zinkerze (Zinkblende, Galmei) aus mineralischen Abbaugebieten sowie Sekundärzink aus d. industriellen Schrottkreislauf. Für Baubahnen wird Kleinstmengen an Titan und Kupfer hinzulegiert.",
      herstellung: "Röstprozess des Erzes zu Zinkoxid, gefolgt von der hydrometallurgischen Gewinnung mittels Zinkelektrolyse auf über 99,99% Reinheit. Zulegieren von Titan (~0,1%) und Kupfer zur Steigerung der Kriechfestigkeit; anschließendes Auswalzen.",
      eigenschaften: {
        technisch: "Dichte ~7140 kg/m³. Mittlerer E-Modul (~100.000 MPa). Schmelzpunkt bei 420 °C relativ niedrig. Hoher Wärmeausdehnungskoeffizient. Durch das Zulegieren von Titan wird das temperaturbedingte Fließen (Kriechen) unter Last gehemmt.",
        oekologisch: "Geringer Erstellungsaufwand beim Schmelzen im Vergleich zu Aluminium. Hohe Recyclingquote im Dachbereich dämpft den primären Carbon Footprint. Titan- und Kupfereinschlüsse sind in den geringen Konzentrationen ökologisch unbedenklich."
      },
      anwendungen: "Fassaden- und Stehfalzdacheindeckungen im gehobenen Wohnungs- und Verwaltungsbau. Traditionelle Dachentwässerungen (Dachrinnen, Abfallrohre) sowie als Schutzüberzug (Feuerverzinken) für tragenden Baustahl.",
      produkte: "Titanzink-Bleche und -Bänder (DIN EN 988), vorgefertigte Dachrinnen-Systeme (DIN EN 612) sowie Zink-Draht zur thermischen Spritzverzinkung.",
      dauerhaftigkeit: "Sehr beständig. Reagiert mit Sauerstoff und dem CO₂ der Luft zu einer samtartigen, blaugrauen Schutzpatina aus basischem Zinkcarbonat. Schädlich ist dauerhaft gestautes Schwitzwasser (verhindert Carbonatisierung und führt zu Weißrost).",
      kosten: "Mittleres bis gehobenes Preissegment. Deutlich teurer als verzinktes Stahlblech, aber langlebiger und wartungsfrei über Generationen (Lebensdauer >75 Jahre), was die Investition an der Gebäudehülle rechtfertigt.",
      recycling: "Ausgezeichnet recyclingfähig. Altzink aus Dächern und Rinnen wird im Zuge des selektiven Rückbaus sauber separiert und zu nahezu 100% in Sekundärschmelzhütten zur Herstellung neuer Bänder oder Zinkoxiden verarbeitet.",
      besonderheiten: "Vermeiden Sie beim Dachaufbau stehendes Wasser an der Unterseite von Titanzinkblechen. Setzen Sie strukturierte, diffusionsoffene Trennlagen/Strukturmatten ein, damit die Blechunterseite hinterlüftet ist und Weißrostbildung verhindert wird.",
      innovationen: "Werkseitig mechanisch-chemisch vorpatinierte Titanzinkbleche (z.B. in Schiefergrau oder Anthrazit), die von Tag eins an die gewünschte, homogene Schutzoptik aufweisen und keine unregelmäßige Anfangshydrolyse zeigen.",
      historie: "Feingewalztes Zinkblech wurde ab ca. 1805 in Mitteleuropa herstellt und schützte Kirchen- und Palastdächer. Die Legierung mit Titan und Kupfer (Titanzink) im Jahr 1966 überwand die unerwünschte materialeigene Kriechneigung des reinen Zinks vollends und etablierte das Material dauerhaft an der anspruchsvollen Gebäudehülle."
    }
  },
  blei: {
    name: "Blei",
    subtitle: "Schweres, weiches Spezialmetall für hochelastische Bauwerksabdichtungen, Schall- und Strahlenschutz",
    sections: {
      rohstoffe: "Bleiglanz (Bleisulfid) aus Bergwerken. Blei besitzt heute eine der global höchsten Recyclingraten aller Gebrauchsmetalle, weshalb fast das gesamte Baublei aus wiederaufbereiteten Altblei-Quellen (Akkumulatoren, Rohre) stammt.",
      herstellung: "Röstreaktions- oder Reduktionsverfahren im Schachtofen zur Rohbleigewinnung. Eine anschließende Raffination entfernt Verunreinigungen. Biegsames Vergusswalzen zu extrem dünnen, schweren Walzbleibahnen.",
      eigenschaften: {
        technisch: "Sehr hohe Rohdichte (~11.340 kg/m³). Sehr geringe Festigkeit und minimaler E-Modul (~16.000 MPa). Extrem weich, zäh und plastisch verformbar. Schmelzpunkt liegt bei kühlen 327 °C. Hervorragende Absorptionsfähigkeit von Gamma- und Röntgenstrahlen.",
        oekologisch: "Blei ist ein toxisches Schwermetall. Ein direkter Hautkontakt oder d. Freisetzung in d. Umwelt muss akribisch vermieden werden. Ökologisch vorteilhaft ist der extrem niedrige Schmelzpunkt (~327 °C), der hocheffizientes Sekundärrecycling erlaubt."
      },
      anwendungen: "Formbare Anschluss- und Abdichtungsschalungen an Steildächern (z.B. Kamineinfassungen, Kehlbleche), Strahlenschutzwände in medizinischen Röntgendiagnosen und hochdichte Schalldämmelemente im Akustikbau.",
      produkte: "Walzblei für das Bauwesen (DIN EN 12588, handelsübliches 'Saturnblei'), selbstklebende plissierte Blei-Anschlussbänder und bleikaschierte Gipskartonplatten für den bautechnischen Strahlenschutz im Krankenhaus.",
      dauerhaftigkeit: "In neutraler Atmosphäre nahezu unbegrenzt haltbar durch die schnelle Ausbildung einer extrem dichten, wasserunlöslichen Schutzschicht aus Bleicarbonat. Blei ist jedoch empfindlich gegen organische Säuren (z.B. feuchte Eichenholz-Gerbsäure).",
      kosten: "Aufgrund des hohen Eigengewichts pro Quadratmeter und der handwerklichen Kantenbearbeitung vor Ort ist Blei im oberen Preissegment angesiedelt. Seine unerreichte plastische Anpassungsfähigkeit spart jedoch oft Arbeitszeit.",
      recycling: "Nahezu 100% im geschlossenen Werkstoffkreislauf rückführbar. Gebrauchtblei wird in Bleihütten ohne Qualitätsverlust mit geringstem energetischem Aufwand eingeschmolzen und fließt direkt zurück in den Produktionskreislauf.",
      besonderheiten: "Aufgrund des Verdachts der Bleitoxizität ist der direkte Hautkontakt bei der Montage durch das Tragen von Schutzhandschuhen zu vermeiden. Bauschollen niemals sägen oder schleifen (Einatmen von Bleistaub verhindern)!",
      innovationen: "Entwicklung von bleifreien Dach-Anschlussbändern auf Basis polymerer Streckmetalle; bleischonende Zinn-Legierungsbeschichtungen zur Verhinderung des minimalen bleihaltigen Abwassers bei historisch denkmalgeschützten Dächern.",
      historie: "Seit ca. 4.000 v. Chr. verhüttet, nutzten die Römer Blei für Zisternenauskleidungen und Röhrenleitungen. Im gotischen Epochenzeitalter des mittelalterlichen Sakralbaus dienten elastische Bleiprofile als Halterungen für kunstvolle Buntglasfenster, während Walzblei zur rissfreien Dichtung exponierter Kehlen und Kamineinflansche diente."
    }
  },
  titan: {
    name: "Titan",
    subtitle: "Ultraleichtes, hochfestes Edelmetall der Extraklasse für chemischen Extremwiderstand und Prestigebauten",
    sections: {
      rohstoffe: "Ausgangsmineralien sind primär Rutil (Titan(IV)-oxid) oder Ilmenit. Das Metall ist in der Erdkruste reichlich vorhanden, der chemische Extraktionsprozess ist jedoch extrem komplex.",
      herstellung: "Gewinnung über das aufwendige Kroll-Verfahren: Reduktion von Titantetrachlorid mit flüssigem Magnesium unter Argon-Schutzgas zu Titanschwamm. Anschließendes Vakuum-Umschmelzen und Walzen zu hochwertigsten Blechplatinen.",
      eigenschaften: {
        technisch: "Geringe Dichte (~4500 kg/m³ - etwa halb so schwer wie Stahl). Extrem hohe Zugfestigkeiten (bis zu 1000 MPa bei Legierungen). Mittlerer E-Modul (~105.000 MPa). Extrem hoher Schmelzpunkt (1668 °C). Seidig-glänzende, edle Optik.",
        oekologisch: "Der energie- und apparatetechnische Aufwand der Herstellung ist der absolut höchste unter allen Baumaterialien (immense graue Energie). Dieser wird im Bauwesen nur durch d. unbegrenzte Lebensdauer ohne jeglichen Schutzanstrich kompensiert."
      },
      anwendungen: "Architektonisch anspruchsvolle Premiumfassaden und Dacheindeckungen im Prestigebau (z. B. Guggenheim-Museum Bilbao), Tragelemene in extrem salzhaltiger Meeresluft sowie im hoch-korrosiven chemischen Anlagenbau.",
      produkte: "Bleche und Platten aus Titan und Titanlegierungen (DIN EN ISO 21809), stranggepresste Stäbe und Profile sowie Spezialbefestigungsmittel für dauerhafte Verankerungen in Meeresnähe.",
      dauerhaftigkeit: "Die Korrosionsbeständigkeit is phänomenal und übertrifft selbst Edelstahl bei Weitem. Titan bildet an Luft eine extrem stabile, inerte und dauerhafte Titanoxid-Schutzschicht, die gegen Chloride, Seewasser und Säuren absolut immun ist.",
      kosten: "Titan gehört zu den exklusivsten und teuersten Werkstoffen im Bauwesen. Hohe Material- und Verarbeitungskosten (Werkzeugverschleiß beim Schneiden) machen seinen Einsatz nur für Repräsentationsbauten wirtschaftlich darstellbar.",
      recycling: "Sehr gut recycelbar. Titan- und Legierungsschrotte werden in spezialisierten Vakuum-Umschmelzanlagen erfasst und stofflich hochwertig wiederverwendet. Aufgrund des hohen Materialwertes gibt es keinerlei Deponierungstendenzen.",
      besonderheiten: "Beim mechanischen Bearbeiten (Schneiden, Bohren) ist auf eine intensive Kühlung zu achten, da Titan eine geringe Wärmeleitfähigkeit besitzt und zum Festfressen von Werkzeugen neigt. Funkenflug beim Schleifen beachten!",
      innovationen: "Entwicklung von nanostrukturierten Titanoberflächen mit dauerhaft fotokatalytischer Aktivität zur selbstständigen Zersetzung von Umweltgiften (Stickoxiden) und Rußpartikeln direkt an d. Gebäudefassade im urbanen Ballungsraum.",
      historie: "Das im Jahr 1791 entdeckte Edelmetall wurde erst im 20. Jahrhundert durch das Kroll-Verfahren in größeren Mengen extrahierbar. Nach jahrzehntelangem Einsatz in Luft- und Raumfahrt revolutionierte Titan die moderne, freie Bautechnik im Jahr 1997 mit dem schimmernden und absolut korrosionsfreien Guggenheimmuseum in Bilbao von Frank Gehry."
    }
  },
  holz: {
    name: "Vollholz (Konstruktionsholz)",
    subtitle: "Konstruktionsvollholz, Baurundholz und Schnittholz als nachhaltiger, anisotroper Tragbaustoff",
    sections: {
      rohstoffe: "Nachwachsender Rohstoff aus nachhaltig bewirtschafteter Forstwirtschaft (PEFC/FSC-Zertifizierung). Im mitteleuropäischen Raum dominieren Nadelhölzer (Fichte, Tanne, Kiefer, Lärche) gegenüber Laubholzgüten (Buche, Eiche).",
      herstellung: "Einschlag im Forstfeuchtbestand, Ablängen im Sägewerk und Einschneiden zu Bauschnittholz (Kanthölzer, Bretter, Latten). Es erfolgt eine technische Kammertrocknung auf eine Ziel-Holzfeuchte von ca. 15 ± 3 % (KVH®) bzw. max. 18–20 % zur Schwindbegrenzung nach DIN 4074.",
      eigenschaften: {
        technisch: "Stark ausgeprägte Anisotropie (Festigkeiten längs zur Faser um ein Vielfaches höher als quer zur Faser: Biegefestigkeit f_mk ≈ 24 N/mm² bei C24, Querzugfestigkeit f_t90k ist minimal). Geringe Dichte (ca. 400-550 kg/m³). Hervorragendes Verhältnis von Tragkraft zu Eigengewicht.",
        oekologisch: "Hervorragender Öko-Akteur. Holz speichert während des Baumwachstums CO2 (ca. 0.9 t CO2/m³ Holz) und speichert biogenen Kohlenstoff (in der Ökobilanz nach EN 15804+A2 getrennt ausgewiesen, am Lebensende wieder freigesetzt, sofern nicht weiterverwendet). Geringste Graue Energie bei lokaler Verarbeitung."
      },
      anwendungen: "Tragwerke für Dachstühle (Sparren, Pfetten), Holzrahmenbauwände im Wohnungsbau, Deckenbalkenlagen, tragende Fachwerkbauten, feingliedrige Fassadenschalungen, Konstruktionsunterlagen, Terrassendielen im Außenbereich.",
      produkte: "Bauschnittholz (DIN 4074), Konstruktionsvollholz (KVH®) mit definierter Holzfeuchte und werkseitiger Keilzinkungsverbindung für anspruchsvolle Längen, Brettschichtholz (BSH) für extrem tragfeste Leimbinder.",
      dauerhaftigkeit: "Sehr hoch bei konsequentem konstruktivem Holzschutz (Bauteile müssen vor andauernder Feuchtigkeit geschützt sein und rasch abtrocknen können). Ab einer dauerhaften Holzfeuchte von > 20% droht der Befall durch holzzerstörende Pilze und Insekten.",
      kosten: "Vollholz als Rohstoff ist im mittleren Preissegment angesiedelt. Gutes KVH C24 liegt bei etwa 450-650 €/m³, Fichten-Bauschnittholz ist nochmals preiswerter. Die hocheffiziente, schnelle Montage auf der Baustelle senkt die Gesamtbauzeit spürbar.",
      recycling: "Sehr gut im Rahmen der Kaskadennutzung. Unbehandeltes Altholz kann werkstofflich zu Holzwerkstoffen (Spanplatten) weiterverarbeitet werden oder am Ende des Lebenszyklus als CO2-neutraler Biobrennstoff zur ökologischen Fernwärmerzeugung dienen.",
      besonderheiten: "Konstruktionsfehler Nummer 1: Behinderung des natürlichen Quell- und Schwindverhaltens infolge Feuchtigkeitsschwankungen. Holz arbeitet im Querschnitt quer zur Faser tangential rund 30-mal stärker als längs zur Faser. Stoß- und Auflagerbereiche elastisch entkoppeln.",
      innovationen: "Entwicklung hochfester Laubholz-Stabtragwerke (z.B. aus verklebter Buche) mit Tragfähigkeiten auf Augenhöhe mit Baustahl zur Realisierung extrem schlanker, weitgespannte Ingenieurholzbau-Hallentragwerke.",
      historie: "Zusammen mit Stein der älteste primäre Baustoff der Evolution. Vom steinzeitlichen Pfahlbau über gotische Sprengwerke bis hin zu komplexen Riegelverbindungen des historischen Zimmerhandwerks bildete Holz über Jahrhunderte das dominante Tragmedium des Hochbaus. Die moderne Normierung ab 1900 verwandelte den Rohstoff in ingenieurtechnisches Konstruktionsholz."
    }
  },
  holzwerkstoffe: {
    name: "Holzwerkstoffe",
    subtitle: "Brettsperrholz, Furnierwerkstoffe und Holzfaserdämmstoffe für den modernen Holzbau",
    sections: {
      rohstoffe: "Zerspantes oder zerfasertes Nadelholzgefüge, Dünnschnittfurniere von Laub-/Nadelbäumen. Als Matrixkomponente dienen reaktive Duroplast-Bindemittel (z.B. PUR-Leime, MUF-Harze, Phenolharze) zur dauerhaften Plattenbindung.",
      herstellung: "Ausgangsholz wird mechanisch zerspant, getrocknet und mit Klebharz benetzt. In beheizten Hochdruckpressen werden die Holzpartikel (Späne, Strands, Furnierschichten) kreuzweise orientiert oder ungeordnet unter enormer Presskraft flächig verleimt.",
      eigenschaften: {
        technisch: "Formstabiler als Vollholz in Plattenebene durch den Ausgleich der natürlichen Anisotropie (quasi-isotropes Verhalten); Biege-E-Modul und Biegefestigkeit liegen jedoch meist deutlich unter Vollholz faserparallel. Rohdichten reichen von ca. 250 kg/m³ (poröse Holzfaserplatten) über ca. 600–650 kg/m³ (OSB, Spanplatte) bis > 800 kg/m³ (HDF).",
        oekologisch: "Ausgezeichnete Ökobilanz, da minderwertiges Industrieholz und Sägereste hervorragend verarbeitet werden und CO2-Senkenfunktionen erhalten bleiben. Der Klebstoffanteil (Phenol-, Formaldehydverbindungen) muss zur Vermeidung von Wohngiften (Ausgasungen) strikt schadstofflimitiert sein."
      },
      anwendungen: "Großflächiges Brettsperrholz (CLT) als tragende Massivholzwand und Deckenplatte im mehrgeschossigen Holzbau. Aussteifende Wandbeplankungen im Holzrahmenbau (OSB). Gurtwerkstoffe für Stegträger im Dachaufbau. Trägerplatten im Innenausbau.",
      produkte: "Brettsperrholz (BSP / CLT-Platten), OSB-Platten (Oriented Strand Board, Klassen OSB/3 und OSB/4 für Feuchtbereiche, DIN EN 300), Furnierschichtholz (FSH / LVL), mitteldichte Faserplatten (MDF) und weiche Holzfaserdämmplatten (WF).",
      dauerhaftigkeit: "Sehr widerstandsfähig gegen Verziehen im Innenraum. Ohne chemische Nachbehandlung ist die Mehrheit der Leimholzplatten jedoch nicht dauerhaft witterungsbeständig im direkten Außenbereich; stehendes Wasser quillt MDF-/Spanplatten sofort irreparabel auf.",
      kosten: "Ausgeprägte Wirtschaftlichkeit durch industrialisierte Großserienfertigung. OSB/3 Platten gehören mit ca. 5-12 €/m² zum Standard-Rohbaumaterial. Großflächiges Brettsperrholz (CLT) ist im Vorfertigungsbau unschlagbar zeit- und lohnsparend.",
      recycling: "Kompliziert durch Bindemittelanteile. Verleimte Span- oder Faserplatten können im Sinne des Recyclings nicht direkt geschreddert und ungesehen in den Boden eingearbeitet werden; vorrangig ist die energetische Verwertung in zugelassenen Biomassekraftwerken.",
      besonderheiten: "Hohlraumbildung an den Rändern und Plattenstößen im Deckenbereich meiden. Bei der Planung von Küchen und Sanitären Beplankungen ist zwingend auf feuchtebeständige Platten (z. B. P5, OSB/3) zu verwenden; für geringe Innenraumbelastung formaldehydfrei verleimte Platten (z. B. PMDI-gebunden) wählen. E1 bedeutet nur emissionsarm, nicht formaldehydfrei zu achten.",
      innovationen: "Flüssiges Holz (biobasierte Ligninverbundstoffe im Spritzguss). Brettsperrholzdecken mit eingearbeiteten inneren Lüftungskanälen zur hocheffizienten Bauteilaktivierung in gewerblichen Büro- und Wohnungsbauten.",
      historie: "Erste Furniertechniken sind bereits im altägyptischen Möbelbau dokumentiert. Die neuzeitliche Spanplattenherstellung entstand ab 1930 zur Verwertung von Sägeresten. Die Markteinführung von kreuzweise verleimtem Brettsperrholz (CLT-Platten) um 1990 leitete die Ära des modernen, mehrgeschossigen Holz-Massivbaus im urbanen Raum ein."
    }
  },
  asphalt: {
    name: "Asphalt & Bitumen",
    subtitle: "Viskoelastische Bindemittel und Gesteinsgemische für den modernen Straßen- und Infrastrukturbau",
    sections: {
      rohstoffe: "Straßenbaubitumen nach DIN EN 12591 (ein hochmolekulares Kohlenwasserstoffgemisch gewonnen als schwerer Rückstand aus der Vakuumdestillation von Erdöl) und mineralische Gesteinskörnungen (Edelsplitt, Sand und Füllersteinmehl).",
      herstellung: "In Asphaltmischwerken werden die Gesteinskörnungen getrocknet, auf ca. 160-180 °C erhitzt und im Heißmischer homogen mit dem flüssigen Bitumen bindend benetzt. Der Einbau auf der Baustelle erfolgt heiß mittels Straßenfertiger und anschließender Walzenverdichtung.",
      eigenschaften: {
        technisch: "Ausgeprägt thermoplastisches und viskoelastisches Werkstoffverhalten: Bei Kälte verhält sich Asphalt spröde und hart, bei Hitze wird er plastisch verformbar und fließfähig (Gefahr der Spurenbildung / Spurrinnen). Gussasphalt ist nahezu hohlraumfrei und wasserdicht; Walzasphalte besitzen je nach Sorte einen Hohlraumgehalt von wenigen Prozent (Asphaltbeton) bis über 20 % (offenporiger Asphalt).",
        oekologisch: "Sehr hoher Primärenergiebedarf und Treibhauspotenzial durch erdölbasiertes Bitumen und heißes Erhitzen im Mischwerk. Der CO2-Faktor sinkt jedoch dramatisch durch das hocheffiziente Recycling von Asphaltgranulat im direkten Mischkreis."
      },
      anwendungen: "Trag-, Binder- und Deckschichten im gesamten Straßen-, Autobahn- und Flughafenbau. Asphaltierungen im Deponie- und Wasserbau (Dichtvliese), Dichtungsschichten für Brückenbauwerkskappen und wasserundurchlässige Hofbefestigungen.",
      produkte: "Asphaltbeton (AC) für Standarddeckschichten nach DIN EN 13108-1, Splittmastixasphalt (SMA) für extrem hochbeanspruchte Autobahnstrecken, Gussasphalt (MA - fließfähig, selbstverdichtend und wasserdicht), offenporiger Flüsterasphalt (PA).",
      dauerhaftigkeit: "Unter Standardbedingungen extrem zäh und langlebig (Strukturhaltbarkeit > 20-30 Jahre). Schadensbegünstigend sind thermische Frost-Tau-Risse infolge eindringenden Wassers sowie die oxidative Alterung des Bitumens durch UV-Licht (Material wird spröde).",
      kosten: "Sehr wirtschaftliches Schüttgut für großflächige Verkehrsflächen. Die Materialkosten für Asphaltbeton belaufen sich auf ca. 80-130 €/t frei Baustelle. Die Installation erfordert einen spezialisierten, hochgradig maschinellen Gerätepark.",
      recycling: "Ein vorbildlicher Kreislaufwerkstoff: Altasphalt kann zu nahezu 100 % abgefräst, im Mischwerk aufbereitet und als Asphaltgranulat dem neuen Frischasphalt im Heißbetrieb zu Dosierquoten von bis zu 60-80 % zugeschlagen werden.",
      besonderheiten: "Einbau-Ausschlaggebend: Luft- und Untergrundtemperaturgrenzen während des Asphalteinbaus penibel einhalten! Walzverdichtung ist nur bei Temperaturen des Mischgutes oberhalb von 100 °C tragfähig machbar; kalter Asphalt lässt sich nicht verdichten.",
      innovationen: "Niedrigtemperaturasphalt (NTA) unter Einsatz von Wachsen, um den Einbau bei nur ca. 110 °C zu ermöglichen (spart Energie und verringert Dämpfe). Gekoppelte Photovoltaik-Straßenbeläge sowie selbstkühlender Asphalt durch Titanoxid-Pigmente.",
      historie: "Natürlicher Asphalt (Erdpech) diente im antiken Mesopotamien vor ca. 4.000 Jahren als Bindemittel für Festungsmauern und Flussabdichtungen. Der moderne Straßenasphalt entwickelte sich im frühen 19. Jahrhundert im Zuge des Makadam-Verfahrens, bevor die industrielle Gewinnung von Bitumen aus Erdöl ab 1900 die schadstoffbelasteten Kohlenteere ablöste."
    }
  },
  kunststoffe: {
    name: "Kunststoffe im Bauwesen",
    subtitle: "Thermoplaste, Duroplaste und Elastomere für Rohre, Profile, Abdichtungen und Textiltragwerke",
    sections: {
      rohstoffe: "Synthetisch hergestellte organische Polymere auf Mineralölbasis (Fossile Rohstoffe wie Rohbenzin, Ethylen, Propylen). Zunehmend biomassebasierte Monomere aus Agrarreststoffen zur thermoplastischen Synthese.",
      herstellung: "Polymerisation, Polykondensation oder Polyaddition im chemischen Reaktor. Durch Beigabe von Weichmachern, UV-Stabilisatoren und Pigmenten wird das Rohpolymer im Extruder zu Endprodukten wie Profilen oder Folien verarbeitet.",
      eigenschaften: {
        technisch: "Sehr geringe Rohdichte (900-1.400 kg/m³). Enorm gutes Verhältnis von Festigkeit zu Gewicht. Geringe Wärmeleitfähigkeit (ideal für Dämmzwecke). Hohe Elastizität und Stoßunempfindlichkeit bei Polyethylenrohren. Geringe Eigensteifigkeit bei Last.",
        oekologisch: "Erheblicher CO2-Fußabdruck in der Herstellung aufgrund fossiler Basis (ca. 2.0-3.5 kg CO2-Äq./kg Kunststoff). Mikroplastikabrieb und Schadstoffe (z.B. flüchtige Weichmacher in altem PVC) fordern ein strenges Recycling und Baustoffmonitoring."
      },
      anwendungen: "Kanalisations- und Trinkwasserrohre (PVC-U, PE-HD, PP), Fensterrahmenprofile (PVC), Abdichtungsbahnen auf Dächern, Geotextilien zur Baugrundstabilisierung, Dampfbremsfolien, Befestigungsdübel, elastische Fugenbänder.",
      produkte: "Standardprodukte wie Abwasserrohre (KG-Rohre), Kabelschutzrohre, Polyethylen-Folien, EPDM-Dachdichtungsbahnen für extreme Langlebigkeit (DIN 18531), EPS- und XPS-Hartschaumplatten zur Keller- und Fassadendämmung.",
      dauerhaftigkeit: "Gegen Wasser, Pilze und fast alle bodenständigen Chemikalien unbegrenzt beständig (Lebensdauer > 50-100 Jahre im Erdreich). Kritischer Degradationsfeind ist die UV-Strahlung im Außenbereich: Ungeschützte Kunststoffe verspröden und reißen.",
      kosten: "Äußerst wirtschaftliche Systemkomponenten im Vergleich zu metallischen Alternativen. Kunststoffrohre weisen extreme Preisvorteile auf, sind sehr leichtgewichtig und lassen sich ohne Schweißgeräte per einfachem Steckmuffen-Verfahren verlegen.",
      recycling: "Werkstoffliches Recycling scheitert oft an Baustellen-Verunreinigungen und Verbundklebungen (WDVS). Sortenreines PVC (z.B. alte Fensterrahmen) wird erfolgreich im Closed-Loop-Verfahren zu Recyclingprofilen geschreddert. Sonstige gemischte Abfälle werden energetisch verwertet.",
      besonderheiten: "Konstruktionsrelevanter Schadefaktor: Enorm hoher thermischer Längenausdehnungskoeffizient (bis zu 10-mal größer als Beton/Stahl). Bei freiverlegten Rohren und Hüllen sind Gleitbänder, Dehnungsschleifen und Expansionsfugen zwingend vorzusehen.",
      innovationen: "Biologisch abbaubare Hochleistungs-Spannbahnen. Selbstheilende Elastomerdichtungen im Tunnelbau. 3D-gedruckte Fassadensondertafeln aus recyceltem Meeresplastik zur architektonischen Profilierung von Gewerbeobjekten.",
      historie: "Die erste bahnbrechende Polymersynthese (Bakelit) gelang im Jahr 1907. Ab den 1930er Jahren wurden mit PVC und Polystyrol kostengünstige, extrem langlebige Kunststoffe massenhaft erzeugt. Die Nachkriegsära (ab 1950) revolutionierte durch korrosionsfreie Rohrleitungssysteme, dichte Folien und hocheffiziente Dämmstoffe die gesamte Bautechnologie."
    }
  },
  faserverbund: {
    name: "Faserverbundwerkstoffe (CFK/GFK)",
    subtitle: "Hoch-zugfeste Carbon- und Glasfaserverbunde für leichte Tragwerke und Bewehrungen",
    sections: {
      rohstoffe: "Hochleistungsfasern (Carbonfasern gewonnen aus Polyacrylnitril-Pyrolyse oder Glasfasern aus dem Glasschmelzprozess) eingebettet in eine erhärtende polymere Duroplast-Matrix (Epoxidharz, Polyesterharz, Vinylesterharz).",
      herstellung: "Pultrusion (Strangziehverfahren) zur kontinuierlichen Fertigung hoch-zugfester Stäbe und Lamellen. Filament-Winding für Hohlkörper. Schichtlaminieren im Vakuum-Infusionsverfahren für komplizierte Freiformen und Plattensegmente.",
      eigenschaften: {
        technisch: "Enorm hohe Zugfestigkeiten (Carbonfaser-Zuggurtfestigkeit f_fk > 2.500-3.000 MPa - etwa das 6-fache von Baustahl). Extrem leichtgewichtig im Vergleich (Dichte ca. 1.500-1.800 kg/m³). Korrosionsfrei. E-Modul bei Carbon sehr hoch, bei Glasfaser geringer.",
        oekologisch: "Das Herstellen von Carbonfasern durch Hochtemperaturpyrolyse (bis 1.500 °C) besitzt einen extrem hohen Primärenergiebedarf und CO2-Ausstoß (ca. 15-20 kg CO2-Äq./kg). Die Langlebigkeit und der Wegfall von Sanierungen im Brückenbau relativieren diesen Aspekt."
      },
      anwendungen: "Nachträgliche Verstärkung von Betonbauteilen (Aufkleben von CFK-Lamellen auf Brückenträger), korrosionsfreie GFK-Bewehrungsstäbe im Tunnelbau und in Kläranlagen, ultra-filigrane Textilbetonfassaden, weitgespannte Fußgängerbrücken.",
      produkte: "CFK-Lamellen (Carbonfaser-Kunststoff-Streifen zur Rissüberbrückung), GFK-Bewehrungsstäbe (Schöck Combar), Glasgittermatten zur Betonputzarmierung, Faserverbundrohre für extreme Innendrücke.",
      dauerhaftigkeit: "Korrosionsbeständigkeit ist phänomenal (rostet nicht bei Feuchtigkeit, Salzen oder aggressiven Chemikalien). Hoher Widerstand gegen Ermüdung bei zyklischer Dauerbelastung. Epoxidharze müssen im Außenbereich vor direkter UV-Einstrahlung geschützt werden.",
      kosten: "Sehr hoher Anschaffungspreis im Vergleich zu handelsüblichem Baustahl. Carbonwerkstoffe sind High-End-Materialien. Die Kosten amortisieren sich primär bei Sanierungen durch minimalste Montagezeiten (keine schweren Hebekräne) und extreme Wartungsfreiheit.",
      recycling: "Technologisches Recycling-Sorgenkind. Duroplast-Matrices lassen sich nicht aufschmelzen. Carbonfasern können in Spezialreaktoren durch Pyrolyse zurückgewonnen werden und dienen als Rezyklatfasern für Vliesstoffe. GFK-Elemente enden meist in der thermischen Verwertung.",
      besonderheiten: "Konstruktiv kritisch: Sprödes Versagensverhalten ohne nennenswerte Fließankündigung. Bei Biegezugbemessungen mit CFK-Zulagen muss die Verankerungslänge und die innere Dehnungsbeschränkung des Epoxidklebers akribisch nachgewiesen werden.",
      innovationen: "Biobasierte Flachsfaser-Epoxidharz-Verbundplatten zur Reduktion des CO2-Fußabdrucks im designierten Messe- und Leichtbau. Carbonfaserstäbe zur permanenten Vorspannung im extrem schlanken Betonhochbau.",
      historie: "Glasfasern wurden erstmals in den 1930er Jahren industriell gezogen. Hochmodulige Kohlenstofffasern entstanden um 1960 für anspruchsvolle Raumfahrtstrukturen. Im Bauwesen etablierten sich hoch-zugfeste Faserverbundwerkstoffe (CFK/GFK) in den 1980er Jahren zur zerstörungsfreien, extrem leichten Tragwerkssanierung von Brückenkonstruktionen."
    }
  },
  daemmstoffe: {
    name: "Dämmstoffe & Isoliermaterialien",
    subtitle: "Mineralische, synthetische und ökologische Dämmstoffe zur thermischen und akustischen Gebäudeisolierung",
    sections: {
      rohstoffe: "Abhängig von der Stoffklasse: Mineralische (Altglas, Basalt für Glas-/Steinwolle), Synthetische (Styrol aus Erdöl für polymerbasiertes EPS/XPS, Polyurethan PIR) oder Ökologische (Holzfasern, Hanfstroh, Seegras, Schafwolle, Zelluloseflocken aus Altpapier).",
      herstellung: "Mineralwolle wird durch Schleudern flüssiger Silikatschmelzen und Faserbindung hergestellt. EPS wird durch Aufschäumen von Polystyrol-Granulat unter Zugabe von Pentan als Treibmittel zu großen Blöcken geschäumt und geschnitten. Holzfaserdämmung wird durch Zerfasern von Sägeresten und nass- oder trockengepresstes Verkleben geformt.",
      eigenschaften: {
        technisch: "Ausgezeichnete, extrem niedrige Wärmeleitfähigkeiten im Spitzenwert (λ ≈ 0.022 W/(m·K) bei PIR, mineralische Wolle λ ≈ 0.035 W/(m·K), Hanfdämmung λ ≈ 0.040 W/(m·K)). Geringe Rohdichte (15-180 kg/m³). Rohstoffe bestimmen das Brandverhalten (A1 bei Mineralwolle, B2 bei EPS/Öko).",
        oekologisch: "Synthetisch geschäumte Dämmstoffe weisen eine hohe Graue Energie auf. Ökologische Dämmstoffe speichern CO2 dauerhaltig über den Lebenszyklus des Gebäudes. Der Einspareffekt an Transmissions-Heizwärme gleicht die graue Herstellungs-Energie fast aller Dämmstoffe nach 1-2 Heizperioden vollständig aus."
      },
      anwendungen: "Wärmedämmung der Gebäudehülle (Außenwand-WDVS, zweischaliges Mauerwerk, hinterlüftete Fassade), Steildach-Zwischensparrendämmung, Flachdachisolierung, Trittschall- und Tragschichtdämmung unter dem Estrich, Kellerdecken- und Perimeterdämmung.",
      produkte: "Glaswolle-Klemmfilze, Steinwolle-Dämmplatten (Brandschutzklasse A1), EPS-Hartschaumplatten (EPS), XPS-Platten (erhöhte Druck- und Wasserbeständigkeit für die Perimeterdämmung), flexible Holzfaserdämmplatten (WF-Dämmplatten).",
      dauerhaftigkeit: "Unter Ausschluss von Feuchtigkeit extrem formstabil und zeitbeständig (> 50 Jahre). Ein Feuchtigkeitsschaden (kapillares Absättigen bei Mineralwolle oder Einregnen bei Holzfaser) reduziert das Dämmvermögen drastisch auf ein Minimum und begünstigt Schimmelbildung.",
      kosten: "Mineralwolle und EPS sind extrem wirtschaftliche Standarddämmstoffe (ca. 8-15 €/m² Materialpreis je nach Dämmschnitt). Hochwertige PIR-Dämmungen sowie ökologische Hanf- oder Holzfaserdämmungen sind ca. 40-80% teurer in der Anschaffung.",
      recycling: "Synthetische EPS-Materialien wurden früher mit dem mittlerweile verbotenen Flammschutzmittel HBCD ausgerüstet und gelten als gefährlicher Abfall. Heutzutage wird reines EPS im mechanischen Kreislauf zu neuen Platten aufgeschäumt. Holzfaserplatten sind thermisch nutzbar.",
      besonderheiten: "Konstruktionstipp für Steildächer: Die diffusionsäquivalente Luftschichtdicke (s_d-Wert) des Schichtenaufbaus zwingend im Auge behalten! Der Aufbau muss von warm nach kalt (innen nach außen) diffusionsoffen ausgeführt werden (Dampfbremse innen).",
      innovationen: "Vakuum-Isolationspaneele (VIP) mit extrem geringer Wärmeleitfähigkeit von λ ≈ 0.007 W/(m·K) zur exklusiven Dämmung bei dünnsten Platzverhältnissen. Bio-Dämmschäume auf Myzel-Basis (Pilzkulturen gewachsen auf landwirtschaftlichen Reststoffen).",
      historie: "Bis zur Mitte des 20. Jahrhunderts dienten Stroh, Torf und Kork als händisch eingefügte Isolierstoffe. Das Patentieren von expandiertem Polystyrol (EPS) im Jahr 1949 und die Etablierung moderner Schleuder-Mineralwolle begründeten nach den Ölkrisen der 1970er Jahre den modernen, systematischen Wärmeschutz."
    }
  },
  zement: {
    name: "Zement (Portland-, Hochofen- & Kompositzemente)",
    subtitle: "Hydraulische Bindemittel nach DIN EN 197-1 (CEM I bis CEM V) und DIN EN 197-5 (CEM II/C-M, CEM VI)",
    sections: {
      rohstoffe: "Ausgangsstoffe sind Kalkstein (Calciumcarbonat, CaCO₃) und tonige Komponenten (Mergel, Ton mit SiO₂, Al₂O₃, Fe₂O₃), aufbereitet im Rohmehl-Mischungsverhältnis (Kalkstandard KSt ca. 90-105). Als Zumahlstoffe dienen Hüttensand (granulierte Hochofenschlacke), Steinkohlenflugasche, calciniertes Schiefermehl, Puzzolane und hochreines Kalksteinmehl sowie Calciumsulfat (Gips/Anhydrit als Erstarrungsregler).",
      herstellung: "Gewinnung im Tagebau, Vorzerkleinerung, Homogenisierung und Trocknung zum Rohmehl. Brennen im Drehrohrofen mit Zyklonvorwärmer und Calcinator bei ca. 1.450 °C (Sinterung). Dabei laufen Entsäuerung (Kalzination bei ca. 900 °C) und Klinkerbildung zu Alit (C₃S), Belit (C₂S), Aluminat (C₃A) und Ferrit (C₄AF) ab. Rasche Kühlung und Feinmahlung des Klinkers mit Gips und Zumahlstoffen in Kugelmühlen oder Vertikal-Wälzmühlen.",
      eigenschaften: {
        technisch: "Reindichte von Portlandzement ca. 3,10-3,20 g/cm³, Schüttdichte ca. 0,9-1,2 kg/dm³. Spezifische Oberfläche nach Blaine typisch 3.000-5.500 cm²/g. Normdruckfestigkeiten nach 28 Tagen (Klassen 32.5, 42.5, 52.5 jeweils N oder R). Erstarrungsbeginn nach Norm ≥ 45 bis ≥ 75 Minuten; Raumvolumenbeständigkeit nach Le Chatelier ≤ 10 mm.",
        oekologisch: "Konventioneller CEM I Klinker verursacht ca. 800-850 kg CO₂/t Klinker (davon ca. 60-65% rohstoffbedingt durch Kalkstein-Entsäuerung CaCO₃ → CaO + CO₂). Durch gezielte Klinkersubstitution (z.B. CEM II/B-M, CEM III/A, CEM II/C-M) und calcinierte Tone (LC3) kann der CO₂-Ausstoß auf unter 450 kg CO₂/t Zement gesenkt werden."
      },
      anwendungen: "Universelles Bindemittel für Ortbeton, Transportbeton, Betonfertigteile, Spannbeton, Spritzbeton, Mörtel, Estriche, Injektionsgüter im Spezialtiefbau sowie Bodenstabilisierungen.",
      produkte: "Normalzemente nach DIN EN 197-1: CEM I (Portlandzement), CEM II (Portlandkompositzement mit Hüttensand, Flugasche, Kalkstein), CEM III (Hochofenzement mit bis zu 95% Hüttensand), CEM IV (Puzzolanzement), CEM V (Kompositzement) sowie Zemente mit besonderen Eigenschaften (SR - hoher Sulfatwiderstand, LH - niedrige Hydratationswärme, NA - niedriger wirksamer Alkaligehalt).",
      dauerhaftigkeit: "Zementstein ist wasserunlöslich, frostbeständig und bildet durch die Freisetzung von Portlandit (Ca(OH)₂) ein hochalkalisches Porenwasser (pH > 12,6), das eingebetteten Bewehrungsstahl durch Passivierung dauerhaft vor Korrosion schützt.",
      kosten: "Ca. 120-180 €/t im Silozug bzw. Sackware je nach Festigkeitsklasse, Klinkersubstitutionsgrad und regionaler Frachtentfernung.",
      recycling: "Ausgehärteter Zementstein wird zusammen mit Gesteinskörnungen im Brechbeton-Verfahren aufbereitet und als hochwertige RC-Gesteinskörnung (Typ 1 / Typ 2 nach DIN 4226-101) wiederverwendet. Feinstanteile können als Rohmehlsubstitut im Zementwerk thermisch rekristallisiert werden.",
      besonderheiten: "Zementstein unterliegt Schwindvorgängen (autogenes Schwinden durch chemische Kontraktion, Trocknungsschwinden durch Kapillarwasserverlust) sowie lastabhängigem Kriechen. Die Festigkeitsentwicklung folgt streng dem Wasser-Zement-Wert (w/z-Wert nach Walz).",
      innovationen: "LC3-Zemente (Limestone Calcined Clay Cement mit bis zu 50% Klinkereinsparung), Abscheidung und Speicherung/Nutzung von CO₂ (CCS/CCU) am Zementofen, klinkerfreie Geopolymer-Bindemittel und alkali-aktivierte Schlackensysteme (AAM).",
      historie: "Bereits von den Römern als Opus Caementicium mit Puzzolanerde genutzt; 1824 von Joseph Aspdin in Leeds patentiert ('Portland Cement' wegen Ähnlichkeit zum Portland-Kalkstein); die Entwicklung des Drehrohrofens (Ransome 1885) begründete die moderne weltweite Großindustrie."
    }
  },
  beton: {
    name: "Normalbeton & Transportbeton",
    subtitle: "Universeller Konstruktionswerkstoff nach DIN EN 206 / DIN 1045-2 und DIN EN 1992-1-1 (Eurocode 2)",
    sections: {
      rohstoffe: "Gesteinskörnungen (Kies, Sand, Splitt nach DIN EN 12620, Sieblinien A/B/C), Zement als hydraulisches Bindemittel (DIN EN 197-1), Zugabewasser nach DIN EN 1008, Betonzusatzmittel (Fließmittel, Luftporenbildner, Verzögerer nach DIN EN 934-2) sowie Betonzusatzstoffe (Flugasche Typ II, Silikastaub, Hüttensandmehl, Kalksteinmehl Typ I).",
      herstellung: "Rechnergestützte Mischungsberechnung nach der Stoffraumrechnung (1 m³ verdichteter Frischbeton = 1000 dm³ Stoffraumvolumen). Dosierung im Betonwerk, Transport im Fahrmischer, Förderung per Betonpumpe, fachgerechtes schichtweises Verdichten mit Innen- oder Schalungsrüttlern sowie sofortige Nachbehandlung gegen vorzeitiges Austrocknen.",
      eigenschaften: {
        technisch: "Trockenrohdichte 2.000 bis 2.600 kg/m³ (Standard ~2.400 kg/m³). Druckfestigkeitsklassen von C12/15 bis C100/115. Zugfestigkeit beträgt ca. 10% der Druckfestigkeit. Elastizitätsmodul E_cm von 27.000 bis 44.000 MPa. Wärmedehnungskoeffizient α_T ≈ 10·10⁻⁶ K⁻¹ (exakt abgestimmt auf Betonstahl!).",
        oekologisch: "Treibhausgaspotenzial konventioneller Betone ca. 180-260 kg CO₂-Äq./m³, durch klinkereffiziente Zemente (CEM II/C, CEM III) und optimierte Kornpackung absenkbar auf unter 100 kg CO₂-Äq./m³. Geringer Primärenergieaufwand bei Gesteinskörnungen; regionale Verfügbarkeit durch kurze Transportwege (< 30 km)."
      },
      anwendungen: "Tragende Bauteile im Hoch-, Ingenieur-, Verkehrs- und Wasserbau: Fundamente, Bodenplatten, Stützen, Wände, Decken, Brückenpfeiler und Überbauten, Tunnelinnenschalen, Klärbecken und Industrieböden.",
      produkte: "Beton nach Eigenschaften (Standardtransportbeton), Beton nach Zusammensetzung, Standardbeton, Betonfertigteile (Hohldielen, Elementdecken, Doppelwände, Binder), Unterwasserbeton, WU-Beton (wasserundurchlässig nach DAfStb).",
      dauerhaftigkeit: "Konzeptionierung über Expositionsklassen: XC (Karbonatisierung), XD/XS (Chloride), XF (Frost und Frost-Tausalz), XA (chemischer Angriff), XM (Verschleiß). Sicherung durch Einhalten von Mindestbetondeckung c_nom und Grenzwerten für max. w/z-Wert und Mindestzementgehalt.",
      kosten: "Ca. 95-155 €/m³ Transportbeton frei Baustelle (abhängig von Druckfestigkeitsklasse, Expositionsklassen, Konsistenz und Pumpeneinsatz).",
      recycling: "Nahezu 100% zirkulär: Aufbereitung von Abbruchbeton durch Brechen und Sieben zu RC-Gesteinskörnung Typ 1 nach DIN 4226-101. Wiederverwendung in R-Beton mit bis zu 45 Vol.-% Substitution der Grobkörnung nach DIN 1045-2.",
      besonderheiten: "Hervorragende Drucktragfähigkeit bei geringer Zugfestigkeit; daher zwingender Verbund mit Bewehrungsstahl oder Spannstahl. Das Verbundverhalten basiert auf mechanischem Formschluss (Bewehrungsrippen), Reibung und Adhäsion.",
      innovationen: "R-Beton mit CO₂-mineralisiertem Altbetongranulat, Ultra-Hochfester Beton (UHPC), Carbonbeton mit nicht-korrodierender Carbonfaser-Bewehrung, selbstverdichtender Beton (SVB) und zementfreie Alkali-aktivierte Betone.",
      historie: "Historischer Vorläufer Opus Caementicium in Rom (Pantheon 126 n. Chr. mit 43 m freispannender Kuppel). Patentierung des Eisenbetons durch Joseph Monier (1867); wissenschaftliche Bemessungstheorie ab 1900 durch Emil Mörsch und François Hennebique."
    }
  },
  bitumen: {
    name: "Bitumen & Modifizierte Bitumen",
    subtitle: "Thermoplastisches viskoelastisches Bindemittel nach DIN EN 12591 und DIN EN 14023 (PmB)",
    sections: {
      rohstoffe: "Schwerste Vakuumdestillationsrückstände ausgewählter naphthen- und aromatenreicher Rohöle. Modifizierung mittels Elastomeren (SBS: Styrol-Butadien-Styrol-Blockcopolymere), Plastomere (EVA, PE) oder Reaktivharzen zur Erhöhung der elastischen Rückstellung und Temperaturspanne.",
      herstellung: "Erdölraffination: Nach der atmosphärischen Destillation von Rohöl (Abtrennung von Benzin, Kerosin, Gasöl) wird der Rückstand in der Vakuumdestillation bei ca. 350-400 °C unter vermindertem Druck destilliert. Der Sumpfrückstand ergibt das Primärbitumen. Durch Blasen mit Heißluft (Oxidationsbitumen) oder Homogenisierung mit Polymeren (PmB) entstehen Spezialbitumen.",
      eigenschaften: {
        technisch: "Dichte bei 25 °C ca. 1,01-1,04 g/cm³. Ausgeprägt thermorheologisch einfaches, temperaturabhängiges Verhalten: bei tiefen Temperaturen elastisch-spröde (Gefahr von Kälterissen), bei hohen Temperaturen viskos-fließend (Gefahr von Spurrinnen). Nadelpenetration bei 25 °C (von 20 bis 220 0,1 mm), Erweichungspunkt Ring und Kugel (EP RuK von 35 °C bis >65 °C), Brechpunkt nach Fraaß bis -20 °C.",
        oekologisch: "Erdölbasierter Baustoff mit hohem stofflich gebundenem Energieinhalt (PEI ~ 42-45 MJ/kg). Fungiert im Bauwerk als Kohlenstoffsenke. Vollständig rezyklierbar: Asphalt mit Bitumenbindung kann thermisch schadstoffarm aufbereitet und stofflich zu 100% wieder dem Straßenbau zugeführt werden."
      },
      anwendungen: "Hauptbindemittel im Asphaltstraßenbau (Asphalttragschichten, Asphaltbinder, Asphaltdeckschichten wie SMA oder OPA), Bauwerks- und Dachabdichtungsbahnen nach DIN 18531 / DIN 18533, Gussasphalt für Parkdecks und Brückenbeläge, Fugenvergussmassen und Bautenschutzanstriche.",
      produkte: "Straßenbaubitumen (z.B. 20/30, 30/45, 50/70, 70/100, 160/220), Polymermodifizierte Bitumen (PmB z.B. 25/55-55 A, 45/80-65 A), Hartbitumen, Bitumenemulsionen (kationische Emulsionen C60B1-S für Schichtenverbund), Kaltbitumen.",
      dauerhaftigkeit: "Vollkommen wasserunlöslich und dicht gegen drückendes Wasser; chemisch beständig gegen wässrige Salzlösungen, verdünnte Säuren und Basen. Alterungsempfindlich gegenüber UV-Strahlung und atmosphärischem Sauerstoff (Photooxidation führt zu Verharzung, Verhärtung und Versprödung).",
      kosten: "Ca. 500-800 €/t Straßenbaubitumen bzw. 700-1.100 €/t für polymermodifiziertes Bitumen (abhängig von Weltmarkt-Rohölpreisen).",
      recycling: "Hervorragende Zirkularität: Gefräster Altasphalt (Asphaltgranulat RC-Asphalt) wird in Asphaltmischanlagen dosiert zugegeben. Das gealterte Bitumen wird durch weichere Frischebitumen oder Rejuvenatoren (Verjüngungsmittel) rheologisch reaktiviert.",
      besonderheiten: "Kolloidaler Aufbau nach dem Nellensteyn-Pfeiffer-Modell: Hochmolekulare Asphaltene sind als Mizellen in niedermolekularen Maltenen dispergiert und durch Harze stabilisiert (Sol- oder Gel-Typ).",
      innovationen: "Niedertemperaturasphalt (Temperaturabsenkung um 30-40 °C mittels Zeolithen oder viskositätsverändernden Wachsen zur Minderung von Dämpfen und Energie), biobasierte Bindemittel aus Lignin oder Algenöl zur vollständigen Rohölasubstitution.",
      historie: "Bereits im 3. Jahrtausend v. Chr. in Mesopotamien als Naturasphalt (Schiffsabdichtungen, Mörtel) verwendet; industrielle Nutzung im modernen Straßenbau begann ab ca. 1870 in London und New York mit Naturasphalt (Trinidad-See) und ab 1900 mit Erdöldestillationsbitumen."
    }
  }
};

interface BaustoffProfilProps {
  materialKey: string;
}

export default function BaustoffProfil({ materialKey }: BaustoffProfilProps) {
  const profil = DEFT_PROFILES[materialKey];
  const tabContext = useTabContext();
  const setActiveTab = tabContext?.setActiveTab;

  const getDirectCalculationModules = (key: string) => {
    const k = key.toLowerCase();
    const list: { label: string; tab: string; badge: string; desc: string }[] = [];

    if (k.includes('beton') || k.includes('zement') || k.includes('gestein') || k.includes('kalk') || k.includes('geopolymer') || k.includes('flugasche')) {
      list.push({ label: 'Beton-Mischungsberechnung', tab: 'mischungsberechnung', badge: 'DIN EN 206', desc: 'Sieblinie, w/z-Wert & Mehlkorngehalt' });
      list.push({ label: 'Frisch- & Festbetonprüfung', tab: 'festbeton', badge: 'Labor', desc: 'Druckfestigkeitsklassen f_ck & E-Modul' });
      list.push({ label: 'Klausurrechnung: Mischungsentwurf', tab: 'rechnung_beton', badge: 'Rechner', desc: 'Schritt-für-Schritt Stoffraumrechnung' });
    }

    if (k.includes('daemm') || k.includes('ziegel') || k.includes('kalksand') || k.includes('porenbeton') || k.includes('gips') || k.includes('lehm') || k.includes('glas')) {
      list.push({ label: 'U-Wert & Wärmeschutz', tab: 'rechnung_u_wert', badge: 'GEG / DIN 4108', desc: 'Wärmedurchgangskoeffizient berechnen' });
      list.push({ label: 'Hygrothermie & Tauwassernachweis', tab: 'bauphysik', badge: 'Bauphysik', desc: 'Glaser-Diagramm & Dampfdiffusion' });
      list.push({ label: 'Schallschutz & Akustik', tab: 'schallschutz', badge: 'DIN 4109', desc: 'Schalldämmmaß R_w & Trittschall' });
    }

    if (k.includes('stahl') || k.includes('metall') || k.includes('holz')) {
      list.push({ label: 'Spannungs-Dehnungs-Linie', tab: 'spannung', badge: 'Mechanik', desc: 'Elastisch-plastisches Materialverhalten' });
      if (k.includes('holz')) {
        list.push({ label: 'Holzbau-Knicken nach Eurocode 5', tab: 'rechnung_holzbau', badge: 'EC5', desc: 'Tragfähigkeit schlanker Holzstützen' });
        list.push({ label: 'Holzwerkstoffe & dataholz', tab: 'holzbau_werkstoffe', badge: 'Konstruktion', desc: 'Zertifizierte Schichtaufbauten' });
      } else {
        list.push({ label: 'Stahlbeton-Biegebemessung', tab: 'rechnung_stahlbeton', badge: 'EC2', desc: 'Bewehrungsquerschnitt & Rissbreite' });
        list.push({ label: 'Bewehrungskorrosion & Schutz', tab: 'korrosion', badge: 'Dauerhaftigkeit', desc: 'Karbonatisierungsfortschritt & Chloride' });
      }
    }

    // Always include LCA and Instandsetzung
    list.push({ label: 'Ökobilanzierung (LCA/EPD)', tab: 'oekobilanz_lca', badge: 'Nachhaltigkeit', desc: 'GWP-Werte, Primärenergie & Zirkularität' });
    list.push({ label: 'Instandsetzung & Bauschäden', tab: 'instandsetzung_materialien', badge: 'Instandhaltung', desc: 'Materialgerechte Schutzsysteme' });

    return list;
  };

  const calcLinks = getDirectCalculationModules(materialKey);

  if (!profil) {
    return (
      <div className="bg-slate-50 border p-4 rounded-xl text-center text-xs text-text-main/60 font-sans">
        Kein standardisiertes Baustoffprofil für diesen Schlüssel ("{materialKey}") hinterlegt.
      </div>
    );
  }

  const sectionsList = [
    {
      id: 'rohstoffe',
      title: '1. Rohstoffe, Vorkommen & Gewinnung',
      icon: <Pickaxe size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.rohstoffe
    },
    {
      id: 'herstellung',
      title: '2. Herstellung & Werksprozess',
      icon: <Factory size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.herstellung
    },
    {
      id: 'eigenschaften_tech',
      title: '3a. Eigenschaften (technisch)',
      icon: <Activity size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.eigenschaften.technisch
    },
    {
      id: 'eigenschaften_oeko',
      title: '3b. Eigenschaften (ökologisch & EPD)',
      icon: <Leaf size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.eigenschaften.oekologisch
    },
    {
      id: 'materialitaet_architektur',
      title: '3c. Materialität, Haptik & Architektonische Ästhetik',
      icon: <Palette size={16} className={BRAND_COLOR_TEXT} />,
      content: (() => {
        const mat = ARCHITEKTUR_MATERIALITAET[materialKey];
        if (!mat) {
          return "Architektonische Oberflächenqualitäten, Texturen, Lichtreflexion und Haptik werden werkstoffspezifisch nach bauphysikalischen und entwurflichen Anforderungen im Detail geplant.";
        }
        return `• Optik & Textur: ${mat.optikTextur}\n• Haptik & Handhabung: ${mat.haptikOberflaeche}\n• Lichtwirkung & Reflexion: ${mat.lichtReflexion}\n• Alterungsverhalten & Patina: ${mat.alterungPatina}\n• Architektonischer Diskurs: ${mat.architekturBezug}`;
      })()
    },
    {
      id: 'anwendungen',
      title: '4. Hauptanwendungsgebiete im Hoch- und Tiefbau',
      icon: <Building2 size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.anwendungen
    },
    {
      id: 'produkte',
      title: '5. Standard-Lieferprodukte & Formate',
      icon: <Box size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.produkte
    },
    {
      id: 'dauerhaftigkeit',
      title: '6. Dauerhaftigkeit, Alterung & Schäden',
      icon: <Timer size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.dauerhaftigkeit
    },
    {
      id: 'kosten',
      title: '7. Relative Kosten, Preise & Wirtschaftlichkeit',
      icon: <TrendingUp size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.kosten
    },
    {
      id: 'recycling',
      title: '8. Recycling, Kreislauffähigkeit & Entsorgung',
      icon: <RefreshCw size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.recycling
    },
    {
      id: 'besonderheiten',
      title: '9. Normative Besonderheiten & Baustellen-Tipps',
      icon: <AlertTriangle size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.besonderheiten
    },
    {
      id: 'innovationen',
      title: '10. Innovationen, Forschung & Trends',
      icon: <Sparkles size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.innovationen
    },
    {
      id: 'historie',
      title: '11. Historie & historische Entwicklung',
      icon: <History size={16} className={BRAND_COLOR_TEXT} />,
      content: profil.sections.historie
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
      
      {/* Header card with Shirley dark style branding */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Gekoppeltes Baustoff-Datenblatt</span>
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          Steckbrief: {profil.name}
        </h3>
        <p className="text-xs text-text-main/60 font-sans leading-normal font-normal">
          {profil.subtitle}
        </p>
      </div>

      <div className="text-xs text-text-main/75 leading-relaxed font-sans">
        Dieses standardisierte Datenblatt fasst alle baustofftechnologischen Kernaspekte des Materials nach einheitlichen Lehrplanmaßstäben vollständig und übersichtlich zusammen.
      </div>

      {/* Interdisziplinärer Transfer & Direkte Modulverknüpfungen */}
      <div className="p-4 bg-shiraz/5 rounded-2xl border border-shiraz/20 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-text-main">
            <Calculator size={18} className="text-shiraz shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Interaktive Berechnungen & Werkzeuge für diesen Baustoff:
            </h4>
          </div>
          <span className="text-[10px] text-shiraz font-semibold hidden sm:inline-block bg-shiraz/10 px-2 py-0.5 rounded-full">
            Direktkopplung
          </span>
        </div>

        <p className="text-xs text-text-main/75 font-sans leading-relaxed">
          Verwende die Kennwerte dieses Baustoffprofils direkt in den interaktiven Rechen- und Bemessungsmodulen:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {calcLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab && setActiveTab(link.tab as any)}
              className="flex flex-col text-left p-2.5 rounded-xl border border-home-grau/25 bg-white hover:border-shiraz/40 hover:shadow-sm hover:bg-off-white transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[10px] font-bold text-shiraz bg-shiraz/10 px-1.5 py-0.5 rounded">
                  {link.badge}
                </span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-shiraz group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-xs text-text-main group-hover:text-shiraz transition-colors mt-1">
                {link.label}
              </span>
              <span className="text-[11px] text-slate-500 font-sans leading-snug mt-0.5">
                {link.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Stack of Always Open Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionsList.map((sec) => {
          return (
            <div 
              key={sec.id}
              tabIndex={0}
              aria-label={sec.title}
              className="rounded-xl border border-slate-150 bg-slate-50/20 p-4 font-sans text-xs flex flex-col gap-2.5 shadow-sm hover:border-home-grau/40 focus:ring-2 focus:ring-shiraz focus:outline-none transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 md:gap-2.5 font-bold text-slate-800">
                  {sec.icon}
                  <span>{sec.title}</span>
                </div>
                {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                  <button
                    onClick={() => {
                      try {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(`${sec.title}. ${sec.content}`);
                        utterance.lang = 'de-DE';
                        window.speechSynthesis.speak(utterance);
                      } catch (e) {}
                    }}
                    className="text-slate-400 hover:text-shiraz transition-colors p-1 rounded hover:bg-slate-100"
                    title="Abschnitt vorlesen lassen (Screenreader / Audio)"
                    aria-label={`Abschnitt ${sec.title} vorlesen`}
                  >
                    <Volume2 size={13} />
                  </button>
                )}
              </div>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
