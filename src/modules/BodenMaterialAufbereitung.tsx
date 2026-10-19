import React, { useState } from 'react';
import { Recycle, Sliders, Activity, CheckCircle2, Info, AlertTriangle, AlertCircle, FileText, SlidersHorizontal, BookOpen, Layers, ClipboardCheck, Scale, Printer } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';

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
      rules: 'TRGS 519 / DepV: Ein Recycling von asbesthaltigen Böden oder Bauschuttgemischen ist ausnahmslos ILLEGAL. Es gilt ein striktes Wiederverwendungsverbot für asbesthaltige Materialien in ganz Europa.'
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
        'Rauchgasreinigung und Abgaswäsche zur sicheren Dioxin- und furanfreien Verbrennung.',
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
      rules: 'GefStoffV / TRGS 519: Verstöße gegen das Wiederverwendungsverbot für asbesthaltigen Bauschutt stellen einen Straftatbestand dar. Aufbereitungsanlagen weisen Lkw mit Asbestverdacht strikt ab.'
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
      principles: 'Altablagerungen sind extrem heterogen und enthalten organische Abfälle gepaart mit Bauschutt und Erden. Ein nassmechanisches Trennverfahren separiert den mineralisch-schweren Anteil, während Schwermetalle in den Feinfraktionen verbleiben und dort immobilisiert werden müssen.',
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

export default function BodenMaterialAufbereitung() {
  const [activeTab, setActiveTab] = useState<'vorschriften' | 'simulator' | 'qualitaet' | 'probenahme'>('vorschriften');
  const [treatmentMaterial, setTreatmentMaterial] = useState<'erdaushub_sand' | 'boden_ton' | 'bauschutt_gemisch' | 'altablagerung'>('erdaushub_sand');
  const [treatmentContaminant, setTreatmentContaminant] = useState<'heavy_metals' | 'mkw_pak' | 'asbest_faser' | 'gips_sulfat'>('heavy_metals');

  // LAGA PN 98 & LfU Bayern sampling calculator states
  const [heapVolume, setHeapVolume] = useState<number>(120);
  const [heapDensity, setHeapDensity] = useState<number>(1.6);
  const [dMax, setDMax] = useState<number>(32);
  const [isHeterogeneous, setIsHeterogeneous] = useState<boolean>(false);
  const [hasSachkunde, setHasSachkunde] = useState<boolean>(true);
  const [volatilesSelected, setVolatilesSelected] = useState<boolean>(false);

  // Probenahmeprotokoll fields
  const [pProject, setPProject] = useState<string>('Erweiterung THA Campus - Baufeld B2');
  const [pSampler, setPSampler] = useState<string>('Thomas Wagner (Zertifizierter Probennehmer nach LAGA)');
  const [pDate, setPDate] = useState<string>('2026-06-03');
  const [pLocation, setPLocation] = useState<string>('Augsburg, An der Hochschule 1');
  const [pWeather, setPWeather] = useState<string>('Trocken, leicht bewölkt, ca. 18°C');
  const [pWitness, setPWitness] = useState<string>('Fr. Dr. Meier (Untergeordnete Bodenschutzbehörde / Umweltamt)');
  const [pNotes, setPNotes] = useState<string>('Aushubhaufwerk Nr. 4 (vorsortierter sandiger Erdaushub)');
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Math & Logic based on LAGA PN 98 & LfU standards
  const tonnage = Math.round(heapVolume * heapDensity);

  // Investigation unit constraints (Max 500 m³ or 1000 t per unit in Bavaria/LAGA)
  const maxUnitVol = 500;
  const maxUnitTonnage = 1000;
  const numInvestigationUnits = Math.max(1, Math.ceil(Math.max(heapVolume / maxUnitVol, tonnage / maxUnitTonnage)));

  // LAGA PN 98 Sampling Table per investigation unit
  const calculateRequirements = (vol: number) => {
    let mpCount = 1;
    let epCount = 10;
    
    if (vol <= 30) {
      mpCount = 1;
      epCount = 10;
    } else if (vol <= 100) {
      mpCount = 1;
      epCount = 20;
    } else if (vol <= 250) {
      mpCount = 2;
      epCount = 20; // 10 increments per composite sample
    } else if (vol <= 500) {
      mpCount = 3;
      epCount = 30; // 10 increments per composite sample
    } else if (vol <= 1000) {
      mpCount = 4;
      epCount = 40;
    } else if (vol <= 1500) {
      mpCount = 5;
      epCount = 50;
    } else if (vol <= 2000) {
      mpCount = 6;
      epCount = 60;
    } else {
      const surplus = Math.ceil((vol - 2000) / 500);
      mpCount = 6 + surplus;
      epCount = (6 + surplus) * 10;
    }

    return { mp: mpCount, ep: epCount };
  };

  const samplingReq = calculateRequirements(heapVolume);

  // Minimum single increment specification according to LAGA PN 98 / max grain size (d_max in mm)
  const getIncrementSpecs = (maxGrain: number) => {
    switch (maxGrain) {
      case 2:
        return { vol: 0.1, mass: 0.2, name: 'Feinsand / Schluff (d_max ≤ 2 mm)' };
      case 8:
        return { vol: 0.5, mass: 1.0, name: 'Sande / Kiese (d_max ≤ 8 mm)' };
      case 16:
        return { vol: 1.0, mass: 2.0, name: 'Mittelkies / Grobsand (d_max ≤ 16 mm)' };
      case 32:
        return { vol: 2.0, mass: 4.0, name: 'Grobe Kiese / Splitt (d_max ≤ 32 mm)' };
      case 63:
        return { vol: 5.0, mass: 8.0, name: 'Grobsteinchen / Schroppen (d_max ≤ 63 mm)' };
      case 125:
        return { vol: 10.0, mass: 16.0, name: 'Mittelgroßer Bauschutt (d_max ≤ 125 mm)' };
      default:
        return { vol: 25.0, mass: 40.0, name: 'Grobes Haufwerk / Blockschutt (d_max > 125 mm)' };
    }
  };

  const specs = getIncrementSpecs(dMax);
  // Total volume for a full composite sample (Liters)
  const minMischprobeVolume = Math.round(specs.vol * (samplingReq.ep / samplingReq.mp) * 10) / 10;
  const minMischprobeMass = Math.round(specs.mass * (samplingReq.ep / samplingReq.mp) * 10) / 10;

  // LfU Bayern: Counter samples (Rückstellproben) - min 3 replicates:
  // 1x Analytical Lab Sample, 1x Authority Retained Sample, 1x Counter-Proof Retained Sample
  const numReplicates = 3;
  const totalMinLabSampleMass = Math.max(2, Math.round(specs.mass * 2)); // min. 2 kg per lab sample according to LfU-Infoblatt
  const totalFieldMassRequired = totalMinLabSampleMass * numReplicates;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Recycle className="w-5 h-5 text-shiraz" />
            Boden- &amp; Materialaufbereitung
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p className="leading-relaxed">
              Dieses dedizierte Modul fokussiert sich tiefgehend auf die mechanischen, biologischen und thermischen Aufbereitungsverfahren kontaminierter Böden und mineralischer Baustoffe. Erfahre mehr über den simulatorischen Bau-Stoffkreislauf, Richtlinien und die gesetzliche Qualitätssicherungsschleife.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tabs / Reiter Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 p-2 rounded-2xl border border-home-grau/30 mb-2">
            <button
              onClick={() => setActiveTab('vorschriften')}
              className={`flex items-center gap-2.5 justify-center py-3 px-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-semibold ${
                activeTab === 'vorschriften'
                  ? 'bg-shiraz border-shiraz text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100/50 border-home-grau/25 text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <BookOpen size={16} />
              <span>Vorschriften &amp; Rahmen</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2.5 justify-center py-3 px-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-semibold ${
                activeTab === 'simulator'
                  ? 'bg-shiraz border-shiraz text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100/50 border-home-grau/25 text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <Sliders size={16} />
              <span>Aufbereitungssimulator</span>
            </button>
            <button
              onClick={() => setActiveTab('qualitaet')}
              className={`flex items-center gap-2.5 justify-center py-3 px-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-semibold ${
                activeTab === 'qualitaet'
                  ? 'bg-shiraz border-shiraz text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100/50 border-home-grau/25 text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <Activity size={16} />
              <span>Qualitätssicherung / QS</span>
            </button>
            <button
              onClick={() => setActiveTab('probenahme')}
              className={`flex items-center gap-2.5 justify-center py-3 px-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-semibold ${
                activeTab === 'probenahme'
                  ? 'bg-shiraz border-shiraz text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100/50 border-home-grau/25 text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <ClipboardCheck size={16} />
              <span>LAGA PN 98 &amp; Rechner</span>
            </button>
          </div>

          {activeTab === 'vorschriften' && (
            <div className="animate-in fade-in duration-300">
              {/* 1. Einleitung & Rechtlicher Rahmen */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-750 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main">Vorschriften der Materialaufbereitung</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rechtlicher Rahmen für Böden und mineralische Ersatzbaustoffe</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              Die Aufbereitung kontaminierter Böden und mineralischer Rückbaumaterialien ist die zentrale Säule der Bau-Kreislaufwirtschaft. Deutschland reguliert die Verwertung und Qualitätssicherung über ein engmaschiges Netz gesetzlicher bundeseinheitlicher Vorschriften, das am 1. August 2023 reformiert wurde (Mantelverordnung).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-teal-100 text-teal-800 rounded text-xs font-bold font-mono">EBV</span>
                  <h4 className="font-bold text-sm text-slate-950">Ersatzbaustoffverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">
                  Regelt bundeseinheitlich die <strong>Herstellung, Güteüberwachung und den Einbau</strong> mineralischer Ersatzbaustoffe (MEB) in technischen Bauwerken (Straßen, Dämme, Rohrgruben). Bestimmt Grenzwerte im Eluat und weist Materialklassen (z. B. RC-1, BM-0, BM-F3); zulässige Einbauweisen ergeben sich aus den Einbautabellen der EBV zu. Verpflichtet zur Erfassung im Ersatzbaustoffregister.
                </p>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-amber-100 text-amber-800 rounded text-xs font-bold font-mono">BBodSchV</span>
                  <h4 className="font-bold text-sm text-slate-950">Bundes-Bodenschutzverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">
                  Greift beim Auf- und Einbringen von Materialien <strong>außerhalb technischer Bauwerke</strong> (z. B. Wiederverfüllung von Abgrabungen, Landschaftsbau, landwirtschaftliche Rekultivierung). Setzt strenge Vorsorgerahmenwerte am Feststoff und ordnet boden- und grundwasserspezifische Eluatwerte an.
                </p>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-indigo-100 text-indigo-800 rounded text-xs font-bold font-mono">GewAbfV</span>
                  <h4 className="font-bold text-sm text-slate-950">Gewerbeabfallverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">
                  Verordnet die <strong>strikte stoffliche Getrenntsammlung</strong> an der Baustelle für mineralische Gemische, Ziegel, Beton, Fliesen, Holz, Glas, Metalle und Kunststoffe. Schreibt Vorbehandlungsquoten sowie eine lückenlose abfallrechtliche Dokumentation (z. B. Fotobeweise und Wiegescheine) vor.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'simulator' && (
            <div className="animate-in fade-in duration-300">
              {/* 2. Interaktiver Simulator */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <Sliders size={20} className="text-shiraz" />
              <div>
                <h4 className="font-bold text-lg text-slate-900">Interaktiver Boden- &amp; Materialaufbereitungssimulator</h4>
                <p className="text-xs text-slate-500">Kombiniere Bodenmatrix und Kontaminationsquelle, um das optimale Behandlungsverfahren zu ermitteln</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
              {/* Linkes Kontrollpanel */}
              <div className="lg:col-span-4 space-y-4">
                {/* Substrat-Auswahl */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">1. Das Ausgangs-Substrat (Boden / Material)</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'erdaushub_sand' as const, label: 'Sandiger / kiesiger Boden (Erdaushub)', info: 'Gut waschbares, gekörntes Material' },
                      { id: 'boden_ton' as const, label: 'Bindiger Tonschlamm / Schluff', info: 'Klebrig, feinkörnig, nass schwer trennbar' },
                      { id: 'bauschutt_gemisch' as const, label: 'Mineralischer Bauschutt (Beton, Ziegel)', info: 'Klassische Abbruch-Mischfraktion' },
                      { id: 'altablagerung' as const, label: 'Altablagerungen / Deponiekörper', info: 'Extreme Heterogenität, oft Organikbeimischung' }
                    ].map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setTreatmentMaterial(mat.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          treatmentMaterial === mat.id 
                            ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-705'
                        }`}
                      >
                        <div className="text-xs font-bold leading-normal">{mat.label}</div>
                        <div className="text-xs text-slate-500 leading-normal mt-0.5">{mat.info}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schadstoff-Auswahl */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">2. Die Hauptbelastung (Leitkontaminante)</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'heavy_metals' as const, label: 'Schwermetalle', desc: 'As, Pb, Cd, Cu, Zn' },
                      { id: 'mkw_pak' as const, label: 'MKW & PAK', desc: 'Öle, Teerrückstände' },
                      { id: 'asbest_faser' as const, label: 'Asbest / KMF', desc: 'Gefährliche Fasern' },
                      { id: 'gips_sulfat' as const, label: 'Gips & Sulfat', desc: 'Gefahr v. Gipstreiben' }
                    ].map((cont) => (
                      <button
                        key={cont.id}
                        onClick={() => setTreatmentContaminant(cont.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          treatmentContaminant === cont.id 
                            ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-705'
                        }`}
                      >
                        <div className="text-xs font-bold">{cont.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-normal">{cont.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rechtes Detailpanel mit den Simulationsergebnissen */}
              <div className="lg:col-span-8 bg-slate-50 p-6 rounded-2xl border border-home-grau/30 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/30 mb-4">
                    <div>
                      <span className="text-xs font-extrabold text-teal-850 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded tracking-wide uppercase font-mono">Optimales Behandlungsverfahren</span>
                      <h4 className="text-lg font-black text-slate-900 mt-1">
                        {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].method}
                      </h4>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-white border border-home-grau/30 rounded font-bold font-mono text-slate-700">CO₂: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].co2}</span>
                      <span className="px-2 py-1 bg-white border border-home-grau/30 rounded font-bold font-mono text-slate-700">Kosten: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].cost}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Verfahrensprinzip</span>
                      <p className="text-xs text-slate-750 leading-relaxed mt-1">{TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].principles}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Rechtliche Vorgaben &amp; EBV / BBodSchV</span>
                      <p className="text-xs text-slate-750 leading-relaxed mt-1 font-medium">{TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].rules}</p>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Abreicherungseffizienz: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].efficiency}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">Chronologischer Verfahrensablauf</span>
                    <ol className="space-y-1.5 text-xs text-slate-700">
                      {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 items-start leading-relaxed animate-in fade-in slide-in-from-left-2 duration-200">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-905 text-white text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs text-slate-500 italic">
                  Hinweis zu Asbest/Fasern: Das Zerkleinern und Wiederaufbereiten asbesthaltiger Boden- und Demontagematerialien stellt in Deutschland gem. TRGS 519 eine schwerwiegende Ordnungswidrigkeit bzw. Umweltstraftat dar. Solche Vorkommen müssen strikt separat deponiert werden.
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'qualitaet' && (
            <div className="animate-in fade-in duration-300">
              {/* 3. Qualitätssicherung & Güteüberwachung (QA Pipeline) */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <Activity size={20} className="text-emerald-600" />
              <div>
                <h4 className="font-bold text-lg text-slate-900">Qualitätssicherung &amp; Güteüberwachung (Produktkreislauf)</h4>
                <p className="text-xs text-slate-500">Die gesetzliche Qualitätssicherungsschleife zur Freigabe mineralischer Sekundärbaustoffe</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-normal mb-6">
              Damit mineralische Ersatzbaustoffe (MEB) anstelle von Primärkiestypen rechtlich belastbar verbaut werden können, schreibt die EBV einen vierstufigen Gütekreislauf vor. Hierdurch verliert der recycelte Baustoff rechtlich seine Abfalleigenschaft und wird zum normgerechten Bauprodukt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <div className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono">01</div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 1</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Annahmekontrolle
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prüfung von Herkunfts-Deklaration und Wiegeschein. Sensorische Begutachtung (Sicht, Geruch, Fehlfarben). Unabhängige Probenahme nach LAGA PN 98 für chargenweise Laborfreigabe. Einlagerung einer Rückstellprobe.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <div className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono">02</div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 2</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Werkseigene Kontrolle
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tägliche messtechnische Überwachung des Aufbereitungswerkes. Bestimmung der Sieblinie (Kornzusammensetzung), Feuchtigkeitswerte, Schuttdichte, Störstoffanteile und Durchführung von photometrischen Nitrat/Sulfat-Schnelltests im Eluat.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <div className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono">03</div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 3</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Fremdüberwachung
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unabhängige, unangekündigte Auditierung der Aufbereitungsanlage (meist 2- bis 4-mal jährlich) durch staatlich akkreditierte Prüfanstalten. Eigene Beprobungen, Überprüfung aller Laborprotokolle und Validierung der Analysengeräte.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <div className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono">04</div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 4</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Güteschutz &amp; Register
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zertifizierung durch Gütekonsortien (z. B. <strong>QRB - Qualitätssicherungs-System Recycelte Baustoffe</strong>, <strong>bvse</strong> oder Landesgüteschutzverbände). Erledigt die CE-Kennzeichnung und deklarierte Produktklasse gem. EBV. Registerführung (§ 22 EBV).
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'probenahme' && (
            <div className="animate-in fade-in duration-300">
              {/* 4. Probenahme-Rechner & Protokoll-Generator (LAGA PN 98 / LfU Bayern) */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-2xs">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <ClipboardCheck size={20} className="text-shiraz" />
              <div>
                <h4 className="font-bold text-lg text-slate-900">Probenahme nach LAGA PN 98 &amp; LfU Bayern</h4>
                <p className="text-xs text-slate-500">
                  Berechnung der Probenmengen nach dem bayerischen LfU-Infoblatt <span className="font-mono bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs">lfu_abfall_00266.pdf</span>
                </p>
              </div>
            </div>

            {/* Quick Informational Note */}
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Info size={14} className="text-slate-700" />
                Bayerische Landesreglementierung zur Haufwerksbeprobung
              </div>
              <p>
                In Bayern regelt das Landesamt für Umwelt (LfU) im Einvernehmen mit der Ersatzbaustoffverordnung (EBV) und der BBodSchV die Probenahme von Haufwerken extrem strikt. Die Probenahme ist die <strong>Fehlerquelle Nr. 1</strong> bei der abfallrechtlichen Deklaration. Ein Verstoß gegen das akkreditierte Probenahmeprotokoll führt zum Verlust der rechtlichen Verwertungssicherheit und kann Behörden-Sanktionen nach sich ziehen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-home-grau/20 space-y-5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono mb-4">Input-Parameter</h5>
                
                {/* Slope Volume slider & input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">Haufwerksvolumen (<InlineMath math="V" />):</label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" min="0" 
                        value={heapVolume} 
                        onChange={(e) => setHeapVolume(Math.max(1, parseInt(e.target.value) || 0))}
                        disabled={isFinalized}
                        className="w-16 p-1 text-xs text-right border border-home-grau/40 bg-slate-50 rounded font-bold" 
                      />
                      <span className="text-xs text-slate-500 font-serif">m³</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="3000" 
                    step="5"
                    value={heapVolume} 
                    onChange={(e) => setHeapVolume(parseInt(e.target.value))}
                    disabled={isFinalized}
                    className="w-full accent-shiraz h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>5 m³</span>
                    <span>1000 m³</span>
                    <span>2000 m³</span>
                    <span>3000 m³</span>
                  </div>
                </div>

                {/* Density Selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">Dichte / Schüttgewicht (<InlineMath math="\rho" />):</label>
                    <span className="text-xs font-mono font-bold text-slate-700">{formatDeZahl(heapDensity, 1)} t/m³</span>
                  </div>
                  <select 
                    value={heapDensity} 
                    onChange={(e) => setHeapDensity(parseFloat(e.target.value))}
                    disabled={isFinalized}
                    className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white"
                  >
                    <option value="1.5">1,5 t/m³ (Ziegel / Bauschuttleichtfraktion)</option>
                    <option value="1.6">1,6 t/m³ (Bindiger Tonschlamm / Schluff)</option>
                    <option value="1.8">1,8 t/m³ (Sandiger / kiesiger Boden / Erdaushub)</option>
                    <option value="1.7">1,7 t/m³ (Heterogene Altablagerungen / Deponiematerial)</option>
                    <option value="2.0">2,0 t/m³ (Betonbruch / Schwerer Bauschutt)</option>
                  </select>
                </div>

                {/* Maximum Grain Size d_max */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">Größtkorn des Materials (d_max):</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[2, 8, 16, 32, 63, 125, 126].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setDMax(sz)}
                        disabled={isFinalized}
                        className={`py-1.5 px-1 text-xs font-bold border rounded text-center transition-all cursor-pointer ${
                          dMax === sz 
                            ? 'bg-shiraz text-white border-shiraz' 
                            : 'bg-slate-50 border-home-grau/30 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {sz === 126 ? '> 125 mm' : `≤ ${formatDeWert(sz)} mm`}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 leading-normal italic mt-1 bg-slate-50 p-2 rounded">
                    Ausgewählt: <span className="font-semibold text-slate-800">{specs.name}</span>.<br />
                    Bestimmt das benötigte Mindestvolumen je Einzelprobe.
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2.5 pt-3 border-t border-home-grau/25">
                  
                  {/* Sachkundenachweis Checkbox */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasSachkunde}
                      onChange={(e) => setHasSachkunde(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight">Probennehmer mit Sachkundenachweis</span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5">Besitzt Zertifizierungsnachweis gemäß LAGA PN 98</span>
                    </div>
                  </label>

                  {/* Volatiles Checkbox */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={volatilesSelected}
                      onChange={(e) => setVolatilesSelected(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight">Flüchtige Schadstoffe im Fokus</span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5">Analytik sucht nach BTEX, LCKW oder flüchtigen KW</span>
                    </div>
                  </label>

                  {/* Heterogeneity Toggle */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isHeterogeneous}
                      onChange={(e) => setIsHeterogeneous(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight">Schichtung / Ungleichmäßigkeit</span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5">Haufwerk ist visuell inhomogen oder ungeschichtet</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Calculated Outputs Column */}
              <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono mb-4">Berechnetes Probenahme-Soll (LAGA PN 98)</h5>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Tonnage des Haufwerks</span>
                      <div className="text-xl font-extrabold text-slate-850 mt-0.5 flex items-baseline gap-1">
                        {tonnage.toLocaleString('de-DE')}
                        <span className="text-xs font-normal text-slate-500">t</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Untersuchungseinheiten (UE)</span>
                      <div className="text-xl font-extrabold text-slate-850 mt-0.5 flex items-baseline gap-1">
                        {numInvestigationUnits}
                        <span className="text-xs font-normal text-slate-500">UE</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-xl border border-home-grau/15">
                    
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Mindestanzahl Mischproben:</span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono">1 Mischprobe pro Untersuchungseinheit</span>
                      </div>
                      <span className="text-sm font-black text-shiraz bg-shiraz/5 border border-shiraz/20 px-3 py-1 rounded">
                        {formatDeWert(samplingReq.mp)} MP
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Mindestanzahl Einzelproben (Increments):</span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono">Insgesamt aus verschiedenen Tiefenstufen</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1 rounded">
                        {formatDeWert(samplingReq.ep)} EP
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Menge je Einzelprobe (Volumen / Gewicht):</span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono">Orientiert nach d_max ({specs.name})</span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        {specs.vol >= 1 ? `${formatDeWert(specs.vol)} L` : `${formatDeWert(specs.vol * 1000)} ml`} / {formatDeWert(specs.mass)} kg
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Labor-Mindestmenge &amp; Replikate (LfU):</span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono">Analysenprobe + Behördenprobe + Beweissicherung</span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
                        3 x {formatDeWert(totalMinLabSampleMass)} kg (= {formatDeWert(totalFieldMassRequired)} kg)
                      </span>
                    </div>
                  </div>

                  {/* Context-Sensitive Warnings and Instructions (Bavarian Specifics) */}
                  <div className="mt-4 space-y-2">
                    
                    {/* Warning: Missing Qualification */}
                    {!hasSachkunde && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex gap-2 items-start animate-pulse">
                        <AlertTriangle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold">Rechtlicher Mangel nach LfU-Regelwerk:</strong>
                          Ohne Sachkundenachweis nach LAGA PN 98 ist die Probenahme rechtlich ungültig. Analysenergebnisse werden von den bayerischen Abfallbehörden zur EBV-Einstufung grundsätzlich NICHT anerkannt!
                        </div>
                      </div>
                    )}

                    {/* Instruction: Volatiles (BTEX/LCKW) required procedure */}
                    {volatilesSelected && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-850 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold">Spezialvorgabe LfU Bayern für flüchtige Schadstoffe:</strong>
                          Für leichtflüchtige Stoffe dürfen <strong>keine</strong> ausgedehnten Mischproben hergestellt werden, da die Schadstoffe sonst evaporieren (ausgasen). Die Probenahme hat zwingend als ungestörte Probe mittels Stechzylinder direkt in gasdichte Gläser mit Septumdeckel zu erfolgen!
                        </div>
                      </div>
                    )}

                    {/* Instruction: Heterogeneity */}
                    {isHeterogeneous && (
                      <div className="bg-sky-50 border border-sky-200 text-sky-850 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <Info size={15} className="text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold">Hinweis zur Probenahmestrategie:</strong>
                          Inhomogene oder geschichtete Haufwerke sind laut LfU Bayern vorab durch einen Hydraulikbagger mechanisch zu homogenisieren, um repräsentative Stichproben zu garantieren, oder es müssen separate Untersuchungs-Teileinheiten gebildet werden.
                        </div>
                      </div>
                    )}

                    {/* Big units notice */}
                    {numInvestigationUnits > 1 && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <Layers size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold">Erforderliche Aufteilung in {numInvestigationUnits} Sektoren:</strong>
                          Da das Haufwerk die bayerische Obergrenze von 500 m³ bzw. 1000 t übersteigt, schreibt das LfU die physische Aufteilung des Haufwerks in {numInvestigationUnits} eigenständige Untersuchungseinheiten (UE) vor. Sektorbeprobung erforderlich!
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-home-grau/20">
                  Formel zur Probenanzahl: Für das Volumen <FormulaText text="V_u" /> gilt ab 30 m³ die Formel <FormulaText text="n_{MP} = \lceil \frac{V_u - 2000}{500} \rceil + 6" /> mit jeweils mindestens <FormulaText text="10" /> Einzelproben je Mischprobe.
                </div>
              </div>
            </div>

            {/* Part 4.2 Probenahmeprotokoll Form & Report Generator */}
            <div className="mt-8 pt-8 border-t border-home-grau/30">
              <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                <FileText size={16} className="text-shiraz" />
                Interaktiver Probenahmeprotokoll-Generator
              </h5>
              <p className="text-xs text-slate-600 leading-normal mb-4">
                Nutzen Sie dieses interaktive Formular, um ein normgerechtes Probenahmeprotokoll nach PN 98 zur Vorlage beim Chemielabor und der Abfallbehörde zu entwerfen. Ergänze die Projektmetadaten.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Projektbezeichnung:</label>
                    <input 
                      type="text" 
                      value={pProject}
                      onChange={(e) => setPProject(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Zertifizierter Probennehmer Name:</label>
                    <input 
                      type="text" 
                      value={pSampler}
                      onChange={(e) => setPSampler(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Datum der Probenahme:</label>
                    <input 
                      type="text" 
                      value={pDate}
                      onChange={(e) => setPDate(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Entnahmeort / GPS-Koordinaten:</label>
                    <input 
                      type="text" 
                      value={pLocation}
                      onChange={(e) => setPLocation(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Witterungsverhältnisse:</label>
                    <input 
                      type="text" 
                      value={pWeather}
                      onChange={(e) => setPWeather(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Behördenzeuge / Vertretung Bauherr:</label>
                    <input 
                      type="text" 
                      value={pWitness}
                      onChange={(e) => setPWitness(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Besondere Bemerkungen &amp; Vor-Ort-Sensorik (Geruch, Färbung):</label>
                <textarea 
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                  disabled={isFinalized}
                  className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white h-16 font-sans resize-none" 
                />
              </div>

              {/* LIVE RENDER OF OFFICIAL DOCUMENT SHEETS */}
              <div id="printable-probenahmeprotokoll" className="bg-white border-2 border-slate-700 rounded-lg p-6 font-serif shadow-sm relative text-xs text-slate-900 leading-normal max-w-3xl mx-auto">
                <div className="absolute top-2 right-4 text-xs font-sans font-bold text-slate-400 font-mono hidden md:block">
                  Akkreditierungsnummer: BY-PN98-2026
                </div>

                <div className="border-b-2 border-slate-700 pb-3 mb-4 text-center">
                  <h3 className="text-base font-black font-sans uppercase tracking-widest text-slate-900">Probenahmeprotokoll gemäß LAGA PN 98</h3>
                  <p className="text-xs font-sans text-slate-500 mt-1">
                    Güttigkeitsnachweis unter Anerkennung des bayerischen Landesamtes für Umwelt (LfU Bayern)
                  </p>
                </div>

                {/* Status Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-shiraz font-sans font-black text-6xl text-center rotate-12 uppercase select-none">
                  {isFinalized ? 'GEREGELT / UNTERZEICHNET' : 'ENTWURF / DRAFT'}
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pb-3 mb-3 border-b border-dashed border-slate-300">
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">PROJEKT:</span>
                    <span className="font-semibold text-slate-900">{pProject}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">ENTNAHMEORT:</span>
                    <span className="font-semibold text-slate-900">{pLocation}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">DATUM:</span>
                    <span className="font-semibold text-slate-900">{pDate}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">WITTERUNG:</span>
                    <span className="font-semibold text-slate-900">{pWeather}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pb-3 mb-3 border-b border-dashed border-slate-300">
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">PROBENNEHMER / SACHKUNDE:</span>
                    <span className="font-semibold text-slate-900">{pSampler}</span>
                    <span className="block text-xs text-slate-500 font-sans mt-0.5">
                      {hasSachkunde 
                        ? '✔️ Zertifikat PN98 liegt vor &amp; eingetragen' 
                        : '❌ Achtung: Klären Sie mangelnde Zertifizierung'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">BEHÖRDENZEUGE:</span>
                    <span className="font-semibold text-slate-900">{pWitness}</span>
                  </div>
                </div>

                <div className="pb-3 mb-3 border-b border-dashed border-slate-300">
                  <span className="font-bold font-sans text-xs text-slate-500 block mb-1">HAUFWERKSMETADATEN &amp; SOLL-ANFORDERUNGEN:</span>
                  <table className="w-full text-xs font-sans border border-collapse border-slate-300">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-300 p-1 text-left font-bold">Parameter</th>
                        <th className="border border-slate-300 p-1 text-left font-bold">Soll-Vorgabe (LAGA PN 98)</th>
                        <th className="border border-slate-300 p-1 text-left font-bold">Ist-Wert (Probenahme)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1">Haufwerksvolumen / Masse</td>
                        <td className="border border-slate-300 p-1 font-mono">{formatDeWert(heapVolume)} m³ / {formatDeWert(tonnage)} t</td>
                        <td className="border border-slate-300 p-1 font-semibold">Laut Vermessung erfüllt</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1">Untersuchungseinheiten (UE)</td>
                        <td className="border border-slate-300 p-1 font-mono">{numInvestigationUnits} UE (max. 500 m³)</td>
                        <td className="border border-slate-300 p-1 font-semibold">{numInvestigationUnits} UE gebildet</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1">Anzahl Mischproben (MP)</td>
                        <td className="border border-slate-300 p-1 font-mono">≥ {formatDeWert(samplingReq.mp)} MP</td>
                        <td className="border border-slate-300 p-1 font-semibold">{formatDeWert(samplingReq.mp)} MP entnommen</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1">Anzahl Einzelproben (EP)</td>
                        <td className="border border-slate-300 p-1 font-mono">≥ {formatDeWert(samplingReq.ep)} EP (verteilt)</td>
                        <td className="border border-slate-300 p-1 font-semibold">{formatDeWert(samplingReq.ep)} EP homogen vermischt</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1">Maximales Korn d_max</td>
                        <td className="border border-slate-300 p-1">{specs.name}</td>
                        <td className="border border-slate-300 p-1 font-semibold">Bestätigt</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-350 p-1">Inkrementmenge je EP</td>
                        <td className="border border-slate-350 p-1 font-mono">≥ {formatDeWert(specs.vol)} Liters / {formatDeWert(specs.mass)} kg</td>
                        <td className="border border-slate-350 p-1 font-semibold">Eingehalten (Schaufelbeprobung)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-350 p-1">Probenkonservierung &amp; Rückhalt (LfU)</td>
                        <td className="border border-slate-350 p-1 font-mono">3 x {formatDeWert(totalMinLabSampleMass)} kg Replikate</td>
                        <td className="border border-slate-350 p-1 font-semibold">In verplombten PE-Eimern verpackt</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pb-4 mb-4">
                  <span className="font-bold font-sans text-xs text-slate-500 block">SENSORIK &amp; BESONDERE BEMERKUNGEN:</span>
                  <p className="italic text-slate-805 bg-slate-50 p-2 border border-slate-200 rounded leading-relaxed mt-1">
                    "{pNotes || 'Keine sensorischen Auffälligkeiten.'}"
                  </p>
                </div>

                {/* Simulated Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-8 pt-8 border-t border-slate-300 font-sans text-xs">
                  <div className="space-y-4">
                    <div className="border-b border-slate-900 pb-1 font-mono font-medium text-slate-700 italic h-6 flex items-center">
                      {isFinalized ? pSampler : ''}
                    </div>
                    <strong>Unterschrift des Probennehmers</strong>
                    <span className="block text-slate-400">Sachkundenummer: BY-PN98-2026/092</span>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b border-slate-900 pb-1 font-mono font-medium text-slate-700 italic h-6 flex items-center">
                      {isFinalized ? pWitness : ''}
                    </div>
                    <strong>Unterschrift Bauzeuge/Behörde</strong>
                    <span className="block text-slate-400">Verantwortliche Überwachungsstelle</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for report */}
              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsFinalized(!isFinalized)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isFinalized 
                      ? 'bg-slate-700 text-white hover:bg-slate-800' 
                      : 'bg-shiraz hover:bg-shiraz/90 text-white'
                  }`}
                >
                  <ClipboardCheck size={14} />
                  {isFinalized ? 'Protokoll entsperren / Korrektur' : 'Protokoll finalisieren &amp; digital siegeln'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isFinalized) {
                      setIsFinalized(true);
                    }
                    setTimeout(() => window.print(), 150);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  Als offizielles PDF drucken
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

        </div>
      </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Bodenschutz', url: 'https://de.wikipedia.org/wiki/Bodenschutz' },
          { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' }
        ]}
        literatur={[
          'Bayerisches Landesamt für Umwelt (LfU) Infoblatt lfu_abfall_00266 - Anforderungen an die Probennahme von Abfällen und Haufwerken (LAGA PN 98)'
        ]}
        weblinks={[
          { title: 'Bayerisches LfU Infoblatt lfu_abfall_00266 (PDF-Download)', url: 'https://www.bestellen.bayern.de/med/801504b0-b4a5-11f0-81ee-c3fc7d0a3316/4b0e6a70-1059-11d9-4c85-9d915831e9eb/0/lfu_abfall_00266.pdf' }
        ]}
        regelwerke={[
          { title: 'Ersatzbaustoffverordnung (EBV) - Richtlinien zur rechtlich belastbaren Verwertung von mineralischen Ersatzbaustoffen', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Bundes-Bodenschutz- und Altlastenverordnung (BBodSchV) - Regelungen zum vorsorgenden und sanierenden Bodenschutz', url: 'https://de.wikipedia.org/wiki/Bodenschutz' },
          { title: 'LAGA PN 98 - Richtlinie für das Vorgehen bei physikalischen, chemischen und biologischen Untersuchungen im Zusammenhang mit der Verwertung/Beseitigung von Abfällen', url: 'https://www.laga-online.de/' }
        ]}
        formeln={[
          { formel: 'n_{MP} = 6 + \\lceil \\frac{V_{Haufwerk} - 2000}{500} \\rceil \\quad \\text{mit} \\quad n_{EP} = n_{MP} \\times 10', erklaerung: 'Mischprobenbestimmung nach LAGA PN 98 (>2000m³)' },
          { formel: 'V_{EP, min} = f(d_{max}) \\in [0{,}1, 25{,}0]\\ \\text{Liter}', erklaerung: 'Mindesteinzelprobenvolumen nach Größtkorn' }
        ]}
      />
    </div>
  );
}
