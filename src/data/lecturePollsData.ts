export interface PollQuestion {
  id: string;
  lectureId: 'bauen_im_bestand' | 'nachhaltiges_bauen' | 'bauschaeden' | 'baustoffkunde' | 'instandhaltung';
  category: 'Schätzfrage' | 'Grundwissen' | 'Aha-Moment';
  question: string;
  options: string[];
  correctIndex: number;
  didaktik: string;
  norm?: string;
  initialVotes: number[];
}

export const LECTURE_POLLS: Record<string, PollQuestion[]> = {
  bauen_im_bestand: [
    {
      id: 'bib_q1',
      lectureId: 'bauen_im_bestand',
      category: 'Schätzfrage',
      question: 'Wie hoch ist der geschätzte Anteil von Baumaßnahmen im Gebäudebestand (Sanierung, Umbau, Instandsetzung) am gesamten Bauvolumen im deutschen Hochbau?',
      options: [
        'ca. 25 % (Neubau dominiert mit 75 %)',
        'ca. 45 % (Knapp die Hälfte des Marktes)',
        'ca. 68–72 % (Mehr als zwei Drittel!)',
        'ca. 90 % (Neubau ist fast vernachlässigbar)'
      ],
      correctIndex: 2,
      didaktik: 'Über 70 % aller Bauinvestitionen im Hochbau fließen in den Gebäudebestand! Bauingenieure sind heute primär Bestandsingenieure. Wer sich rein auf den Neubau auf der grünen Wiese fokussiert, verfehlt mehr als zwei Drittel des Marktvolumens.',
      norm: 'Baukosteninformationszentrum (BKI) / DIW Bauvolumenrechnung',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bib_q2',
      lectureId: 'bauen_im_bestand',
      category: 'Grundwissen',
      question: 'Wie viel Prozent aller Bestandsgebäude in Deutschland stehen tatsächlich unter behördlichem Denkmalschutz?',
      options: [
        'ca. 3–5 % aller Gebäude',
        'ca. 15–20 % aller Gebäude',
        'ca. 35 % aller Gebäude',
        'Nahezu alle Gebäude, die vor 1945 erbaut wurden'
      ],
      correctIndex: 0,
      didaktik: 'Nur etwa 3 bis maximal 5 % des deutschen Gebäudebestands sind eingetragene Denkmäler! Die restlichen 95 % sind sogenannte Profanbauten – insbesondere Nachkriegsbauten der 1950er bis 1980er Jahre. Hier liegt die primäre technische Ingenieuraufgabe zur energetischen und tragwerkstechnischen Ertüchtigung.',
      norm: 'Deutsches Nationalkomitee für Denkmalschutz (DNK)',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bib_q3',
      lectureId: 'bauen_im_bestand',
      category: 'Schätzfrage',
      question: 'Aus welcher Baualtersklasse stammt der flächenmäßig größte Anteil der heute in Deutschland genutzten Wohngebäude?',
      options: [
        'Gründerzeit & Jugendstil (vor 1918)',
        '1949–1978 (Nachkriegszeit vor der 1. Wärmeschutzverordnung)',
        '1979–2000 (Erste Wärmeschutzstandards WSVO)',
        'Neubauten ab dem Jahr 2000 (EnEV/GEG-Standard)'
      ],
      correctIndex: 1,
      didaktik: 'Über 50 % der deutschen Wohnflächen wurden zwischen 1949 und 1978 errichtet – einer Epoche akuter Materialknappheit, dünnwandiger Hohlblocksteine, ungedämmter Betondecken und Holzbalkenkonstruktionen. Diese Baualtersklasse ist der größte Stellhebel für die Wärmewende.',
      norm: 'Statistisches Bundesamt (Destatis) / dena Gebäudereport',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bib_q4',
      lectureId: 'bauen_im_bestand',
      category: 'Aha-Moment',
      question: 'Warum ist der Erhalt eines 100 Jahre alten Mauerwerksbaus ökologisch oft günstiger als ein energieeffizienter Ersatzneubau?',
      options: [
        'Historischer Kalkmörtel nimmt über Jahrhunderte dauerhaft CO₂ auf',
        'Die graue Energie (Embodied Carbon) der Bausubstanz ist bereits gebunden und muss nicht neu emittiert werden',
        'Vollziegelwände dämmen im Winter physikalisch besser als moderne Mineralwolle',
        'Weil das Kreislaufwirtschaftsgesetz einen Abriss prinzipiell untersagt'
      ],
      correctIndex: 1,
      didaktik: 'Die "graue Energie" und die Herstellungs-Emissionen (Modul A1–A3) von Tragwerk, Fundament und Mauerwerk sind bereits gebunden. Ein Abriss vernichtet diese Rohstoffe; der Neubau verursacht enorme Initial-Emissionen, die sich über betriebliche Einsparungen oft erst nach 40 bis 60 Jahren amortisieren.',
      norm: 'DIN EN 15978 / DGNB Ökobilanzstudien',
      initialVotes: [0, 0, 0, 0]
    }
  ],

  nachhaltiges_bauen: [
    {
      id: 'nb_q1',
      lectureId: 'nachhaltiges_bauen',
      category: 'Schätzfrage',
      question: 'Welchen Anteil hat der globale Gebäude- und Bausektor an den weltweiten energiebedingten CO₂-Emissionen?',
      options: [
        'ca. 10 % (vergleichbar mit dem weltweiten Flugverkehr)',
        'ca. 22 % (etwa ein Fünftel)',
        'ca. 38–40 % (fast zwei Fünftel aller Emissionen!)',
        'ca. 65 % (mehr als die Hälfte)'
      ],
      correctIndex: 2,
      didaktik: 'Rund 40 % der globalen Treibhausgasemissionen entfallen auf Gebäude! Davon ca. 28 % aus dem laufenden Gebäudebetrieb (Heizung, Kühlung, Beleuchtung) und ca. 11–12 % aus der Herstellung der Baustoffe (Klinker, Stahl, Glas, Dämmstoffe). Ohne Bauwende ist das 1,5°C-Ziel unmöglich erreichbar.',
      norm: 'UNEP Global Status Report for Buildings and Construction',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'nb_q2',
      lectureId: 'nachhaltiges_bauen',
      category: 'Schätzfrage',
      question: 'Wie viel Prozent aller weltweit geförderten mineralischen Primärrohstoffe (Massenströme) verbraucht die Bauindustrie?',
      options: [
        'ca. 15 % der globalen Rohstoffe',
        'ca. 30 % der globalen Rohstoffe',
        'über 50 % aller globalen mineralischen Rohstoffe',
        'ca. 85 % der globalen Rohstoffe'
      ],
      correctIndex: 2,
      didaktik: 'Das Bauwesen ist mit über 50 % der weltweite Spitzenreiter beim Ressourcenverbrauch (Kies, Sand, Tone, Erze, Gips). Bausand ist nach Wasser das meistgeförderte Gut der Erde und in vielen Regionen bereits von akuter Verknappung betroffen.',
      norm: 'Umweltbundesamt (UBA) / OECD Global Material Resources Outlook',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'nb_q3',
      lectureId: 'nachhaltiges_bauen',
      category: 'Aha-Moment',
      question: 'Woher stammt der größte Teil der CO₂-Emissionen bei der Herstellung von Portlandzementklinker im Drehofen?',
      options: [
        'Vom Dieselverbrauch beim Transport der Rohstoffe zum Werk',
        'Aus der chemischen Entsäuerung des Kalksteins (CaCO₃ → CaO + CO₂↑)',
        'Aus dem rein thermischen Verbrennen von Brennstoffen im Brenner',
        'Vom Strombedarf der Zementmühlen und Ventilatoren'
      ],
      correctIndex: 1,
      didaktik: 'Rund 60–65 % der Zement-Emissionen sind rohstoffbedingt! Sie entstehen zwangsläufig, wenn Calciumcarbonat (Kalkstein) bei ca. 900–1450 °C gebrannt wird und dabei gebundenes CO₂ freisetzt. Selbst mit 100 % Ökostrom im Ofen bleibt dieser CO₂-Ausstoß physikalisch-chemisch bestehen. Klinkerreduktion (CEM II/III, LC3) ist daher unumgänglich!',
      norm: 'VDZ (Verein Deutscher Zementwerke) / DIN EN 197-1',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'nb_q4',
      lectureId: 'nachhaltiges_bauen',
      category: 'Grundwissen',
      question: 'Wie viel Prozent des gesamten Brutto-Abfallaufkommens in Deutschland entfallen auf mineralische Bau- und Abbruchabfälle?',
      options: [
        'ca. 12 % (Hausmüll und Verpackungen überwiegen)',
        'ca. 25 % (ein Viertel)',
        'ca. 55 % (über 220 Millionen Tonnen pro Jahr!)',
        'ca. 80 % (der weitaus größte Teil)'
      ],
      correctIndex: 2,
      didaktik: 'Über die Hälfte des gesamten deutschen Abfallbergs (ca. 55 % bzw. 220–230 Mio. t/a) ist Bauschutt, Straßenaufbruch und Bodenaushub! Die Kreislaufwirtschaft im Bauwesen (Ersatzbaustoffverordnung EBV, RC-Beton) ist der größte nationale Hebel für Ressourcenschonung.',
      norm: 'Statistisches Bundesamt: Abfallbilanz 2022/2023',
      initialVotes: [0, 0, 0, 0]
    }
  ],

  bauschaeden: [
    {
      id: 'bs_q1',
      lectureId: 'bauschaeden',
      category: 'Schätzfrage',
      question: 'Welches physikalische Phänomen ist statistisch für über 75 % aller Bauschadensfälle im Hochbau verantwortlich?',
      options: [
        'Baugrundsetzungen und Erdbebenerschütterungen',
        'Feuchtigkeit, Wasser und Tauwasserausfall in Bauteilen',
        'Thermische Spannungsrisse durch Sonneneinstrahlung',
        'Chemischer Angriff durch Industrieabgase'
      ],
      correctIndex: 1,
      didaktik: 'Wasser ist Schadensursache Nr. 1! Ca. 75–80 % aller Sachverständigenfälle betreffen mangelhafte Bauwerksabdichtungen, drückendes Grundwasser, Leckagen, Wärmebrücken mit Schimmelbildung oder mangelhafte Schlagregensicherung.',
      norm: 'AISA / Institut für Bauforschung / VDI 6200',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bs_q2',
      lectureId: 'bauschaeden',
      category: 'Grundwissen',
      question: 'In welcher Projektphase entstehen statistisch die meisten Mängelursachen, die später zu schweren Bauschäden führen?',
      options: [
        'Herstellungsfehler der Baustoffindustrie (Materialfehler)',
        'Planungs- und Koordinationsfehler (Planung, Details, Bauphysik)',
        'Reine Ausführungsfehler der Bauhandwerker vor Ort',
        'Unterlassene Nutzerwartung und falsches Lüftungsverhalten'
      ],
      correctIndex: 1,
      didaktik: 'Über 40–50 % aller Bauschäden wurzeln in mangelhafter Planung und fehlender Detailkoordination (fehlende Anschlüsse, ungelöste Schnittstellen, fehlerhafte Bauphysik). Ausführungsfehler machen ca. 35–40 % aus, reine Materialfehler der Baustoffe unter 5 %!',
      norm: 'Bauforensik & Sachverständigenwesen (Ahnert / Wendehorst)',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bs_q3',
      lectureId: 'bauschaeden',
      category: 'Schätzfrage',
      question: 'Auf welche Summe belaufen sich die jährlichen Mängelbeseitigungskosten im deutschen Bauwesen schätzungsweise?',
      options: [
        'ca. 100 bis 200 Millionen Euro',
        'ca. 800 Millionen Euro',
        'ca. 8 bis 12 Milliarden Euro pro Jahr',
        'ca. 50 Milliarden Euro pro Jahr'
      ],
      correctIndex: 2,
      didaktik: 'Der volkswirtschaftliche Schaden durch Baufehler liegt jährlich bei rund 8 bis über 10 Milliarden Euro! Bauschadensanalyse ist kein theoretisches Randthema, sondern elementarer Schutz von Vermögenswerten und Lebensräumen.',
      norm: 'Bauschadensbericht der Bundesregierung / Bauforensische Gutachten',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bs_q4',
      lectureId: 'bauschaeden',
      category: 'Aha-Moment',
      question: 'Ist ein Riss in einem biegebeanspruchten Stahlbetonbauteil grundsätzlich ein technischer Bauschaden?',
      options: [
        'Ja, ordnungsgemäßer Stahlbeton darf unter keinen Umständen reißen',
        'Nein, Stahlbeton funktioniert im Zustand II erst durch kontrollierte Rissbildung (w_k nach Eurocode 2)',
        'Nur wenn der Riss horizontal verläuft',
        'Nur wenn er innerhalb der ersten 28 Tage nach dem Betonieren auftritt'
      ],
      correctIndex: 1,
      didaktik: 'Stahlbeton unter Zug oder Biegung MUSS reißen! Da Beton eine geringe Zugfestigkeit besitzt (~2–3 N/mm²), übernimmt die Stahlbewehrung die Zugkräfte erst, wenn der Beton gerissen ist (Zustand II). Ein Mangel liegt erst vor, wenn die rechnerische Rissbreite w_k (z. B. 0,2–0,4 mm nach DIN EN 1992-1-1) überschritten wird oder Korrosionsschutz gefährdet ist.',
      norm: 'DIN EN 1992-1-1 (Eurocode 2, Abs. 7.3)',
      initialVotes: [0, 0, 0, 0]
    }
  ],

  baustoffkunde: [
    {
      id: 'bk_q1',
      lectureId: 'baustoffkunde',
      category: 'Schätzfrage',
      question: 'Wie hoch ist die typische Trockenrohdichte von unbewehrtem Normalbeton (ohne Stahl)?',
      options: [
        'ca. 1200 kg/m³ (schwimmt fast auf Wasser)',
        'ca. 1800 kg/m³',
        'ca. 2200 bis 2400 kg/m³ (2,2–2,4 t/m³)',
        'ca. 3500 kg/m³'
      ],
      correctIndex: 2,
      didaktik: 'Normalbeton wiegt trocken ca. 2300–2400 kg/m³. Rechnet man Stahlbewehrung hinzu, setzt die Norm DIN EN 1991-1-1 standardmäßig 2500 kg/m³ (25 kN/m³) als Eigenlast an. Leichtbeton liegt unter 2000 kg/m³, Schwerbeton über 2600 kg/m³.',
      norm: 'DIN EN 206 / DIN EN 1991-1-1',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bk_q2',
      lectureId: 'baustoffkunde',
      category: 'Grundwissen',
      question: 'Auf welche Weise erhärtet herkömmlicher Baukalk (Luftkalk Ca(OH)₂) im Putzmörtel an der Wand?',
      options: [
        'Durch einfaches Austrocknen und Wasserverdampfen',
        'Durch Karbonatisierung mit dem Kohlendioxid der Luft: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O',
        'Durch hydraulische Kristallbildung mit Silikatpartikeln im Sand',
        'Durch photochemische Reaktion mit Tageslicht (UV-Härtung)'
      ],
      correctIndex: 1,
      didaktik: 'Luftkalk härtet nicht durch Trocknen, sondern durch eine chemische Gasphasen-Reaktion! Das Calciumhydroxid nimmt CO₂ aus der Raumluft auf und wandelt sich wieder in druckfesten Kalkstein (CaCO₃) um. Trocknet der Mörtel zu schnell aus, "verbrennt" er mürbe ohne Festigkeit.',
      norm: 'DIN EN 459-1 (Baukalke)',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bk_q3',
      lectureId: 'baustoffkunde',
      category: 'Schätzfrage',
      question: 'Um welchen Faktor ist das Elastizitätsmodul (Steifigkeit) von Baustahl (ca. 210 000 N/mm²) größer als das von Normalbeton C25/30 (ca. 31 000 N/mm²)?',
      options: [
        'Beide Werkstoffe besitzen nahezu das gleiche E-Modul (Faktor 1)',
        'Stahl ist ca. 2-mal steifer als Beton',
        'Stahl ist ca. 6- bis 7-mal steifer als Beton',
        'Stahl ist mehr als 50-mal steifer als Beton'
      ],
      correctIndex: 2,
      didaktik: 'Das Steifigkeitsverhältnis α_e = E_s / E_c beträgt im Kurzzeitbereich etwa 6,7 (unter Dauerlast und Betonkriechen rechnerisch sogar 15–20!). Der thermische Ausdehnungskoeffizient beider Stoffe ist jedoch mit α_T ≈ 10·10⁻⁶ K⁻¹ fast identisch – die fundamentale physikalische Voraussetzung für den Verbundwerkstoff Stahlbeton!',
      norm: 'DIN EN 1992-1-1 / DIN EN 1993-1-1',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'bk_q4',
      lectureId: 'baustoffkunde',
      category: 'Aha-Moment',
      question: 'In welcher Richtung schwindet oder quillt massives Holz bei Feuchteänderung am stärksten?',
      options: [
        'In Faserrichtung (longitudinal, Längsrichtung des Baumes)',
        'In tangentialer Richtung (entlang der Jahrringe)',
        'In radialer Richtung (vom Kern zur Rinde)',
        'Holz ist ein isotroper Werkstoff und verformt sich allseitig gleich'
      ],
      correctIndex: 1,
      didaktik: 'Holz ist hochgradig anisotrop! Tangential schwindet Holz mit ca. 8–10 % am stärksten, radial mit ca. 4–5 % und längs zur Faser mit nur ca. 0,1–0,3 % fast gar nicht. Diese Anisotropie führt zum typischen "Schüsseln" und Verziehen von Bohlen und Balken.',
      norm: 'DIN EN 1995-1-1 (Eurocode 5) / Niemz: Physik des Holzes',
      initialVotes: [0, 0, 0, 0]
    }
  ],

  instandhaltung: [
    {
      id: 'ih_q1',
      lectureId: 'instandhaltung',
      category: 'Schätzfrage',
      question: 'Welche planmäßige rechnerische Bemessungslebensdauer legt der Eurocode (DIN EN 1990) für Standard-Hochbauten (Wohn- und Bürogebäude) zugrunde?',
      options: [
        '25 Jahre',
        '50 Jahre (Entwurfsklasse 4)',
        '100 Jahre (wie bei Brücken und Monumentalbauten)',
        'Unbegrenzt, solange kein Einsturz droht'
      ],
      correctIndex: 1,
      didaktik: 'Die normative Entwurfslebensdauer für Standardgebäude beträgt 50 Jahre (Brücken: 100 Jahre, temporäre Bauten: 10 Jahre). Da moderne Gebäude oft weit über 80 bis 100 Jahre genutzt werden sollen, ist eine planmäßige, wissenschaftliche Instandhaltung zwingende Voraussetzung.',
      norm: 'DIN EN 1990 (Eurocode 0, Tabelle 2.1)',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'ih_q2',
      lectureId: 'instandhaltung',
      category: 'Grundwissen',
      question: 'Warum rostet der Bewehrungsstahl in gesundem, frischem Beton normalerweise NICHT?',
      options: [
        'Weil Beton den Stahl vollkommen luftdicht gegen Sauerstoff abdichtet',
        'Wegen des hochalkalischen Milieus (pH ≈ 12,5–13,5), das eine schützende mikroskopische Passivschicht erzeugt',
        'Weil Beton den elektrischen Stromfluss zu 100 % unterbindet',
        'Weil Betonstahl ab Werk mit chemischen Korrosionsinhibitoren legiert ist'
      ],
      correctIndex: 1,
      didaktik: 'Das Calciumhydroxid (Ca(OH)₂) im Zementstein erzeugt einen extrem hohen pH-Wert (> 12,5). In diesem stark alkalischen Milieu bildet sich auf dem Stahl eine dichte, nanometerdünne Eisenoxid-Passivschicht. Sinkt der pH-Wert durch Karbonatisierung unter 9,5, bricht die Schutzschicht zusammen und der Stahl rostet.',
      norm: 'DAfStb-Heft 600 / DIN EN 1504',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'ih_q3',
      lectureId: 'instandhaltung',
      category: 'Schätzfrage',
      question: 'Wie schnell schreitet die Karbonatisierungsfront in gutem, ungerissenem Außenbeton durchschnittlich voran?',
      options: [
        'ca. 10–15 mm pro Monat',
        'ca. 1 bis 2 mm pro Jahr (folgt dem Wurzel-t-Gesetz d = k·√t)',
        'ca. 15 mm pro Jahr linear',
        'Gar nicht, solange kein saurer Regen auf den Beton trifft'
      ],
      correctIndex: 1,
      didaktik: 'Die Karbonatisierung verlangsamt sich im Zeitverlauf nach dem Diffusionsgesetz d_c = K · √t. Bei dichter Zementsteinmatrix beträgt die Fronttiefe nach 1 Jahr ca. 2–3 mm, nach 25 Jahren ca. 10–15 mm und nach 50 Jahren ca. 15–20 mm. Deshalb ist eine Mindestbetondeckung (c_min ≥ 25–40 mm) lebenswichtig für die Dauerhaftigkeit.',
      norm: 'fib Model Code / DIN EN 1992-1-1 Expositionsklassen XC',
      initialVotes: [0, 0, 0, 0]
    },
    {
      id: 'ih_q4',
      lectureId: 'instandhaltung',
      category: 'Aha-Moment',
      question: 'Was regelt die europäische Normenreihe DIN EN 1504 für die Bauwerkserhaltung im Kern?',
      options: [
        'Dass schadhafter Beton immer zwingend durch Stahlbauteile ersetzt werden muss',
        'Sie definiert 11 standardisierte Instandsetzungsprinzipien (Feuchteregulierung, kathodischer Schutz, Rissinjektion etc.)',
        'Sie schreibt vor, dass Gebäude alle 5 Jahre vollständig neu gestrichen werden müssen',
        'Sie verbietet das manuelle Verpressen von Rissen mit Epoxidharzen'
      ],
      correctIndex: 1,
      didaktik: 'DIN EN 1504 gliedert den Betonschutz und die Instandsetzung in 11 wissenschaftliche Grundprinzipien für Beton und Bewehrung (z. B. Prinzip 1: Schutz vor Eindringen; Prinzip 2: Feuchteregulierung; Prinzip 7: Wiederherstellung des Betons; Prinzip 9: Kathodischer Schutz; Prinzip 11: Rissfüllung). Instandhaltung ist planbare Ingenieurwissenschaft!',
      norm: 'DIN EN 1504 Teile 1–10 (Produkte und Systeme für den Schutz und die Instandsetzung)',
      initialVotes: [0, 0, 0, 0]
    }
  ]
};

export function getLecturePolls(lectureId: string): PollQuestion[] {
  return LECTURE_POLLS[lectureId] || [];
}
