import React, { useState } from 'react';
import { AlertTriangle, Wind, Droplets, Flame, Bug, Shield, Search, Globe, Activity } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl } from '@/src/utils/numberFormat';

const SCHADSTOFFE_DATA = [
  {
    id: 'asbest',
    name: 'Asbest',
    gestisUrl: 'https://gestis.dguv.de/search?query=Asbest',
    icon: <Wind size={24} className="text-gray-500" />,
    color: 'bg-gray-50 border-gray-200',
    textColor: 'text-gray-800',
    vorkommen: [
      'Fest gebunden: Faserzement-Platten (z. B. Wellplatten, Flachdachplatten, Fassadenbekleidungen), Rohre, Formteile.',
      'Schwach gebunden: Spritzasbest (Brandschutz auf Stahlträgern, Deckenisolierung), Leichtbauplatten, Dichtungsschnüre, Ofenpappen.',
      'Verdeckte Vorkommen (hochrelevant): Fliesenkleber (Dünnbettkleber), Wand- und Deckenspachtelmassen, Putze, Ausgleichs- und Nivelliermassen (systematisch erst seit dem Nationalen Asbestdialog ab etwa 2015 thematisiert).',
      'Einsatz bis Verbot: Hauptsächlich 1950er bis 1980er Jahre. Das generelle Herstellungs- und Verwendungsverbot in Deutschland gilt seit dem 31. Oktober 1993; EU-weit gilt das Verbot seit 2005 (heute REACH Anhang XVII Nr. 6).'
    ],
    gefahren: [
      'Gesundheitsgefahr: Das Einatmen freigesetzter Asbestfasern ist hochgradig krebserzeugend. Die lungengängigen Fasern (Sondermessungen: Länge > 5 µm, Durchmesser < 3 µm) dringen tief in die Lungenalveolen ein und können Asbestose, Lungenkrebs sowie tödliche Mesotheliome (Brust- und Rippenfellkrebs) verursachen. Latenzzeit liegt oft bei 20 bis 40 Jahren.',
      'Sanierung: Nur durch fachkundige Unternehmen gemäß TRGS 519 unter strengen Schutzvorkehrungen (Schwarz-Weiß-Trennung, Mehrkammer-Personenschleusen, kontrollierter Unterdruck im Arbeitsbereich).',
      'Entsorgung: Gefährlicher Abfall. Deponierung erfolgt staubdicht verpackt in speziell gekennzeichneten Gewebesäcken (Big-Bags) auf dafür zugelassenen Deponien.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 06 05* (Asbesthaltige Baustoffe) - Gefährlicher Abfall.',
      'PSA (TRGS 519): Hochfiltrierende Atemschutzmaske (mind. FFP3 mit Ausatemventil oder gebläseunterstützte Luftversorgung), partikeldichter Einweg-Anzug (Typ 5/6, Nähte abgeklebt), nahtlose Schutzhandschuhe, Sicherheitsschuhe ohne Schnürsenkel (leichter zu dekontaminieren).'
    ]
  },
  {
    id: 'pak',
    name: 'PAK (Polyzyklische Aromatische Kohlenwasserstoffe)',
    gestisUrl: 'https://gestis.dguv.de/search?query=Polyzyklische+Aromatische+Kohlenwasserstoffe',
    icon: <Droplets size={24} className="text-black" />,
    color: 'bg-stone-50 border-stone-300',
    textColor: 'text-stone-800',
    vorkommen: [
      'Teerprodukte: Teerhaltige Klebstoffe unter altem Holzpflaster und Parkett, Dachpappen (Bitumenersatz), teerhaltige Schutzanstriche für erdberührte Bauteile und Silos.',
      'Holzschutz: Steinkohlenteeröle (z. B. Imprägnieröle für Bahnschwellen, Telegrafenmasten und Zäune im Außenbereich).',
      'Verwendungszeitraum: Teererzeugnisse wurden im Hochbau im Westen hauptsächlich bis Ende der 1970er Jahre, in der ehemaligen DDR bis 1990 eingesetzt. Das Verbot von Steinkohlenteeröl im Holzschutz erfolgte in Deutschland 1991.',
      'Erkennung: Charakteristischer, stechender Teergeruch bei Erwärmung, schwarz-braune viskose bis feste Konsistenz.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Viele PAK-Verbindungen (wie Benzo[a]pyren als Leitsubstanz) sind stark krebserzeugend, erbgutverändernd und fortpflanzungsgefährdend. Sie werden leicht über die Atemwege, aber auch transdermal (über die Haut) aufgenommen.',
      'Sanierung: Abtrag von PAK-haltigen Klebern erfolgt emissionsarm (z. B. Schleifverfahren mit Direktabsaugung Staubklasse H oder mittels thermischer Entschichtung unter Vollschutz gemäß TRGS 524 / DGUV Regel 101-004).',
      'Entsorgung: Entsorgungspflichtig als kohlenteerhaltig.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 03 01* (Kohlenteerhaltige Bitumengemische), 17 09 03* (sonstige Bau- und Abbruchabfälle, die gefährliche Stoffe enthalten).',
      'PSA (TRGS 524): Atemschutz mit Gas- und Partikel-Kombifilter (mind. A2-P3), Chemikalienschutzanzug, lösemittelbeständige Schutzhandschuhe.'
    ]
  },
  {
    id: 'pcb',
    name: 'PCB (Polychlorierte Biphenyle)',
    gestisUrl: 'https://gestis.dguv.de/search?query=Polychlorierte+Biphenyle',
    icon: <Flame size={24} className="text-orange-500" />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    vorkommen: [
      'Dehnungsfugen: Dauerelastische Fugendichtungsmassen (z. B. auf Polysulfidbasis) in Betonfertigteilbauten (Skelett- und Plattenbauweise, vorzugsweise Baujahre 1960 bis 1975).',
      'Anstriche & Lacke: Zugesetzt als physikalische Weichmacher und Flammschutzmittel in Brandschutzfarben, Deckenpaneel-Lacken und Schachtbeschichtungen.',
      'Kondensatoren: Isolierflüssigkeit in Kompensationskondensatoren älterer Leuchtstofflampen.',
      'Einsatz bis Verbot: Massenhafte Verwendung von 1955 bis 1975. Das Herstellungs- und Verwendungsverbot in Deutschland trat 1989 in Kraft.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Hochgradig chronisch toxisch, immuntoxisch und hormonell wirksam. PCB steht im Verdacht, krebserzeugend zu sein, und wird biologisch extrem langsam abgebaut.',
      'Sekundärkontamination (großes Problem): Da PCB aus dem Fugendichtstoff kontinuierlich in die Raumluft ausgast, zieht es in angrenzende mineralische Bauteile (Putz, Beton, Mauerwerk) sowie Einrichtung (Möbel, Tapeten) ein. Bei einer Sanierung müssen daher auch diese sekundären Quellen mechanisch abgetragen oder luftdicht maskiert werden.',
      'Sanierung: Ausbau von Primärfugen durch Herausschneiden ohne thermische Einwirkung (Verhinderung hochgiftiger Dioxinbildung). Sanierungsrichtlinie PCB beachten.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 09 02* (Bau- und Abbruchabfälle, die PCB enthalten).',
      'PSA (TRGS 524): Atemschutzmaske mit Kombifilter (A2-P3), flüssigkeitsdichter Schutzanzug (Typ 4/5), spezielle Butyl- oder Nitril-Schutzhandschuhe.'
    ]
  },
  {
    id: 'kmf',
    name: 'KMF (Künstliche Mineralfasern)',
    gestisUrl: 'https://gestis.dguv.de/search?query=K%C3%BCnstliche+Mineralfasern',
    icon: <Wind size={24} className="text-slate-500" />,
    color: 'bg-slate-50 border-home-grau/30',
    textColor: 'text-slate-800',
    vorkommen: [
      'Dämmstoffe: Glas- und Steinwolle zur thermischen und akustischen Dämmung von Dächern, Trockenbauwänden, Rohrleitungen und Fassaden.',
      'Das Problem "Alte Mineralwolle": Vor dem Jahr 2000 hergestellte Mineralfasern weisen eine hohe Biopersistenz (schwere Löslichkeit im Lungengewebe) auf. Sie neigen beim Brechen dazu, lungengängige, asbestähnliche Nadeln zu bilden.',
      'Stichtag / RAL-Gütezeichen: Seit dem 1. Juni 2000 dürfen in DE nur noch biolösliche "neue" KMF verwendet werden (GefStoffV Anhang II Nr. 5); die Hersteller stellten ab etwa 1996 um, das RAL-Gütezeichen (RAL-GZ 388) gibt es seit 1998. Alte KMF dürfen im Rahmen von Instandhaltungsarbeiten nicht wieder eingebaut werden; beim Rückbau gelten strenge Sicherheitsvorschriften.'
    ],
    gefahren: [
      'Gesundheitsgefahr: "Alte" biopersistente KMF sind als krebserzeugend (Kategorie 1B) eingestuft. Sie verursachen bei Kontakt zudem heftigen mechanischen Juckreiz auf der Haut und Schleimhautreizungen.',
      'Kanzerogenitätsindex (KI-Wert): Die Bewertung erfolgt im Labor anhand der chemischen Zusammensetzung. KI = Summe Oxide (Na, K, Ca, Mg, Ba, B) minus 2x Aluminiumoxid. Ist der KI ≥ 40, erfolgt keine Einstufung als krebserzeugend. Ist der KI ≤ 30, ist das Material als krebserzeugend Kategorie 1B einzustufen. Liegt der Wert dazwischen (30 < KI < 40), gilt Kategorie 2 (Verdacht); es wird in der Baupraxis standardmäßig wie altes KMF behandelt, außer es wird per In-vivo-Test nach Anhang II Nr. 5 GefStoffV eine ausreichende Biolöslichkeit nachgewiesen.',
      'Sanierung (TRGS 521): Staubminderung durch Befeuchtung/Faserbindung, zerstörungsfreier Rückbau (kein Werfen, Reißen oder Schreddern), luftdichte Verpackung direkt am Entstehungsort in eigens deklarierten KMF-Big-Bags.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 06 03* (Anderes Dämmmaterial, das aus gefährlichen Stoffen besteht) - für alte Mineralwolle.',
      'PSA (TRGS 521): Atemschutz (Halbmaske mit Partikelfilter P2, besser P3/FFP3), geschlossener Einweg-Schutzanzug Typ 5 mit Kopfhaube, dichte Schutzbrille gegen Faserflug, Schutzhandschuhe.'
    ]
  },
  {
    id: 'pfas',
    name: 'PFAS (Per- und polyfluorierte Alkylsubstanzen)',
    gestisUrl: 'https://gestis.dguv.de/search?query=PFAS',
    icon: <Droplets size={24} className="text-blue-500" />,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    vorkommen: [
      'Eigenschaften: Extrem wasser-, fett- und schmutzabweisend sowie thermisch und chemisch stabil ("Ewigkeitschemikalien").',
      'Einsatzgebiete im Bau: Spezial-Imprägnierungen für Steinfassaden, Betonversiegelungen, teppich- und polsterabweisende Beschichtungen, Dichtungsbänder, Additive in Speziallacken sowie historische Feuerlöschschäume im Umfeld von Brandübungsplätzen.',
      'Verbreitung: Akkumulieren sich in der Umwelt, sind extrem mobil im Boden und wandern ungebremst in das Grundwasser.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Stehen im Verdacht, Leberschäden, Schilddrüsenerkrankungen, hormonelle Störungen und Krebs zu verursachen. Schädigen die fötale Entwicklung.',
      'Sanierung / Schutz: Bei belasteten Böden oder kontaminiertem Bauschutt (z. B. nach Bränden) sind aufwändige Bodensanierungen (Ausbrennung oder Einkapselung) oder aufwändige Filterung des Sickerwassers über Aktivkohle erforderlich.',
      'Relevanz in der Ersatzbaustoffverordnung: PFAS-Sondergrenzwerte im Eluat gewinnen zunehmend an juristischer Brisanz bei der Verwertung mineralischer Baustoffe.'
    ],
    entsorgung: [
      'AVV-Schlüssel: Je nach Trägermaterial, meist 17 05 03* (Boden und Steine, die gefährliche Stoffe enthalten) oder 17 09 03*.',
      'PSA: Abhängig von der Anwendung und Staub-/Flüssigkeitsbildung. Standardmäßig partikelfiltrierende Atemschutzmasken (P3) und flüssigkeitsdichte Schutzbekleidung bei Nasssanierungen.'
    ]
  },
  {
    id: 'chlorparaffine',
    name: 'Chlorparaffine (Chlorierte Paraffine - CPs)',
    gestisUrl: 'https://gestis.dguv.de/search?query=Chlorparaffine',
    icon: <Droplets size={24} className="text-zinc-600" />,
    color: 'bg-zinc-50 border-zinc-200',
    textColor: 'text-zinc-800',
    vorkommen: [
      'Einsatz: Als Weichmacher und flammhemmende Additive in Kunststoffen, Kabelschutzrohren, dicken Kabelmänteln, Fugendichtstoffen und Metallbearbeitung.',
      'Zeitraum: Intensiv genutzt seit Ausstieg aus PCB in den 1980er und 1990er Jahren als direkter Weichmacher-Ersatzstoff.',
      'Einstufung: Kurzkettige Chlorparaffine (SCCPs) sind als POP (Persistent Organic Pollutants) weltweit verboten, mittelkettige (MCCPs) unterliegen strengen Beschränkungen.'
    ],
    gefahren: [
      'Gesundheitsgefahr: SCCPs sind nachweislich krebserzeugend im Tierversuch und schädigen Wasserorganismen langfristig. Sie besitzen ein hohes Bioakkumulationspotenzial.',
      'Rückbaumaßnahmen: Strikt staubreduzierte Ausbauverfahren bei Fugenproben und Kabelkanälen.',
      'Abfallrechtliche Einstufung: Überschreiten CPs bestimmte Grenzwerte (POP-Abfallgrenzwert von 10.000 mg/kg), dürfen diese Abfälle nicht normal recycelt werden und unterliegen einer gesetzlichen Verbrennungspflicht.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 02 03 (Kunststoffe), bei Kontamination 17 09 03* (Bauabfälle mit gefährlichen Inhaltsstoffen).',
      'PSA: Atemschutz FFP3/P3 bei mechanischem Abtrag (Staubbildung), schnittfeste Schutzhandschuhe, Standard-Schutzanzug.'
    ]
  },
  {
    id: 'quecksilber',
    name: 'Quecksilber & Verbindungen',
    gestisUrl: 'https://gestis.dguv.de/search?query=Quecksilber',
    icon: <Droplets size={24} className="text-indigo-400" />,
    color: 'bg-indigo-50 border-indigo-200',
    textColor: 'text-indigo-800',
    vorkommen: [
      'Holzschutz & Biozide: Ältere, quecksilberhaltige Holzschutzmittel (insb. in historischen Holzbauten wie Kirchen, historischen Speichern bis ca. 1980).',
      'Messer & Schalter: Neigungsschalter, Quecksilberrelais, ältere Heizungs-Thermostate.',
      'Farben & Lacke: Historische Fungizide in Dispersions- und Latexfarben (Verwendung vor allem im 20. Jahrhundert).',
      'Industriestandorte: Extreme Rückstandskontaminationen im Mauerwerk und Boden alter Chemie-, Thermometer- oder Glühlampenwerke.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Quecksilberdampf ist hochentgiftend für das zentrale Nervensystem und führt zu chronischen Gehirnschäden, Nierenversagen und Lungenschäden. Es gast bereits bei Raumtemperatur kontinuierlich aus kontaminierten Flächen aus!',
      'Sanierung: Aufspüren mittels spezieller Detektoren (Quecksilberdampfsonden). Sanierung erfordert oft den kompletten Ausbau kontaminierter Mauerwerksschichten oder thermische Desorption unter Unterdruckbedingungen. Keine ungeschützten Arbeiten wegen hoher Resorptionsquote über die Atemwege.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 09 01* (Abfälle, die Quecksilber enthalten), 17 05 03* (Boden und Steine).'
    ]
  },
  {
    id: 'biogefahren',
    name: 'Biologische Gefahrstoffe',
    icon: <Bug size={24} className="text-emerald-700" />,
    color: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-800',
    vorkommen: [
      'Schimmelpilze: Massives Wachstum in feuchten Bauteilen nach Wasserschäden, Hochwasser, Wärmebrücken oder mangelhafter Lüftung (insb. auf Gipskartonplatten, Holzwerkstoffen, Tapeten). Dies betrifft sowohl Alt- als auch Neubauten.',
      'Taubenkot / Exkremente: Zentimeterdicke Ablagerungen auf Dachstühlen, ungenutzten Dachböden, Gesimsen und historischen Fassaden.',
      'Abwasser / Fäkalien: Kontaminationen nach Rohrbrüchen, Rückstau oder fäkalbelasteten Wasserschäden.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Sporen von Schimmelpilzen verursachen schwere Atemwegserkrankungen, chronische Allergien und Mykosen bei immungeschwächten Personen. Taubenkot enthält pathogene Erreger wie Chlamydien, Salmonellen und Kryptokokken (Gefahr schwerer Infektionen).',
      'Biostoffverordnung (BioStoffV): Biologische Arbeitsstoffe werden in Risikogruppen 1 bis 4 eingestuft. Schimmelpilzbeseitigung und Taubenkotsanierung unterliegen klaren Richtlinien der Berufsgenossenschaft (Handlungsanleitungen).'
    ],
    entsorgung: [
      'Klassifizierung nach BioStoffV: Einstufung meist in Risikogruppe 2/3. Arbeiten dürfen nur von unterwiesenem Personal unter strenger Entstaubung durchgeführt werden. Desinfektion nötig.',
      'Entsorgung: Materialabhängig (z.B. Gipskarton als Gipsabfall oder hausmüllähnlicher Abfall). Biologisch aktive Bauteile vorzugshalber der thermischen Verwertung zuführen.'
    ]
  }
];

const TREATMENT_OPTIONS = {
  erdaushub_sand: {
    label: 'Sandiger / kiesiger Erdaushub',
    heavy_metals: {
      method: 'Bodenwaschanlage (Nassmechanische Klassierung)',
      efficiency: 'Sehr hoch (85% - 95%)',
      co2: 'Niedrig (~10-15 kg CO₂/t)',
      cost: 'Mittel (45 - 75 €/t)',
      principles: 'Physisch-mechanische Trennung. Durch Waschen im Attritionsreaktor werden Schadstoffe, die sich bevorzugt an feinen Bodenpartikeln (Silt, Ton) anlagern, von den sandigen/kiesigen Fraktionen abgetrennt. Die Feinfraktion wird entwässert und als Filterkuchen entsorgt, während Sand und Kies gereinigt recyclingfähig sind.',
      steps: [
        'Annahme und Vorabsiebung von holzigen/groben Störstoffen.',
        'Schwertwäsche & Attrition: Intensives Reiben der Partikel löst die schadstoffbelastete Feinstaubschicht.',
        'Zyklonierung & Dichtetrennung: Hydrozyklone separieren den sauberen Sand von belastetem Schluff.',
        'Kammerfilterpresse: Eindickung des Schlamms zu hochkonzentriertem Filterkuchen (Klasse DK I/II oder Deponierung).',
        'Ausgangskontrolle: Analytik des gereinigten Sandes/Kieses zur Einstufung nach EBV (Ziel: BM-0/BM-1).'
      ],
      rules: 'EBV § 15 & BBodSchV Anh. 1: Gereinigte Sande sind mineralische Ersatzbaustoffe. Grenzwerte für Schwermetalle (As, Pb, Cd, Cu, Ni, Zn) im Eluat müssen sicher unterschritten werden, um Einbauklasse BM-0 oder RC-1 zu erhalten.'
    },
    mkw_pak: {
      method: 'Mikrobiologische Mietenbehandlung (Bioremediation)',
      efficiency: 'Hoch (80% - 90% für kurzkettige MKW / PAK)',
      co2: 'Sehr niedrig (~5-8 kg CO₂/t)',
      cost: 'Günstig (25 - 40 €/t)',
      principles: 'Biologischer Abbau von organischen Schadstoffen durch hochaktive, körpereigene oder angelegte Mikroorganismen (Bakterien und Pilze). Das Material wird in Mieten aufgesetzt, belüftet und durch Feuchte- und Nährstoffzugabe (Flüssigdünger) im optimalen Abbau-Milieu gehalten.',
      steps: [
        'Mechanische Homogenisierung und Absiebung grober Störstoffe.',
        'Mietenaufbau: Lockeres Aufschütten mit perforiertem Belüftungssystem (Unterdruck- oder Überdruckbelüftung).',
        'Konditionierung: Zugabe von Wasser, Stickstoff, Phosphor und strukturverbessernden Zuschlagstoffen (z. B. Rinde/Hackschnitzel).',
        'Regelmäßiges Umsetzen (Mietenpflege) zur Sauerstoffeintragung und Temperaturkontrolle (optimal 30°C - 45°C).',
        'Analytische Erfolgskontrolle: Feststoffanalytik auf KW-Index und PAK16.'
      ],
      rules: 'Bundes-Bodenschutzverordnung (BBodSchV): Biologisch behandelte Böden können uneingeschränkt wieder aufgebracht werden, sofern die bodenspezifischen Vorsorgewerte eingehalten werden. Extrem strenge Überwachung der Sickerwasserwerte im Verlauf.'
    },
    asbest_faser: {
      method: 'Einkapselung / Thermische Zerstörung (Deponierung Pflicht)',
      efficiency: 'Keine stoffliche Aufbereitung möglich',
      co2: 'Extrem hoch',
      cost: 'Sehr teuer (120 - 250 €/t)',
      principles: 'Asbestfasern sind mineralisch stabil und nicht biologisch abbaubar. Eine nassmechanische Reinigung ist technisch unmöglich, da Fasern das Abwasser kontaminieren würden. Einzige materialschonende Sanierung ist die Verfestigung mit Zement oder der direkte staubdichte Transport zur Deponierung (DK I/II/III).',
      steps: [
        'Befeuchtung der Kontaminationsstelle zur Staubbindung.',
        'Staubdichte doppelwandige Big-Bag-Verpackung direkt an der Anfallstelle.',
        'Kennzeichnung als asbesthaltiger gefährlicher Abfall (AVV 17 06 05*).',
        'Transport unter lückenloser eANV-Nachweisüberwachung.',
        'Endlagerung in Monozellen auf zugelassenen Deponien ohne mechanische Nachbearbeitung.'
      ],
      rules: 'GefStoffV § 11 / REACH Anhang XVII Nr. 6 / DepV: Recycling oder Wiedereinbau asbesthaltiger Böden und Bauschuttgemische ist verboten; asbesthaltige Abfälle werden staubdicht verpackt deponiert.'
    },
    gips_sulfat: {
      method: 'Nassklassierung & Flotation',
      efficiency: 'Mittel (60% - 75%)',
      co2: 'Mittel (~20-30 kg CO₂/t)',
      cost: 'Mittel-Spezifisch (50 - 80 €/t)',
      principles: 'Dichtetrennung basierend auf der geringen Dichte und Löslichkeit von Gips (Calciumsulfat) gegenüber Quarzkies. Gips wird mechanisch abgesiebt, während feinere Gipsbeimengungen im nassen Separationsverfahren gelöst oder aufgeschwemmt werden, um Ettringittreiben im Beton-Recycling zu verhindern.',
      steps: [
        'Zerkleinerung auf optimale Korngröße unter Vermeidung von Feinststaub.',
        'Fraktionierte Siebung zur Abscheidung gipsreicher Feinfraktionen.',
        'Schwimm-Sink-Scheidung zur Trennung von Leichtstoffen (Gipsdichte ~2,3 g/cm³, Quarz ~2,65 g/cm³).',
        'Sedimentations- und Waschwasserbehandlung mit Fällungsmitteln zur Sulfat-Abreicherung.',
        'Analytischer Nachweis des Restsulfatgehalts im Feststoff.'
      ],
      rules: 'Ersatzbaustoffverordnung (EBV): Die Rest-Sulfatkonzentration im Eluat entscheidet über die Einstufung. Für Bauwerksbruch und Recyclingbaustoffe gelten strenge Sulfatgrenzwerte (RC-1: ≤ 150 mg/l), um Schäden an nachfolgenden Bauteilen auszuschließen.'
    }
  },
  boden_ton: {
    label: 'Toniger / schluffiger Bindiger Boden',
    heavy_metals: {
      method: 'Immobilisierung (Chemische Verfestigung)',
      efficiency: 'Sehr hoch (Dauerhafte Fixierung > 98%)',
      co2: 'Mittel (~35-50 kg CO₂/t)',
      cost: 'Mittel (40 - 70 €/t)',
      principles: 'Da tonige Böden aufgrund ihrer Feinkörnigkeit und Klebrigkeit nicht waschbar sind (Schlammanteil zu hoch), wird der Schadstoff chemisch immobilisiert. Durch Zugabe von hydraulischen Bindemitteln (Zement, Kalk, Hochofenschlacke) und speziellen Additiven (z.B. Zeolithe) werden Schwermetalle unlöslich in der Bodenmatrix eingebunden.',
      steps: [
        'Bodenkonditionierung durch Fräsen und Trocknungsunterstützung.',
        'Dosierte Zugabe von hydraulischen Bindemitteln und reaktiven Sorptionsmitteln.',
        'Intensives Einmischen im Zwangsmischer oder in-situ mittels Spezialfräsen.',
        'Verdichtung und kontrollierte Aushärtung (Carbonatisierung/Hydratation).',
        'Eluatprüfungen (z. B. DIN 19528) zur Bestätigung der dauerhaften Auslaugungsresistenz.'
      ],
      rules: 'Ersatzbaustoffverordnung (EBV) / BBodSchV: Immobilisierte Werkstoffe dürfen als technisches Sicherungsbauwerk (z. B. Basisabdichtungen von Deponien) verwertet werden. Für offenes Aufbringen gelten die Grenzwerte der BBodSchV, welche Immobilisate meist kritisch bewerten.'
    },
    mkw_pak: {
      method: 'Thermische Desorption (Drehrohrofen)',
      efficiency: 'Extrem hoch (> 99,9% Abbauquote)',
      co2: 'Sehr hoch (~60-90 kg CO₂/t)',
      cost: 'Sehr teuer (70 - 110 €/t)',
      principles: 'Da bindige Böden mikrobiell nur sehr langsam abgebaut werden können, ist die Thermik das einzig sichere Verfahren für hohe Belastungen. Der Boden wird in einem indirekt beheizten Drehrohrofen auf 350°C bis 550°C erwärmt. Organische Schadstoffe verdampfen (Desorption) und werden in einer thermischen Nachverbrennungsanlage bei > 850°C vollständig in CO₂ und Wasser zertrümmert.',
      steps: [
        'Vorzerkleinerung von Tonklumpen in Walzenbrechern.',
        'Zuführung in das Drehrohr und kontinuierliche Beheizung der Bodenmatrix.',
        'Absaugung der schadstoffbelasteten Ofengase unter Vakuum.',
        'Thermische Nachverbrennung der Gase bei mind. 850°C (Verweilzeit > 2 Sek) mit Rauchgaswäsche.',
        'Rückkühlung und Befeuchtung des gereinigten Bodens (staubfreie Aushändigung).'
      ],
      rules: 'KrWG / EBV: Thermisch behandelte Tonböden sind vollkommen schadstofffrei und organisch inert. Sie können nach Wiederbefeuchtung und Strukturverbesserung (z.B. Kompostbeimischung) als Bodenersatzstoff oder Füllmaterial gem. BM-0 eingesetzt werden.'
    },
    asbest_faser: {
      method: 'Deponierung / Thermische Faserzerstörung (Spezialanlagen)',
      efficiency: 'Nur thermische Zerstörung bei extremen Temperaturen (>1000°C) wirksam',
      co2: 'Extrem hoch',
      cost: 'Extrem teuer (>300 €/t)',
      principles: 'Asbestfasern können in Tonböden nur durch echtes Aufschmelzen (Sinterung/Verglasung) zerstört werden, da sich die Kristallgitterstruktur erst ab ca. 900°C bis 1000°C in unschädlichen Olivin umwandelt. Aufgrund der enormen Energiekosten wird dieses Verfahren in Deutschland kaum noch angewendet. Regelfall ist die DK-Deponierung.',
      steps: [
        'Ausgrabung unter Staubschutz-Sicherheitsauflagen (Bagger mit Kabinenüberdruck).',
        'Direkte staubfreie Verladung in Gewebecontainer.',
        'Transport unter gefährlicher Abfalldeklaration.',
        'Einbau in DK-Sicherheitsdeponie mit sofortiger Überdeckung.',
        'Katastermäßige Erfassung der Einbaukoordinaten.'
      ],
      rules: 'DepV / TRGS 519: Jede Art von mechanischer Mischung oder Siebung asbesthaltiger Tonböden ist verboten, um Faserfreisetzung zu unterbinden.'
    },
    gips_sulfat: {
      method: 'Immobilisierung & kontrollierter Monoeinbau',
      efficiency: 'Hoch (Fixierung des Sulfats)',
      co2: 'Mittel (~25-40 kg CO₂/t)',
      cost: 'Mittel (35 - 55 €/t)',
      principles: 'Aufgrund der Feinkörnigkeit von Tonschluff ist Gips nicht trocken- oder nassmechanisch abzuscheiden. Die einzige technische Option ist die chemische Bindung von Sulfat durch zementäre Bindemittel zu schwerlöslichen Ettringit-Phasen vor dem Einbau, um nachfolgende Schädigung benachbarter Schichten im Erdbau zu verhindern.',
      steps: [
        'Homogenes Einmischen von sulfatresistentem Zement (SR-Zement) oder Flugaschen.',
        'Konditionierung des Feuchtigkeitsgehalts zur optimalen Hydratation.',
        'Einbau im technischen Erdbau unter wasserdichten Deckschichten.',
        'Kontinuierliche Setzungsmessungen.',
        'Güteüberwachung mittels Eluattests über min. 28 Tage.'
      ],
      rules: 'EBV Anhang 1: Sulfatreicher bindiger Erdaushub wird üblicherweise den Klassen BM-F3 (erheblich eingeschränkter Einbau) oder BM-2 zugewiesen und erfordert strenge bautechnische Absicherungen gegen Grundwasserleiter.'
    }
  },
  bauschutt_gemisch: {
    label: 'Mineralisches Bauschutt-Gemisch (Beton, Ziegel, Fliesen)',
    heavy_metals: {
      method: 'Nassmechanische Dichtetrennung (Setzmaschinen / Jigs)',
      efficiency: 'Hoch (75% - 90%)',
      co2: 'Mittel (~15-25 kg CO₂/t)',
      cost: 'Mittel (35 - 60 €/t)',
      principles: 'Schwermetallkontaminationen in Bauschutt rühren meist von Anstrichen, Schlackenbestandteilen oder Industrieablagerungen her. In nassmechanischen Bauschuttaufbereitungsanlagen werden die Bauschuttfraktionen gewaschen. Schwere, belastete Partikel werden über Setzmaschinen selektiv abgetrennt.',
      steps: [
        'Vorzerkleinerung und Magnetscheidung (Eisen/Bewehrungsstahl abziehen).',
        'Nassklassierung in Hydro-Jigs (Setzmaschinen) zur Trennung nach Dichte.',
        'Windsichtung der Leichtstoffe (Holz, Kunststoffe, Folien) im Wasserstrom.',
        'Feinstaubabscheidung über Zyklon-Waschanlagen.',
        'Entwässerung der RC-Gesteinskörnung zur direkten Wiederverwendung.'
      ],
      rules: 'EBV Anhang 1 / DIN EN 206: Das gereinigte Material muss die Eluatgrenzwerte für RC-1 einhalten, um als Gesteinskörnung im R-Beton eingesetzt werden zu dürfen (z. B. Cu ≤ 100 µg/l, Pb ≤ 40 µg/l).'
    },
    mkw_pak: {
      method: 'Selektiver Rückbau & Thermische Reinigung',
      efficiency: 'Sehr hoch (> 95%)',
      co2: 'Hoch (~40-65 kg CO₂/t)',
      cost: 'Teuer (60 - 95 €/t)',
      principles: 'PAK (z. B. Steinkohlenteer-Flüssigkleber) haftet oft massiv an Beton und Ziegeln. Ist eine getrennte Erfassung gescheitert, kann das zerkleinerte Gemisch in stationären thermischen Desorptionsanlagen gereinigt werden, oder es muss auf Deponien (DK-I/II) entsorgt werden.',
      steps: [
        'Grobbruch und Aussortierung nicht-mineralischer Störstoffe.',
        'Mechanische Oberflächenreinigung (z.B. Kugelstrahlen/Fräsen) falls kontaminierte Flächen lokalisiert sind.',
        'Thermische Behandlung des Feinkorns im Drehrohr zur PAK-Vergasung.',
        'Rauchgasreinigung und Abgaswäsche zur sicheren Dioxin- und Furanvermeidung.',
        'Gütemäßige Abschlussprüfung auf PAK16 (Grenzwert RC-1: ≤ 4 mg/kg im Feststoff).'
      ],
      rules: 'Gewerbeabfallverordnung (GewAbfV) / Ersatzbaustoffverordnung: Teer- und PAK-belastete Bauschutt-Gemische dürfen unter keinen Umständen unaufbereitet verwertet werden. Grenzwertüberschreitungen führen zur Einstufung als gefährlicher Abfall.'
    },
    asbest_faser: {
      method: 'Wiederverwendungsverbot / Strikte Deponierung (DK I / II)',
      efficiency: 'Keine Aufbereitung zulässig',
      co2: 'Niedrig (reiner Transport)',
      cost: 'Teuer (100 - 180 €/t)',
      principles: 'Wandspachtelungen und Fliesenkleber enthalten oft feinste, asbestöse Beimengungen. Ein zerkleinertes asbesthaltiges Bauschuttgemisch verliert jegliche Recyclingfähigkeit. Es muss deponiert werden, um Faserverwehungen bei Aufbereitungsanlagen zu unterbinden.',
      steps: [
        'Einstellung des maschinellen Abbruchs bei Asbestfund.',
        'Manuelle Separierung unter Vollschutz und Schleusen-Technik.',
        'Befeuchtung des Materials zur Faserbindung mit Restfaserbindemittel.',
        'Doppelte Verpackung in zertifizierte Asbest-Big-Bags.',
        'Direkter Transport zur zugelassenen Deponie.'
      ],
      rules: 'GefStoffV / TRGS 519: Verstöße gegen das Verwendungsverbot für asbesthaltigen Bauschutt sind Ordnungswidrigkeiten oder Straftaten (u. a. ChemG, § 326 StGB). Aufbereitungsanlagen weisen Lkw mit Asbestverdacht ab.'
    },
    gips_sulfat: {
      method: 'Trockenmechanische Sortierung (NIR-Sensorik)',
      efficiency: 'Sehr hoch (85% - 95%)',
      co2: 'Sehr niedrig (~3-5 kg CO₂/t)',
      cost: 'Günstig (15 - 30 €/t)',
      principles: 'Im modernen Betonrecycling ist Gips der Hauptstörstoff. Durch Nahinfrarot-Sensorik (NIR) an Sortierbändern können gipshaltige Steine und Putzbrocken opto-elektronisch erkannt und in Millisekunden per Druckluftdüsen aus dem zerkleinerten Bauschuttstrom ausgeschossen werden.',
      steps: [
        'Zerkleinerung auf einheitliche Korngröße (meist 10/45 mm).',
        'Vorsiebung und Auswaschen von Anhaftungen.',
        'Einlagiger Materialtransport auf dem Band zur Sensorschleife.',
        'Echtzeit-Scannen mittels Nahinfrarotspektroskopie zur Gipserkennung.',
        'Pneumatischer Auswurf der Gipsfraktion.'
      ],
      rules: 'Ersatzbaustoffverordnung: R-Beton-Zuschläge Typ 1 dürfen maximal 0,8 M.-% Sulfat aufweisen. Die NIR-Sortierung stellt die einzig wirtschaftliche Möglichkeit dar, gemischten Bauschutt hierfür fit zu machen.'
    }
  },
  altablagerung: {
    label: 'Heterogene Altablagerungen / Deponiekörper',
    heavy_metals: {
      method: 'Nassklassierung, Dichtetrennung & Immobilisierung',
      efficiency: 'Mittel (60% - 80%)',
      co2: 'Hoch (~30-45 kg CO₂/t)',
      cost: 'Sehr teuer (75 - 120 €/t)',
      principles: 'Altablagerungen are extrem heterogen und enthalten organische Abfälle gepaart mit Bauschutt und Erden. Ein nassmechanisches Trennverfahren separiert den mineralisch-schweren Anteil, während Schwermetalle in den Feinfraktionen verbleiben und dort immobilisiert werden müssen.',
      steps: [
        'Ausgrabung unter Geruchs- und Emissionsschutzschutz (ggf. Absaugung).',
        'Mechanische Grobsortierung von Hausmüll- und Metallfraktionen.',
        'Nassklassierung zur Separation von Sanden und RC-Gesteinen.',
        'Spezifische Schwefelwasserstoff-Neutralisierung des Kreislaufwassers.',
        'Verfestigung des belasteten Feinschlammes zu inerten Monolithen.'
      ],
      rules: 'BBodSchV / DepV: Ein Wiedereinbau ist aufgrund des organischen Anteils (Glühverlust > 5%) meist unzulässig, sofern das Material nicht thermisch vorbehandelt wurde. Verpflichtender Einbau auf Deponiekörpern der Klasse DK-0/I.'
    },
    mkw_pak: {
      method: 'Thermisch-Biologische Kombi-Behandlung',
      efficiency: 'Hoch (85% - 95%)',
      co2: 'Sehr hoch (~50-80 kg CO₂/t)',
      cost: 'Sehr teuer (80 - 130 €/t)',
      principles: 'Für organisch belastete Altablagerungen wird eine Kombination angewandt: Zunächst mechanische Separierung der biologisch abbaubaren Treibstoffe, gefolgt von thermischer Reinigung des hochbelasteten Feinkorns oder einer langfristigen biologischen Mietenbehandlung für geringere Frachten.',
      steps: [
        'Aushub und luftdichte Zwischenlagerung zur VOC-Eindämmung.',
        'Siebwellen-Separation zum Abzug organischer Leichtstoffe.',
        'Mietenbiologie zur Abreicherung instabiler Kohlenwasserstoffe.',
        'Thermische Restzersetzung persistenter Teer- und PAK-Zonen im Drehrohr.',
        'Sicherheitsbewertung und Eluattests.'
      ],
      rules: 'BBodSchV / EBV: Strengste Auflagen bezüglich Kohlenwasserstoffgrenzwerten. Bei Kohlenwasserstoff-Index > 1000 mg/kg gelten enge Verwertungsschranken im Bodenbereich.'
    },
    asbest_faser: {
      method: 'Direktdeponierung unter Schleierberegnung (DK II / III)',
      efficiency: 'Keine Aufbereitung möglich',
      co2: 'Niedrig',
      cost: 'Sehr teuer (130 - 220 €/t)',
      principles: 'Historische Deponiekörper und Altablagerungen enthalten unkontrollierte Asbestnester. Jede mechanische Aufbereitung würde Fasern großflächig freisetzen. Deshalb erfolgt ausschließlich der direkte Aushub unter kontinuierlicher Wasservernebelung und die DK-Deponierung.',
      steps: [
        'Erstellung eines Arbeits- und Sicherheitsplans gem. TRGS 524 / DGUV Regel 101-004.',
        'Einsatz von Staubbindemitteln (Schleierberegnung am Baggerlöffel).',
        'Berührungsloser Aushub und Direktabtransport in staubbeständigen Spezialkippmulden.',
        'Sicherheitsverpackung im Deponieeinbaubereich.',
        'Sofortige Verdichtung und dichte Abdeckung auf der Deponieklasse DK-II.'
      ],
      rules: 'TRGS 524 / TRGS 519: Arbeiten in asbestbelasteten Altlastbereichen unterliegen der Anzeigepflicht bei den Arbeitsschutzbehörden und erfordern speziell ausgebildete Fachbauleiter.'
    },
    gips_sulfat: {
      method: 'Auslaugungsverhinderung & kontrollierter Deponiebau (DK I)',
      efficiency: 'Mittel-Gering (Immobilisierung)',
      co2: 'Mittel (~20-30 kg CO₂/t)',
      cost: 'Mittel-Teuer (50 - 85 €/t)',
      principles: 'Da Altablagerungen hohe Sulfat- und Gipsanteile aufweisen, führt Wasserzutritt zu Gipsreaktionen und extremen Sulfatfrachten im Sickerwasser. Die Aufbereitung beschränkt sich auf Entwässerung und Mischung mit hydrophoben Bindemitteln, um den Schadstofftransport ins Grundwasser wirksam zu unterbinden.',
      steps: [
        'Sondierung auf gips- und sulfatreiche Einlagerungszonen.',
        'Mechanische Entwässerung des heterogenen Materials.',
        'Zugabe von Flugaschen/Kalk zur Dichteverbesserung.',
        'Sicherheitsverfüllung in abgedichteten Deponiekörpern.',
        'Langzeitanalytik des Sickerwassers.'
      ],
      rules: 'DepV / BBodSchV: Bei Überschreitung des Sulfat-Eluatgrenzwerts ist der Einbau ohne technische Schutzmaßnahmen unzulässig. Die BBodSchV regelt das Eindringen in das Grundwasser extrem restriktiv.'
    }
  }
};

export default function Schadstoffe() {
  const [activeTab, setActiveTab ] = useState<'stoffe' | 'finder' | 'beprobung' | 'elution' | 'gefahrstoffe'>('stoffe');
  
  const [activeSchadstoff, setActiveSchadstoff] = useState(SCHADSTOFFE_DATA[0].id);
  const [selectedMEB, setSelectedMEB] = useState<'rc_baustoff' | 'bodenaushub' | 'hm_asche'>('rc_baustoff');
  const [asbestBaujahr, setAsbestBaujahr] = useState<number>(1990);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<10000 | 50000 | 100000>(50000);
  const [finderZeitraum, setFinderZeitraum] = useState<string>('1970-1989');
  const [finderBauteil, setFinderBauteil] = useState<string>('decken-waende');
  
  // States for interactive KMF oxide calculation (Lung bio-solubility index KI)
  const [oxidNaK, setOxidNaK] = useState<number>(16.2);
  const [oxidCaMg, setOxidCaMg] = useState<number>(4.5);
  const [oxidBaB, setOxidBaB] = useState<number>(0.2);
  const [oxidAl, setOxidAl] = useState<number>(12.5);
  
  const selectedSchadstoff = SCHADSTOFFE_DATA.find(s => s.id === activeSchadstoff) || SCHADSTOFFE_DATA[0];

  function checkRisks(zeitraum: string, bauteil: string) {
    const risks: { stoff: string, level: 'hoch' | 'mittel' | 'gering', detail: string }[] = [];
    
    if (bauteil === 'decken-waende') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'Asbest (Chrysotil, Amosit)', level: 'hoch', detail: 'Spritzasbest als Brandschutz an tragenden Bauteilen sowie verdecktes dünnes Faseraufkommen in mineralischen Innenputzen und feinsten Wandspachtelmassen.' });
        risks.push({ stoff: 'KMF (Lungengängige Fasern)', level: 'hoch', detail: 'Alte lungenbelastende biopersistente Mineralwolle (Glas-/Steinwolle) im Hohlraum von Metallständer-Leichtbauwänden.' });
        risks.push({ stoff: 'PCB (Polychlorierte Biphenyle)', level: 'mittel', detail: 'Spezielle Brandschutzbeschichtungen auf Akustikdeckenplatten und weichmacherhaltige Lasuren an dekorativen Holzdeckenelementen.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Asbest', level: 'mittel', detail: 'Restvorkommen in Wandspachtelmassen oder Fliesenklebern aus der Übergangszeit vor dem finalen Verbot im Oktober 1993.' });
        risks.push({ stoff: 'KMF', level: 'hoch', detail: 'Einsatz lungenbelastender Alt-Mineralwolle ohne biologisches Abbausiegel (RAL-Gütezeichen) weiterhin möglich.' });
      } else {
        risks.push({ stoff: 'VOC (Flüchtige organische Verbindungen)', level: 'mittel', detail: 'Ausgasungen aus lösungsmittelhaltigen Farben, Lackgrundierungen und Fugenversiegelungen.' });
        risks.push({ stoff: 'Schimmelpilze', level: 'mittel', detail: 'Biologischer Befall auf feuchten Gipskartonoberflächen bei Bauaustrocknungsstörungen oder Kondenswasserschäden.' });
      }
    }
    
    if (bauteil === 'bodenbelag') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PAK (Polyzyklische Aromaten)', level: 'hoch', detail: 'Ausgezeichneter teerhaltiger schwarzer Klebstoff unter altem Parkett, Holzpflaster oder unter Asbestplatten.' });
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: 'Halbstarre Vinyl-Bodenbeläge (Flex-Platten) sowie der dazugehörige bituminöse Dünnbettkleber.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Asbest', level: 'gering', detail: 'Geringes Restrisiko aus asbesthaltigen Estrichgrundierungen oder Fliesenbettklebern vor 1993.' });
        risks.push({ stoff: 'VOC', level: 'mittel', detail: 'Freisetzung von Aldehyden (z. B. Formaldehyd) aus schadstoffhaltigen Spanplattenunterböden.' });
      } else {
        risks.push({ stoff: 'VOC', level: 'mittel', detail: 'Ausgasungen von Polyurethan- und Epoxidharz-Bodenlacken sowie Weichmachern aus modernen PVC-Rollenwaren.' });
      }
    }
    
    if (bauteil === 'fassade') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: 'Asbestzement-Fassadenbekleidungen, Faserzement-Wellplatten an den Giebeln sowie asbesthaltiger Strukturmörtel.' });
        risks.push({ stoff: 'PCB', level: 'mittel', detail: 'Weichmacherhaltige dauerelastische Fugenmassen in Fassadendehnungsfugen.' });
        risks.push({ stoff: 'KMF', level: 'mittel', detail: 'Krebserzeugende biopersistente Mineralwolle in belüfteten Außenwandkonstruktionen.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'HBCD (Flammschutzmittel)', level: 'hoch', detail: 'HBCD-haltiges expandiertes Polystyrol (EPS) in WDV-Systemen.' });
        risks.push({ stoff: 'KMF', level: 'mittel', detail: 'Minderwertig lösliche Steinwolledämmung in Außenfassaden.' });
      } else {
        risks.push({ stoff: 'HBCD', level: 'mittel', detail: 'EPS-Dämmplatten verbaut vor 2016 unterliegen beim selektiven Rückbau dem strengen POP-Abfallrecht (Müllverbrennungspflicht).' });
        risks.push({ stoff: 'PFAS ("Ewigkeitschemikalien")', level: 'gering', detail: 'Schmutz- und wasserabweisende Steingrundierungen auf hydrophobierten Natursteinfassaden.' });
      }
    }
    
    if (bauteil === 'dach') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: 'Faserzement-Wellplatten (Dacheindeckung) mit fest gebundenem Asbestgehalt.' });
        risks.push({ stoff: 'PAK', level: 'hoch', detail: 'Teer- und pechhaltige klassische Abdichtungsschweißbahnen auf älteren Flachdächern.' });
        risks.push({ stoff: 'KMF', level: 'hoch', detail: 'Alte unschmelzbare Mineralwolle zur Gefälledämmung oder im Hohlraum des Kriechbalkenbereichs.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'KMF', level: 'hoch', detail: 'Biopersistente mineralische Wolle zur Zwischensparrendämmung.' });
        risks.push({ stoff: 'HBCD', level: 'hoch', detail: 'Styroporartige EPS/XPS-Platten zur Dichtungsdämmung auf Dächern.' });
      } else {
        risks.push({ stoff: 'HBCD', level: 'mittel', detail: 'Rückbau von unberührten Flachdachdämmungen mit Verlegung vor 2016 (HBCD-Verdacht im EPS-Kern).' });
        risks.push({ stoff: 'Biologische Gefahrstoffe', level: 'mittel', detail: 'Massive Taubenkot-Ablagerungen auf Dachböden, Schimmelpilzbefall durch feuchte Raumluftkonvektion.' });
      }
    }
    
    if (bauteil === 'fugen') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PCB', level: 'hoch', detail: 'Dauerelastische Dehnfugenmassen (z.B. auf Polysulfidbasis) zwischen vorgefertigten Betonsandwichtafeln des Rohbaus oder im Anschluss von Fensterausschnitten.' });
        risks.push({ stoff: 'Asbest', level: 'mittel', detail: 'Asbesthaltige weicher Kitte und Dichtungsschnüre bei Ofen-/Heizungsfugen.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Chlorparaffine (CPs)', level: 'hoch', detail: 'Kurzkettige Chlorparaffine (SCCPs) als direkter Weichmacher-Nachfolgestoff in hochelastischen Fugen.' });
      } else {
        risks.push({ stoff: 'Chlorparaffine', level: 'mittel', detail: 'Mittelkettige Chlorparaffine (MCCPs) in Fugenmassen.' });
      }
    }
    
    if (bauteil === 'holz') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PCP & Lindan', level: 'hoch', detail: 'Ausgedehnte Pentachlorphenol- und Lindanbelastung in Dachstuhlhölzern, Deckenverkleidungen und Fachwerkkonstruktionen.' });
        risks.push({ stoff: 'PAK', level: 'mittel', detail: 'Carbolineum-Balkenbeschichtungen im bewitterten Außenbereich von Fachwerkbauten.' });
        risks.push({ stoff: 'Quecksilber-Verbindungen', level: 'gering', detail: 'Fungizide Biozidwirkstoffe in biologischen Imprägnierungen schutzwürdiger historischer Bauten.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Schwermetall-Verbindungen', level: 'mittel', detail: 'Chrom-Kupfer-Bor (CKB)-Salzimprägnierungen der Hauptbalkentragwerke.' });
      } else {
        risks.push({ stoff: 'VOC', level: 'mittel', detail: 'Aldehydausgasungen (Formaldehyd) aus mitteldichten Span- und OSB-Faserbauteilen.' });
      }
    }
    
    if (bauteil === 'technik') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PCB', level: 'hoch', detail: 'Leckende PCB-Kondensatoren in Kompensationsanlagen der Leuchtstoffröhrenbeleuchtungen.' });
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: 'Schwach gebundene Brandschutzklappen, Brandschutzplatten, sowie asbesthaltiges Gipsgemisch zur Rohrummantelung.' });
        risks.push({ stoff: 'Schwermetalle (Bleimennige)', level: 'hoch', detail: 'Bleihaltige Trinkwasserleitungen sowie dicke korrosionshemmende Bleimennige-Grundierungen auf allen Stahlträgern.' });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'KMF', level: 'mittel', detail: 'Rohrisolationsschalen auf mineralfaseriger Basis.' });
      } else {
        risks.push({ stoff: 'PFAS', level: 'gering', detail: 'Fluorpolymerbeschichtungen für extreme Hitzebeständigkeit bei Spezialtechnik.' });
      }
    }
    
    return risks;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-shiraz" />
            Schad- und Gefahrstoffe in Baustoffen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Übersicht historischer und aktueller Schadstoffe, deren Vorkommen und Gefahrenpotenzial sowie Richtlinien zur Beprobung.
          </p>
        </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-home-grau/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'stoffe' as const, label: 'Stoffgruppen & Gefahren', icon: AlertTriangle },
              { id: 'finder' as const, label: 'Fibel-Schadstofffinder', icon: Search },
              { id: 'beprobung' as const, label: 'Erkundung & Beprobung', icon: Search },
              { id: 'elution' as const, label: 'Elution aus Baustoffen', icon: Droplets },
              { id: 'gefahrstoffe' as const, icon: Shield, label: 'Gefahrstoffe auf der Baustelle' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button aria-pressed={isActive}
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
        </div>

        <div className="p-6">
          {activeTab === 'stoffe' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p>
                  Aufgrund ihrer gesundheits- und umweltschädlichen Eigenschaften gelten für viele historische Baustoffe strenge Vorgaben bei Sanierung und Rückbau. 
                  Wählen Sie einen Schadstoff, um mehr über Vorkommen, Gefahren und Entsorgung zu erfahren.
                </p>
              </div>

              {/* Schadstoff Selector */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SCHADSTOFFE_DATA.map((stoff) => {
                  const isActive = activeSchadstoff === stoff.id;
                  return (
                    <button aria-pressed={isActive}
                      key={stoff.id}
                      onClick={() => setActiveSchadstoff(stoff.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full ${
                        isActive 
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' 
                          : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {React.cloneElement(stoff.icon as React.ReactElement<any>, {
                        className: isActive ? 'text-shiraz' : 'text-slate-500'
                      })}
                      <span className="text-xs font-bold leading-tight">
                        {stoff.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Schadstoff Details */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-home-grau/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-home-grau/30 text-shiraz">
                      {React.cloneElement(selectedSchadstoff.icon as React.ReactElement<any>, { className: 'text-shiraz' })}
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        {selectedSchadstoff.name}
                      </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            DGUV-geprüfte Schadstoffdatenbank
          </p>
        </div>
                  </div>
                  {selectedSchadstoff.gestisUrl && (
                    <a
                      href={selectedSchadstoff.gestisUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-shiraz hover:bg-shiraz/90 active:scale-95 transition-all rounded-xl shadow-sm border border-shiraz cursor-pointer text-center sm:self-center"
                    >
                      <Globe size={14} />
                      Offizieller GESTIS-Eintrag
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">Vorkommen & Verwendung</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.vorkommen.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">Gefahren & Sanierung</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.gefahren.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">Entsorgung (AVV) &amp; Schutzmaßnahmen (PSA)</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.entsorgung.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>

                  {selectedSchadstoff.id === 'kmf' && (
                    <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-xl md:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                      <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
                        <Activity className="text-blue-700" size={20} />
                        <h5 className="font-bold text-slate-900 text-sm">Interaktiver Kanzerogenitätsindex (KI) Schnellrechner (nach TRGS 521)</h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-1">
                        Geben Sie die im Labor ermittelten Gewichtsanteile der Oxide (in Gew.-%) ein, um die Biolöslichkeit und Krebs-Einstufung für künstliche Mineralfasern wie Glas- oder Steinwolle direkt zu berechnen:
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Na₂O + K₂O (Gew.-%)</label>
                          <input aria-label="Na₂O + K₂O (Gew.-%)" 
                            type="number" 
                            min="0" 
                            max="30" 
                            step="0.1" 
                            value={oxidNaK} 
                            onChange={(e) => setOxidNaK(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">CaO + MgO (Gew.-%)</label>
                          <input aria-label="CaO + MgO (Gew.-%)" 
                            type="number" 
                            min="0" 
                            max="40" 
                            step="0.1" 
                            value={oxidCaMg} 
                            onChange={(e) => setOxidCaMg(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">BaO + B₂O₃ (Gew.-%)</label>
                          <input aria-label="BaO + B₂O₃ (Gew.-%)" 
                            type="number" 
                            min="0" 
                            max="15" 
                            step="0.1" 
                            value={oxidBaB} 
                            onChange={(e) => setOxidBaB(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Al₂O₃ (Gew.-%)</label>
                          <input aria-label="Al₂O₃ (Gew.-%)" 
                            type="number" 
                            min="0" 
                            max="30" 
                            step="0.1" 
                            value={oxidAl} 
                            onChange={(e) => setOxidAl(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs font-mono space-y-1">
                        <div>Gleichung: <span className="font-bold text-blue-800">KI = Σ(Na₂O, K₂O, CaO, MgO, BaO, B₂O₃) - 2 * Al₂O₃</span></div>
                        <div className="text-slate-500">
                          Rechnung: ({formatDeZahl(oxidNaK, 1)} + {formatDeZahl(oxidCaMg, 1)} + {formatDeZahl(oxidBaB, 1)}) - (2 · {formatDeZahl(oxidAl, 1)}) = <span className="font-bold text-indigo-700 text-sm">{formatDeZahl((oxidNaK + oxidCaMg + oxidBaB) - 2 * oxidAl, 2)}</span>
                        </div>
                      </div>

                      {(() => {
                        const kiVal = (oxidNaK + oxidCaMg + oxidBaB) - 2 * oxidAl;
                        if (kiVal >= 40) {
                          return (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-green-800">✔ Unbedenklich / Biologisch abbaubar (KI = {formatDeZahl(kiVal, 2)} ≥ 40)</span>
                              <span>Die Mineralfaser ist hinreichend biolöslich (neuere Mineralwolle ab ca. Baujahr 2000 mit RAL-Gütezeichen). Sie ist laut Gefahrstoffverordnung <strong>nicht</strong> als krebserzeugend eingestuft. Standardmäßige Staubschutzmaske (FFP2) reicht aus.</span>
                            </div>
                          );
                        } else if (kiVal <= 30) {
                          return (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-red-800">🚨 TRGS 521 Pflichtig - Krebserzeugend (KI = {formatDeZahl(kiVal, 2)} ≤ 30)</span>
                              <span>Die Faser gilt als bio-persistent und hochgradig krebserzeugend (typisch für vor etwa 1996 hergestellte Mineralwolle). Arbeiten unterliegen vollumfänglich der <strong>TRGS 521</strong>. Schutzstufe II oder III erforderlich (Atemschutz FFP3, Einweg-Schutzanzug Typ 5/6, staubdichte Abschottung, H-Sauger).</span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-amber-800">⚠️ Verdachtsbereich / Erhöhtes Risiko (30 &lt; KI = {formatDeZahl(kiVal, 2)} &lt; 40)</span>
                              <span>Es besteht begründeter Verdacht auf krebserzeugendes Potenzial (Übergangs-Mineralwolle 1996 - 2000). Im Zweifel und aus Haftungsgründen muss auf Baustellen das Material wie krebserzeugend (TRGS 521) behandelt werden, es sei denn ein amtlicher Kanzerogenitäts-Löslichkeitstest (Tierversuch) weist Unbedenklichkeit nach.</span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finder' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Search className="text-shiraz" /> Interaktiver Fibel-Schadstofffinder (Gebäudecheck)
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
                  Stellen Sie das Erbauungsjahr des Objekts sowie das zu untersuchende Bauteil ein. Die Matrix simuliert basierend auf historischen Datenbanken deutscher Schadstofffibeln die typischen Verdachtsmomente, biologischen und chemischen Gefährdungsstufen, Probenahmetaktiken und die rechtlichen Rahmenbedingungen für die Labor-Analytik.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Auswahlbereich */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">1. Erbauungszeitraum des Gebäudes</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'vor-1970', label: 'Vor 1970', desc: 'Massenhaft Asbest, PAK, PCB' },
                          { id: '1970-1989', label: '1970 - 1989', desc: 'Hochphase Bauchemie, Holzgifte' },
                          { id: '1990-1999', label: '1990 - 1999', desc: 'Übergang & Verbote (1993)' },
                          { id: 'nach-2000', label: 'Ab 2000', desc: 'Moderne, unbedenkl. KMF, VOC' }
                        ].map((z) => (
                          <button aria-pressed={finderZeitraum === z.id}
                            key={z.id}
                            onClick={() => setFinderZeitraum(z.id)}
                            className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                              finderZeitraum === z.id
                                ? 'bg-slate-900 text-white border-home-grau/30 shadow-sm font-semibold'
                                : 'bg-slate-50 border-home-grau/30 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold">{z.label}</div>
                            <div className="text-xs opacity-75">{z.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono font-semibold">2. Betroffenes Bauteil / Materialart</label>
                      <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1 border border-home-grau/30 rounded-xl p-2 bg-slate-50/50">
                        {[
                          { id: 'decken-waende', label: 'Wände & Decken', detail: 'Spachtelmassen, Fliesenkleber, Innenputz, Trockenbau' },
                          { id: 'bodenbelag', label: 'Böden & Kleber', detail: 'Parkettkleber, Asbestplatten, Ausgleichsmassen, PVC' },
                          { id: 'fassade', label: 'Außenfassade', detail: 'Asbestfaserplatten, WDVS (EPS/XPS), Risse' },
                          { id: 'dach', label: 'Dachkonstruktion', detail: 'Wellfaserplatten, Teerabdichtungen, Mineralwolle' },
                          { id: 'fugen', label: 'Dauerelastische Fugen', detail: 'Betonwerksanschlüsse, Kitte, Dehnfugen links' },
                          { id: 'holz', label: 'Holzbauteile', detail: 'Dachstühle, Fachwerkbalken, Deckenpaneele' },
                          { id: 'technik', label: 'Haustechnik & Metalle', detail: 'Leitungen, Rohrschalen, Leuchtenkompensatoren, Mennige' }
                        ].map((b) => (
                          <button aria-pressed={finderBauteil === b.id}
                            key={b.id}
                            onClick={() => setFinderBauteil(b.id)}
                            className={`p-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                              finderBauteil === b.id
                                ? 'bg-shiraz text-white border-shiraz font-bold'
                                : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold">{b.label}</div>
                              <div className="text-xs opacity-75 font-normal">{b.detail}</div>
                            </div>
                            {finderBauteil === b.id && <span className="text-xs font-bold">✔</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ergebnisbereich */}
                  <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-4 border-b border-home-grau/30 pb-2 flex justify-between items-center">
                        <span className="font-extrabold uppercase">Analyseergebnis</span>
                        <span className="text-xs text-slate-500 font-bold px-2 py-0.5 bg-slate-200 rounded">Gefahrenprognose</span>
                      </h4>

                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {checkRisks(finderZeitraum, finderBauteil).map((risk, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-slate-900">{risk.stoff}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase tracking-wider ${
                                risk.level === 'hoch'
                                  ? 'bg-red-50 text-red-800 border border-red-200'
                                  : risk.level === 'mittel'
                                  ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                  : 'bg-green-50 text-green-800 border border-green-200'
                              }`}>
                                {risk.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {risk.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs text-slate-500 leading-relaxed font-semibold">
                      <strong>WICHTIGER HINWEIS:</strong> Diese Risikoanalyse liefert eine wissenschaftlich fundierte Verdachtsprognose basierend auf Bestandsstatistiken deutscher Ingenieurleistungen. Sie ersetzt vor Sanierungsbeginn auf keinen Fall eine qualifizierte physische Schadstofferkundung im Rahmen der VDI 6202 Blatt 1 sowie akkreditierte Laboranalysen (z.B. REM/EDX für Asbestfasern, GC-MS für PAK-Kleber).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'beprobung' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Richtlinien zur Beprobung */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-shiraz" />
                  Erkundung &amp; Beprobung: Wer, Wie, Was und Warum?
                </h3>
                <p className="text-sm text-slate-700 mb-6">
                  Die Erkundung und Probenahme von Schadstoffen im Bestand unterliegt extrem strengen gesetzlichen und normativen Vorgaben. 
                  Nicht jeder darf einfach "ein Stück abbrechen" und ins Labor schicken. Eine unsachgemäße Beprobung führt nicht nur zu unbrauchbaren Laborergebnissen, 
                  sondern stellt auch eine massive Gesundheits- und Umweltgefahr (sowie eine Straftat) dar.
                </p>
                
                <div className="bg-shiraz/5 border border-shiraz/30 p-4 rounded-xl mb-6">
                  <p className="text-shiraz font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    Hinweis: Im Zweifel (also fast immer) ist stets eine sachverständige Person hinzuzuziehen!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* LAGA PN 98 */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Droplets size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">LAGA PN 98 (Abfallbeprobung)</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>Was:</strong> Feste und stichfeste Abfälle (z. B. aufgeschütteter Bauschutt, Erdaushub, Haufwerke).</li>
                      <li><strong>Warum:</strong> Um die exakte Abfallklasse (z.B. Z0 bis Z2 nach LAGA, oder Nachweisverordnung) für die Depionierung oder Verwertung (Recycling) rechtlich belastbar zu bestimmen. Das Laborergebnis entscheidet über gigantische Entsorgungskosten.</li>
                      <li><strong>Wer darf beproben:</strong> Ausschliesslich qualifizierte Personen mit einem <strong>Sachkundenachweis nach LAGA PN 98</strong>. Der Bauherr oder ungeschulte Poliere dürfen <em>keine</em> rechtsgültigen Proben abfüllen.</li>
                      <li><strong>Wie:</strong> Fest definiertes Raster. Repräsentative Beprobung durch "Kreuzschlag" und Erstellung von Mischproben aus exakt vorgeschriebenen Schichttiefen/Haufwerksbereichen. Es muss ein striktes Probenahmeprotokoll inkl. Fotodokumentation geführt werden.</li>
                    </ul>
                  </div>

                  {/* TRGS 519 */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Wind size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">TRGS 519 (Asbest)</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>Was:</strong> Verdächtige asbesthaltige Materialien (Spritzasbest, Floor-Flex-Platten, Kleber, Putze, Fassadenplatten).</li>
                      <li><strong>Warum:</strong> Asbestfasern sind hochgradig karzinogen. Die TRGS 519 regelt den strengen Schutz von Arbeitern, Nutzern und Umwelt bei Abbruch-, Sanierungs- oder Instandhaltungsarbeiten (ASI-Arbeiten).</li>
                      <li><strong>Wer darf beproben:</strong> Nur Gutachter/Spezialisten mit <strong>Sachkunde nach TRGS 519 bzw. Fachkunde für die Erkundung nach VDI 6202 Blatt 3:2021-09</strong>. Labore dürfen nur Proben analysieren, die gefahrlos und normgerecht luftdicht verpackt wurden.</li>
                      <li><strong>Wie:</strong> Staubdicht verpackt! Die Probe (z. B. Bohrkern oder Materialstück) muss i. d. R. feucht entnommen (Staubbindung) und doppelt in reißfeste Säcke oder Proberöhrchen verpackt werden, ggf. unter Schleusen/Zelt-Einsatz. Die Raumluft darf keinesfalls belastet werden.</li>
                    </ul>
                  </div>

                  {/* TRGS 524 / DGUV */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><AlertTriangle size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">DGUV Regel 101-004 / TRGS 524</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>Was:</strong> Arbeiten in kontaminierten Bereichen (z. B. PAK, PCB, Schwermetalle, Altlasten).</li>
                      <li><strong>Warum:</strong> Gefährdungsbeurteilung und Arbeitsschutz-Maßnahmen vor und während des Abbruchs oder der Altlastensanierung.</li>
                      <li><strong>Wer:</strong> Ein <strong>Koordinator gem. DGUV Regel 101-004</strong> (ehemals BGR 128) muss bestellt werden.</li>
                      <li><strong>Wie:</strong> Die Beprobung am Bauteil muss durch Gutachter erfolgen (z. B. Bohrkerne in Wänden/Böden). Auf Basis der Beprobung wird ein "Sicherheits- und Gesundheitsschutzplan (SiGePlan)" bzw. Arbeits- und Sicherheitsplan (A+S-Plan) aufgestellt (Schwarz-Weiß-Trennung, Atemschutzmasken, Spezialfilteranlagen).</li>
                    </ul>
                  </div>

                  {/* VDI 6202 / Schadstoffkataster */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Bug size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">VDI 6202 Blatt 1 &amp; Blatt 3 (Erkundung)</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>Blatt 1 (Allgemeines Verfahren):</strong> Ganzheitliche systematische Schadstofferkundung im Gebäudebestand VOR (!) Umbau- oder Abbrucharbeiten. Der Bauherr ist gesetzlich verpflichtet, das Gebäude auf alle Schadstoffe zu prüfen (Kreislaufwirtschaftsgesetz u. a.).</li>
                      <li><strong>Mischproben / PSF nach VDI 6202 Blatt 3:</strong> Regelt die Beprobung von <strong>Putz, Spachtelmassen und Fliesenklebern (PSF)</strong> auf verborgene Asbestvorkommen. Da diese Baustoffe oft geringe Mengen (0,001 % bis &lt; 1 %) Asbest enthalten, sind sie visuell unsichtbar, stellen aber beim Schleifen/Abschlagen eine enorme Gefahr dar.</li>
                      <li><strong>Wann:</strong> Die Beprobung nach Blatt 3 erfolgt als Mischprobenahme von repräsentativen Wandbereichen (homogene Bereiche) zwingend im Zuge der Planung (LP 1–3), keinesfalls erst nach Baubeginn.</li>
                      <li><strong>Vermeidung von Baustopps:</strong> Unentdeckter Asbest in Fliesenklebern oder Wandspachtelungen gehört zu den häufigsten Ursachen ungeplanter Baustopps und regresspflichtiger Zusatzkosten bei Gebäudesanierungen.</li>
                    </ul>
                  </div>

                  {/* Gefahrstoffverordnung (GefStoffV) */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Shield size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">Gefahrstoffverordnung (GefStoffV)</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>Was:</strong> Die nationale Umsetzung des europäischen Chemikalienrechts, die den Schutz von Beschäftigten und Umwelt vor Gefährdungen durch Gefahrstoffe regelt.</li>
                      <li><strong>Anforderungen (aktueller Stand):</strong> Die Novelle (in Kraft seit 5. Dezember 2024) regelt in § 5a die Mitwirkungs- und Informationspflichten des Veranlassers: Er gibt dem ausführenden Unternehmen vor Beginn alle ihm vorliegenden Informationen zu Bau- und Nutzungsgeschichte und vermuteten Gefahrstoffen; Tätigkeiten mit Asbest regelt § 11a mit Anhang I Nr. 2.</li>
                      <li><strong>Erkundung:</strong> Eine generelle Erkundungspflicht des Bauherrn sieht die GefStoffV nicht vor (der Asbest-Generalverdacht aus dem Entwurf 2022 entfiel). Die Ermittlung erfolgt im Rahmen der Gefährdungsbeurteilung des Arbeitgebers (§ 6); bei Abbruch und größeren Sanierungen ist ein Schadstoffkataster nach VDI 6202 dennoch fachlich geboten und bei öffentlichen Auftraggebern üblich.</li>
                      <li><strong>Warum:</strong> Nur durch diese Vorab-Erkundung können die ausführenden Unternehmen (Auftragnehmer) eine angemessene Gefährdungsbeurteilung erstellen und die richtigen Arbeitsschutzmaßnahmen (PSA, technischer Schutz) einplanen und kalkulieren.</li>
                    </ul>
                  </div>

                  {/* GISCODE & REACH */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Shield size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2">GISCODE &amp; REACH</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><strong>REACH-Verordnung:</strong> (EG) Nr. 1907/2006 regelt die Registrierung, Bewertung, Zulassung und Beschränkung chemischer Stoffe. Wichtig bei Bauprodukten: Ein <strong>Sicherheitsdatenblatt (SDB)</strong> muss für alle gefahrstoffhaltigen Baustoffe (z.B. PU-Schäume, Epoxidharze) auf der Baustelle vorliegen.</li>
                      <li><strong>GISCODE:</strong> Ein alphanumerisches Klassifizierungssystem der BG BAU (Gefahrstoff-Informationssystem). Es fasst Bauprodukte mit ähnlicher Gesundheitsgefährdung (z.B. <em>RU 1</em> für lösemittelfreie Polyurethan-Verlege-Werkstoffe oder <em>RE 30</em> für Epoxidharze) in Produktgruppen zusammen.</li>
                      <li><strong>Warum:</strong> Erleichtert die Erstellung der gesetzlich vorgeschriebenen Betriebsanweisungen und die Auswahl der richtigen Persönlichen Schutzausrüstung (PSA). Vor dem Rückbau hilft der GISCODE historischer Produktkataloge bei der Gefährdungsbeurteilung.</li>
                    </ul>
                  </div>

                </div>
              </section>
            </div>
          )}

          {activeTab === 'elution' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                      <Droplets size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Ersatzbaustoffverordnung (EBV) &amp; Elution</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Bundesweit einheitliche Regelung zum Schutz von Boden und Grundwasser beim Einsatz mineralischer Ersatzbausteine (MEB)
          </p>
        </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    Die <strong>Ersatzbaustoffverordnung (EBV)</strong> ist am 1. August 2023 in Kraft getreten (als Teil der Mantelverordnung). Sie löst die länderspezifischen LAGA-Regelungen ab. Das Hauptziel ist die Förderung der Kreislaufwirtschaft durch die Bereitstellung bundesweit einheitlicher Kriterien zur rechtlich belastbaren Verwertung von <strong>mineralischen Ersatzbaustoffen (MEB)</strong> unter striktem Ausschluss schädlicher Auswaschungen ins Grundwasser.
                  </p>
                  
                  {/* Highlight-Panel: EBV vs. BBodSchV */}
                  <div className="bg-amber-50/70 border border-amber-200/60 p-4 rounded-xl text-xs space-y-2 text-amber-950 mb-2">
                    <span className="font-extrabold uppercase tracking-wider block text-xs text-amber-800">⚠️ Wichtige rechtliche Abgrenzung (Mantelverordnung):</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong className="text-amber-900 block font-bold mb-0.5">1. Ersatzbaustoffverordnung (EBV):</strong>
                        Gilt ausschließlich für den Einbau mineralischer Baustoffe in <strong>technische Bauwerke</strong> (z. B. Straßenbau, Rohrgruben, Fundamentunterfüllungen). Regelt Einbauklassen (wie RC-1, RC-2, BM-0, BM-1, etc.) und bautechnische Verwertung.
                      </div>
                      <div>
                        <strong className="text-amber-900 block font-bold mb-0.5">2. Bundes-Bodenschutz- und Altlastenverordnung (BBodSchV):</strong>
                        Gilt für das Auf- und Einbringen von Materialien <strong>außerhalb technischer Bauwerke</strong> (z. B. zur Rekultivierung, Bodenverbesserung, Grubenverfüllung oder Landschaftsbau). Hier gelten bodenspezifische Vorsorgewerte und Eluatgrenzwerte zum Schutz des natürlichen Bodens.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytical Methods Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                    <h4 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider text-slate-500">Relevante Elutionsverfahren</h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Die Bestimmung der Schadstofffreisetzung erfolgt nicht mehr nur statistisch am Feststoff, sondern primär im <strong>Eluat</strong> (wässrige Lösung):
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                        <strong className="text-slate-900">Auslaugung im Säulenversuch (DIN 19528):</strong>
                        <p className="mt-0.5 leading-relaxed">Das rechtliche Referenzverfahren. Wasser durchströmt kontinuierlich eine mit Material bepackte Säule. Simuliert die langfristige Sickerwasser-Auswaschung lebensecht.</p>
                      </li>
                      <li className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                        <strong className="text-slate-900">Schüttelversuch (DIN 19529):</strong>
                        <p className="mt-0.5 leading-relaxed">Schnellverfahren für die Güteüberwachung im Werk. Das Material wird im Verhältnis 1:10 mit Wasser für 24 Stunden geschüttelt.</p>
                      </li>
                    </ul>
                  </div>

                  {/* Interactive MEB Selector and Limits */}
                  <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-3">Interaktiver MEB-Güteklasse-Katalog</h4>
                      <p className="text-xs text-slate-500 mb-4">Wählen Sie einen repräsentativen Baustoff aus, um die Grenzwerte und Einbauklassen der EBV zu visualisieren.</p>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <button aria-pressed={selectedMEB === 'rc_baustoff'} 
                          onClick={() => setSelectedMEB('rc_baustoff')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'rc_baustoff' ? 'bg-slate-900 text-white border-home-grau/30' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          RC-Bauschutt
                        </button>
                        <button aria-pressed={selectedMEB === 'bodenaushub'} 
                          onClick={() => setSelectedMEB('bodenaushub')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'bodenaushub' ? 'bg-slate-900 text-white border-home-grau/30' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          Bodenaushub
                        </button>
                        <button aria-pressed={selectedMEB === 'hm_asche'} 
                          onClick={() => setSelectedMEB('hm_asche')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'hm_asche' ? 'bg-slate-900 text-white border-home-grau/30' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          Hausmüll-Asche
                        </button>
                      </div>

                      {/* Specification results card */}
                      <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl text-xs space-y-2">
                        {selectedMEB === 'rc_baustoff' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span>Recycling-Klasse: RC-1 &amp; RC-2</span>
                              <span className="text-shiraz">Bauschutt aufbereitet</span>
                            </div>
                            <div><strong>Leitparameter im Eluat:</strong> Sulfat (RC-1: ≤ 150 mg/l, RC-2: ≤ 250 mg/l), Kupfer (≤ 100 µg/l), Leitfähigkeit (RC-1: ≤ 1500 µS/cm).</div>
                            <div className="text-xs text-slate-600 bg-teal-50 border border-teal-200 p-2 rounded mt-1">
                              <strong>Erlaubte Einbaulagen:</strong> Unter wasserundurchlässigen Deckschichten (Asphalt, Beton) im Straßenbau uneingeschränkt einsetzbar. Im unversiegelten Offen-Einbau verboten.
                            </div>
                          </>
                        )}
                        {selectedMEB === 'bodenaushub' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span>Bodenklasse: BM-0, BM-1 &amp; BM-2</span>
                              <span className="text-teal-600">Reiner Erdaushub</span>
                            </div>
                            <div><strong>Leitparameter im Eluat:</strong> Arsen (≤ 10 µg/l), Blei (≤ 7 µg/l), Cadmium (≤ 0,2 µg/l), Chlorid (≤ 50 mg/l).</div>
                            <div className="text-xs text-slate-600 bg-teal-50 border border-teal-200 p-2 rounded mt-1">
                              <strong>Erlaubte Einbaulagen:</strong> BM-0 unbeschränkt für Böden und Rekultivierungen. BM-1/2 erfordern technische Sicherungsmaßnahmen und Verfülltiefen-Begrenzungen.
                            </div>
                          </>
                        )}
                        {selectedMEB === 'hm_asche' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span>Ascheklasse: HMVA-1 &amp; HMVA-2</span>
                              <span className="text-purple-600">Hausmüllverbrennungsasche</span>
                            </div>
                            <div><strong>Leitparameter im Eluat:</strong> Sulfat (≤ 2000 mg/l), Chlorid (≤ 1500 mg/l), Blei (≤ 40 µg/l). Extrem hohe Mineral-Salzfracht!</div>
                            <div className="text-xs text-slate-600 bg-red-50 border border-red-200 p-2 rounded mt-1 text-red-900 font-medium">
                              <strong>Erlaubte Einbaulagen:</strong> Streng reglementiert! Nur in asphaltierten Tragschichten hoher Dichte unterhalb hydrogeologischer Sperren. Melde- und Katasterpflichtig ab 250 m³.
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500 italic">
                      Hinweis: Sämtliche Einbauten von mineralischen Ersatzbaustoffen müssen im Rahmen der Vorpfändungsregel im werkseigenen Ersatzbaustoffregister erfasst und behördlich deklariert werden!
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'gefahrstoffe' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-6">
                
                {/* Gefahrstoffverordnung (GefStoffV) - Das Neue Gesetz */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                      <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Aktuelle Gefahrstoffverordnung (GefStoffV)</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Informationspflichten des Veranlassers (§ 5a), Tätigkeiten mit Asbest (§ 11a) und das risikobasierte Maßnahmenkonzept
          </p>
        </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-slate-700">
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 text-base">GefStoffV-Novelle 2024 (Pflichten des Veranlassers, § 5a)</h4>
                      <p>
                        Mit der Novellierung der <strong>Gefahrstoffverordnung (GefStoffV)</strong> (in Kraft seit 5. Dezember 2024) werden die Mitwirkungs- und Informationspflichten des Veranlassers (Bauherrn) bei Tätigkeiten an baulichen oder technischen Anlagen geregelt.
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                        <li><strong>Information:</strong> Der Veranlasser übergibt alle ihm vorliegenden Informationen zur Bau- und Nutzungsgeschichte und zu vorhandenen oder vermuteten Gefahrstoffen (z. B. Putze, Spachtelmassen, Fliesenkleber) und sichtet zumutbar verfügbare Unterlagen.</li>
                        <li><strong>Baujahr:</strong> Bei Baujahr vor 1993 oder nach 1996 genügt die Angabe des Baujahrs; bei Errichtung zwischen 1993 und 1996 ist der Baubeginn mitzuteilen (§ 5a Abs. 2). Die Pflichten gelten auch für Privathaushalte.</li>
                        <li><strong>Schutzmaßnahmen:</strong> Das ausführende Unternehmen ermittelt im Rahmen der Gefährdungsbeurteilung, ob Asbestfasern freigesetzt werden können, und ordnet die Tätigkeit dem niedrigen, mittleren oder hohen Risiko zu (§ 11a; TRGS 519, Fassung 2014 mit Änderung vom 28.01.2025).</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">Interaktiver Asbest-Baujahr-Check</h4>
                        <p className="text-xs text-slate-600 mb-3">Verschieben Sie den Regler auf das Baujahr Ihres Altbauprojekts, um die Informationspflichten nach § 5a GefStoffV und den Asbestverdacht einzuschätzen.</p>
                        
                        <div className="space-y-2">
                          <input 
                            type="range" 
                            min="1950" 
                            max="2020" 
                            value={asbestBaujahr}
                            onChange={(e) => setAsbestBaujahr(Number(e.target.value))}
                            className="w-full accent-shiraz"
                          />
                          <div className="flex justify-between text-xs font-mono text-slate-500">
                            <span>1950</span>
                            <span className="font-bold text-slate-900 bg-slate-200 px-2 rounded">{asbestBaujahr}</span>
                            <span>2020</span>
                          </div>
                        </div>

                        {asbestBaujahr < 1993 ? (
                          <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-900 border border-red-200 text-xs font-semibold leading-relaxed animate-pulse">
                            🚨 ASBESTVERDACHT! Baujahr vor dem Verbot (31.10.1993). Der Veranlasser teilt das Baujahr und alle vorliegenden Informationen mit (§ 5a GefStoffV); das ausführende Unternehmen muss in der Gefährdungsbeurteilung von möglichem Asbest ausgehen oder durch Erkundung (VDI 6202 Blatt 3) ausschließen.
                          </div>
                        ) : asbestBaujahr <= 1996 ? (
                          <div className="mt-3 p-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold leading-relaxed">
                            ⚠️ ÜBERGANGSZEIT 1993–1996: Der Veranlasser muss den Baubeginn mitteilen (§ 5a Abs. 2 GefStoffV), da vor dem Verbot beschaffte asbesthaltige Produkte noch verbaut worden sein können.
                          </div>
                        ) : (
                          <div className="mt-3 p-3 rounded-lg bg-green-50 text-green-900 border border-green-200 text-xs font-semibold leading-relaxed">
                            ✅ BAUJAHR NACH 1996: Die Angabe des Baujahrs genügt (§ 5a Abs. 2 GefStoffV). Asbest ist nicht zu erwarten; andere Gefahrstoffe (z. B. KMF vor 2000, PAK, Holzschutzmittel) bleiben zu prüfen.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expositions-Risiko-Stufenmodell */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-shiraz" />
                    Expositions-Risiko-Stufenmodell für krebserzeugende Stoffe
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Die Intensität des Arbeitsschutzes bei Asbest und anderen Feinstäuben richtet sich nach der zu erwartenden Faserkonzentration in der Atemluft (F/m³); die Grenzen des risikobasierten Konzepts sind die Akzeptanzkonzentration 10.000 F/m³ und die Toleranzkonzentration 100.000 F/m³ (TRGS 910, TRGS 519). Klicken Sie eine Konzentration an:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <button 
                      onClick={() => setSelectedRiskLevel(10000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 10000 ? 'border-green-500 bg-green-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-green-700 uppercase">1. Niedriges Risiko</div>
                      <div className="text-lg font-black text-slate-900 mt-1">&lt; 10.000 F/m³</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Fasern pro Kubikmeter Atemluft</div>
                    </button>

                    <button 
                      onClick={() => setSelectedRiskLevel(50000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 50000 ? 'border-orange-500 bg-orange-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-orange-700 uppercase">2. Mittleres Risiko</div>
                      <div className="text-lg font-black text-slate-900 mt-1">10.000–100.000 F/m³</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">zwischen Akzeptanz- und Toleranzkonzentration</div>
                    </button>

                    <button 
                      onClick={() => setSelectedRiskLevel(100000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 100000 ? 'border-red-500 bg-red-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-red-700 uppercase">3. Hohes Risiko</div>
                      <div className="text-lg font-black text-slate-900 mt-1">&gt; 100.000 F/m³</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">oberhalb der Toleranzkonzentration</div>
                    </button>
                  </div>

                  {/* Danger parameters resolution */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-xs sm:text-sm">
                    {selectedRiskLevel === 10000 && (
                      <div className="space-y-1.5">
                        <strong className="text-green-700 block">Akzeptabler Schutzbereich (Geringe Gefährdung):</strong>
                        <p className="text-slate-700 leading-normal">Unterhalb der Akzeptanzkonzentration ist das Restrisiko niedrig – eine Wirkschwelle gibt es bei krebserzeugenden Fasern nicht. Typisch sind emissionsarme Verfahren (BT-Verfahren) mit Absaugung; Schutzmaßnahmen nach TRGS 519 (z. B. FFP3 nach Verfahrensbeschreibung) bleiben erforderlich.</p>
                        <p className="text-xs text-slate-500 italic mt-1">Einsatzgebiete: Bohrverfahren mit zugelassener Filtertechnik (BT-Verfahren), Arbeiten im Freien.</p>
                      </div>
                    )}
                    {selectedRiskLevel === 50000 && (
                      <div className="space-y-1.5">
                        <strong className="text-orange-700 block">Erhöhte Gefährdungsstufe (ASI-Maßnahmen zwingend):</strong>
                        <p className="text-slate-700 leading-normal">Der S-T-O-P Arbeitsschutz greift voll. Die Gefährdungsbeurteilung muss tagesaktuell angepasst werden. Einsatz staubmindernder Absauganlagen Staubklasse H ist Pflicht. Anzeige der Tätigkeit mindestens eine Woche vor Beginn bei der zuständigen Behörde (§ 11a GefStoffV); Abbrucharbeiten bedürfen einer Genehmigung.</p>
                        <p className="text-xs text-orange-950 bg-orange-50 p-1.5 border border-orange-200 rounded mt-1 font-semibold">Schutzmaßnahmen: Gebläseunterstützte Filtergeräte TM3/FFP3, partikeldichte Schutzanzüge Typ 5, Absperrung des Arbeitsbereichs.</p>
                      </div>
                    )}
                    {selectedRiskLevel === 100000 && (
                      <div className="space-y-1.5">
                        <strong className="text-red-700 block">Hohes Risiko (oberhalb der Toleranzkonzentration):</strong>
                        <p className="text-slate-700 leading-normal">Nur durch Unternehmen mit behördlicher Zulassung (§ 11a GefStoffV, max. sechs Jahre). Vollständige Abschottung (Schwarz-Weiß-Bereich) mit Mehrkammer-Personenschleuse und Unterdruckerzeuger mit HEPA-Filteranlage. Strikte medizinische Vorsorge für Arbeiter.</p>
                        <p className="text-xs text-red-950 bg-red-50 p-1.5 border border-red-200 rounded mt-1 font-semibold">Schutzmaßnahmen: Umluftunabhängiger Atemschutz (Druckluftschlauchgeräte) oder fremdbelüftete Schutzhauben zwingend vorgeschrieben.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* S-T-O-P Principle */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl shadow-sm">
                   <h4 className="font-bold text-base mb-3 text-slate-900 border-b border-home-grau/30 pb-2">Das S-T-O-P Prinzip im Arbeitsschutz</h4>
                   <p className="text-sm text-slate-700 mb-3">In dieser gesetzlich festgelegten Reihenfolge (Priorität 1-4) müssen Schutzmaßnahmen getroffen werden:</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1">1. Substitution</strong>
                       Gefahrstoff durch harmloseren Stoff ersetzen (z.B. wasserbasierter Lack statt PU-Lösemittellack).
                     </div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1">2. Technisch</strong>
                       Maschinen mit direkter Absaugung (Staub-Klasse M/H), Einhausung, starke Lüftungsanlagen.
                     </div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1">3. Organisatorisch</strong>
                       Gefahrenbereiche absperren, Beschränkung der Expositionszeit, Unterweisung der Arbeiter.
                     </div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1">4. Persönlich</strong>
                       Als <em>letzte</em> Instanz (!): Persönliche Schutzausrüstung (PSA) wie Atemschutz, Nitrilhandschuhe, Brille.
                     </div>
                   </div>
                </div>

              </section>
            </div>
          )}
        </div>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Kanzerogenitätsindex einer Glaswolle aus einem Dach von 1985"
        zielGleichung="KI = \sum (\mathrm{Na_2O}, \mathrm{K_2O}, \mathrm{CaO}, \mathrm{MgO}, \mathrm{BaO}, \mathrm{B_2O_3}) - 2 \cdot \mathrm{Al_2O_3}"
        schritte={[
          { titel: 'Analyse (M.-%)', erklaerung: 'Röntgenfluoreszenzanalyse: Na₂O 15,5; K₂O 0,8; CaO 7,5; MgO 3,0; BaO 0; B₂O₃ 5,0; Al₂O₃ 2,0.', formel: '\\sum = 15{,}5 + 0{,}8 + 7{,}5 + 3{,}0 + 0 + 5{,}0 = 31{,}8' },
          { titel: 'Index', erklaerung: 'Abzug des doppelten Aluminiumoxidgehalts:', formel: 'KI = 31{,}8 - 2 \\cdot 2{,}0 = 27{,}8' },
          { titel: 'Einstufung', erklaerung: 'KI ≤ 30: als krebserzeugend Kategorie 1B einzustufen.', formel: '27{,}8 \\le 30 \\Rightarrow \\text{alte Mineralwolle, TRGS 521}' }
        ]}
        ergebnisHinweis="Für 30 < KI < 40 gilt Kategorie 2 (Verdacht), ab KI ≥ 40 keine Einstufung. Ohne Analyse sind vor dem 1. Juni 2000 eingebaute Mineralwollen wie alte Mineralwolle zu behandeln."
        normQuelle="GefStoffV Anhang II Nr. 5; TRGS 905; TRGS 521"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Schichtmittelwert und Bewertungsindex für A-Staub beim Stemmen"
        zielGleichung="I = \frac{\sum c_i \cdot t_i}{\text{AGW} \cdot 8\,\text{h}}"
        schritte={[
          { titel: 'Messung', erklaerung: 'Stemmarbeiten 3 h bei 4,0 mg/m³ A-Staub, übrige 5 h bei 0,5 mg/m³:', formel: '\\sum c_i t_i = 4{,}0 \\cdot 3 + 0{,}5 \\cdot 5 = 14{,}5\\,\\text{mg h/m}^3' },
          { titel: 'Schichtmittelwert', erklaerung: 'Bezug auf 8 Stunden:', formel: '\\bar{c} = \\frac{14{,}5}{8} = 1{,}81\\,\\text{mg/m}^3' },
          { titel: 'Bewertung', erklaerung: 'Allgemeiner Staubgrenzwert A-Fraktion 1,25 mg/m³:', formel: 'I = \\frac{1{,}81}{1{,}25} = 1{,}45 > 1 \\Rightarrow \\text{Maßnahmen erforderlich}' }
        ]}
        ergebnisHinweis="Technische Maßnahmen gehen vor (STOP): Absaugung an der Maschine mit Entstauber Staubklasse H, Befeuchtung, dann Atemschutz. Für Asbest gilt statt des AGW das risikobasierte Maßnahmenkonzept (Akzeptanz- und Toleranzkonzentration)."
        normQuelle="TRGS 402; TRGS 900; TRGS 910"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schadstoffe" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 9 Rückbau & Schadstoffe: GefStoffV 2024 §§ 5a/11a, TRGS 519/521/524-Fassungen, KMF-Einstufung geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Schadstoff', url: 'https://de.wikipedia.org/wiki/Schadstoff' },
          { title: 'Asbest', url: 'https://de.wikipedia.org/wiki/Asbest' },
          { title: 'Polychlorierte Biphenyle', url: 'https://de.wikipedia.org/wiki/Polychlorierte_Biphenyle' },
          { title: 'Polyzyklische aromatische Kohlenwasserstoffe', url: 'https://de.wikipedia.org/wiki/Polyzyklische_aromatische_Kohlenwasserstoffe' }
        ]}
        literatur={[
          'Zwiener, G.; Lange, F.-M. (Hrsg.): Handbuch Gebäude-Schadstoffe und gesunde Innenraumluft. Berlin: Erich Schmidt 2012; Bossemeyer, H.-D.: Gebäudeschadstoffe im Bild – Asbest, KMF, PCB, PAK und weitere Schadstoffe in Gebäuden erkennen. Köln: Rudolf Müller 2020',
          
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Gefahrstoffverordnung (GefStoffV)', url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/' },
          { title: 'TRGS 519 (Asbest: Abbruch-, Sanierungs- oder Instandhaltungsarbeiten), Fassung 2014, zuletzt geändert 28.01.2025', url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-519' },
          { title: 'TRGS 521 (Tätigkeiten mit alter Mineralwolle), Ausgabe März 2026, GMBl 2026 S. 300; ersetzt Ausgabe Februar 2008', url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-521' },
          { title: 'VDI 6202 Blatt 3:2021-09 (Asbest – Erkundung und Bewertung)' },
          { title: 'PCB-Richtlinie (Richtlinie für die Bewertung und Sanierung PCB-belasteter Baustoffe und Bauteile in Gebäuden, Fassung September 1994; MVV TB 2025/1, lfd. Nr. A 3.2.4 mit Anlage A 3.2/1; Landesumsetzung über die jeweilige VV TB)', url: 'https://www.dibt.de/' }
        ]}
        formeln={[
          {
            formel: 'C_{\\text{Asbest}} < 500\\,\\frac{\\text{Fasern}}{\\text{m}^3}, \\quad C_{95\\%} \\le 1000\\,\\frac{\\text{Fasern}}{\\text{m}^3}',
            erklaerung: 'Asbest-Erfolgskontrolle (Freimessung): Messwert < 500 F/m³, obere Grenze des 95-%-Vertrauensbereichs ≤ 1000 F/m³ nach VDI 3492 und TRGS 519.',
            quelle: 'TRGS 519 / VDI 3492'
          },
          {
            formel: 'I = \\frac{\\sum c_i \\cdot t_i}{\\text{AGW} \\cdot 8\\,\\text{h}} \\le 1{,}0',
            erklaerung: 'Expositionsindex I nach TRGS 402 zur Bewertung der Mischbelastung am Arbeitsplatz bezogen auf die Arbeitsplatzgrenzwerte (AGW).',
            quelle: 'TRGS 402'
          }
        ]}
      />
    </div>
  );
} 