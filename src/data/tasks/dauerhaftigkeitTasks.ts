import { Task } from '../aufgabenData';

export const dauerhaftigkeitTasks: Task[] = [
  {
    id: 't_expositionsklassen_dauerhaftigkeit',
    difficulty: 'Mittel',
    title: 'Dauerhaftigkeit: Expositionsklassen nach DIN EN 206 / DIN 1045-2',
    question: 'Ein freistehendes Parkhausdeck im Voralpenland ist direkter Beregnung, Frost und durch Fahrzeuge eingetragenen Tausalzen ausgesetzt. Welche Expositionsklassen sind maßgeblich und welcher Mindestbetonzementgehalt sowie maximaler w/z-Wert gelten?',
    moduleHint: { id: 'dauerhaftigkeit_info', name: 'Dauerhaftigkeit Grundlagen' },
    solution: 'Maßgebliche Expositionsklassen:\n- **XD3:** Hohe Chloridbeanspruchung durch Taumittel (Sprühnebel und abtropfendes Schmelzwasser).\n- **XF4:** Hoher Frost- und Taumittelangriff (stehendes Schmelzwasser mit Tausalz).\n- **XC4:** Wechselnd nass und trocken (Bewehrungskorrosion durch Carbonatisierung).\n\nAnforderungen nach DIN 1045-2:\n- Mindestdruckfestigkeitsklasse: **C35/45** (aus XD3); wegen XF4 zusätzlich **Luftporenbeton** mit Gesteinskörnung hohen Frost-Tausalz-Widerstands.\n- Maximal zulässiger Wasserzementwert: **$(w/z)_{\\text{max}} = 0{,}45$**.\n- Mindestzementgehalt: **$z_{\\text{min}} = 320\\text{ kg/m}^3$**.\n- Mindestbetondeckung: $c_{\\text{min,dur}} = 40\\text{ mm}$ plus Vorhaltemaß nach NA $\\Delta c_{\\text{dev}} = 15\\text{ mm} \\rightarrow c_{\\text{nom}} = 55\\text{ mm}$. Bei befahrenen Parkdecks zusätzlich rissüberbrückendes Oberflächenschutzsystem (DAfStb-Heft 600, DBV-Merkblatt Parkhäuser).'
  },
  {
    id: 't_akr_schadensreaktion',
    difficulty: 'Schwer',
    title: 'Betonschäden: Alkali-Kieselsäure-Reaktion (AKR / "Betonkrebs")',
    question: 'Welche drei Randbedingungen müssen gleichzeitig vorliegen, damit eine schädigende Alkali-Kieselsäure-Reaktion (AKR) im Beton abläuft, und wie äußert sich das Schadensbild an Autobahnfahrbahnen?',
    moduleHint: { id: 'schadreaktionen_beton', name: 'Schadreaktionen: AKR' },
    solution: '1. **Die drei zwingenden Voraussetzungen:**\n   - **Reaktive Kieselsäure:** Alkaliempfindliche Gesteinskörnungen (z.B. Opalsandstein, Flint, gebrochene Rhyolithe/Grauwacken).\n   - **Hohe Alkalikonzentration:** Hoher Alkaligehalt im Zement bzw. in der Porenlösung ($Na_2O_{\\text{äq}} > 0{,}60\\%$ bzw. Eintrag von externen Alkalien durch Taumittel wie NaCl).\n   - **Feuchtigkeitszufuhr:** Hohe relative Feuchte im Bauteil ($> 80\\%$ r.F., Feuchtigkeitsklasse WF oder WA/WS).\n2. **Schadensbild an Fahrbahndecken:**\n   Das entstehende Alkali-Kieselsäure-Gel quillt unter Wasseraufnahme stark an und erzeugt enorme Innendrücke. Typisch ist ein **netzartiges Rissmuster (Landkartenrisse)**, das Auspressen von weißlichem Kieselgel aus den Rissen sowie Abplatzungen an Fugen und Plattenrändern (Pop-outs).'
  },
  {
    id: 't_tuutti_modell',
    difficulty: 'Mittel',
    title: 'Korrosionsschutz: Das Tuutti-Modell der Bewehrungskorrosion',
    question: 'Erläutern Sie die Phasen der Bewehrungskorrosion nach dem klassischen Modell von Tuutti (Einleitungsphase vs. Schädigungsphase). Durch welche bautechnische Maßnahme wird die Einleitungsphase maximiert?',
    moduleHint: { id: 'schutz_grundlagen', name: 'Schutz & Instandhaltung Grundlagen' },
    solution: '1. **Einleitungsphase (Initiierungsphase $t_0$):**\n   Die Bewehrung ist durch das alkalische Milieu noch passiviert (kein Massenabtrag am Stahl). Kohlendioxid (Karbonatisierungsfront) oder Chloride wandern diffusionsgesteuert von der Oberfläche durch die Betondeckung bis zum Bewehrungsstahl. Die Dauer $t_0$ hängt quadratisch von der Betondeckung ab ($t_0 \\propto c^2 / D$).\n2. **Schädigungsphase ($t_1$):**\n   Sobald die Passivierungsschicht zerstört ist, beginnt der elektrochemische Korrosionsabtrag unter Sauerstoff- und Feuchtezufuhr. Korrosionsprodukte (Rost) haben das 2- bis 6-fache Volumen des Stahls, führen zu Sprengdrücken, Längsrissen, Abplatzungen der Betondeckung und Querschnittsverlust.\n3. **Maximierung von $t_0$:**\n   Ausreichend dicke, fehlerfreie Betondeckung ($c_{\\text{nom}}$), niedriger w/z-Wert für ein dichtes Kapillargefüge, sorgfältige Nachbehandlung und rissüberbrückende Oberflächenschutzsysteme (OS).'
  },
  {
    id: 't_instandsetzung_prinzipien',
    difficulty: 'Schwer',
    title: 'Instandhaltung: Instandsetzungsprinzipien W, C, R, K (Rili-SIB) und DIN EN 1504-9',
    question: 'Nennen und vergleichen Sie die vier klassischen Instandsetzungsprinzipien bei Bewehrungskorrosion nach der früheren DAfStb-Richtlinie Schutz und Instandsetzung (Rili-SIB) und ordnen Sie sie den Prinzipien der DIN EN 1504-9 zu, auf die sich die heutige TR Instandhaltung (DIBt) stützt.',
    moduleHint: { id: 'instandhaltung', name: 'Instandhaltungsprinzipien' },
    solution: '1. **Prinzip W (Feuchtebegrenzung / Protection against Ingress):**\n   Austrocknung des Bauteils und dauerhafter Ausschluss von Feuchtigkeit durch Beschichtungen (OS-Systeme) oder hydrophobierende Imprägnierungen. Ohne Elektrolyt (Wasser) kommt die elektrochemische Korrosion zum Stillstand, selbst wenn der Beton carbonatisiert ist.\n2. **Prinzip C (Beschichtung / Coating of Reinforcement):**\n   Auftragen einer aktiven oder isolierenden Korrosionsschutzbeschichtung direkt auf den freigelegten und entrosteten Bewehrungsstahl.\n3. **Prinzip R (Repassivierung durch alkalisches Milieu):**\n   Reprofilierung des Querschnitts. Mechanisches Abtragen des schadhaften oder chloridkontaminierten Betons bis hinter die Bewehrung, Entrosten des Stahls und Wiederaufbau der Betondeckung mit kunststoffmodifiziertem Zementmörtel (PCC) oder Spritzbeton (SPCC), um die Alkalität dauerhaft wiederherzustellen.\n4. **Prinzip K (Kathodischer Korrosionsschutz / Cathodic Protection):**\n   Anlegen eines elektrischen Gleichstroms über eine Fremdstromanode (z.B. Titanmischoxidnetz auf der Oberfläche), sodass der Bewehrungsstahl zur Kathode wird und elektrochemisch nicht mehr korrodieren kann (besonders bei tiefreichendem Chlorideintrag).\n\n**Zuordnung zu DIN EN 1504-9:** R ≈ Prinzip 7 (Erhalt oder Wiederherstellung der Passivität), W ≈ Prinzip 8 (Erhöhung des elektrischen Widerstands), K ≈ Prinzip 10 (kathodischer Schutz), C ≈ Prinzip 11 (Kontrolle anodischer Bereiche).'
  },
  {
    id: 't_pren_edelstahl',
    difficulty: 'Mittel',
    title: 'Metallkorrosion: PREN-Wert & Lochfraßbeständigkeit von Edelstahl',
    question: 'In einem Hallenbad mit chlorhaltiger Atmosphäre sollen Befestigungselemente dimensioniert werden. Berechnen Sie den Wirksummenwert (Pitting Resistance Equivalent Number, PREN) für V2A (1.4301: 18% Cr, 9% Ni, kein Mo) und V4A (1.4401: 17% Cr, 11% Ni, 2,2% Mo). Warum ist V2A in Hallenbädern unzulässig?',
    moduleHint: { id: 'metallkorrosion', name: 'Metallkorrosion' },
    solution: '1. **Berechnungsformel für PREN:**\n   $$\\text{PREN} = \\%\\text{Cr} + 3{,}3 \\cdot \\%\\text{Mo} + 16 \\cdot \\%\\text{N}$$\n2. **Werte:**\n   - Für V2A (1.4301): $\\text{PREN} = 18 + 3{,}3 \\cdot 0 = 18{,}0$ (Stickstoff vernachlässigt).\n   - Für V4A (1.4401): $\\text{PREN} = 17 + 3{,}3 \\cdot 2{,}2 = 24{,}3$.\n3. **Bewertung in Hallenbädern:**\n   In chlorhaltigen Schwimmbadhallen entstehen durch Chlorgase und Feuchtigkeit extrem aggressive saure Kondensate. Bei V2A führt dies zu schlagartiger **Spannungsrisskorrosion (SpRK)** ohne Vorankündigung (Gefahr des Absturzes abgehängter Decken). Auch Standard-V4A ist für sicherheitsrelevante tragende Teile in der Schwimmhallenatmosphäre nicht zulässig; nach DIN EN 1993-1-4 mit NA bzw. abZ Z-30.3-6 sind Stähle der Korrosionsbeständigkeitsklasse CRC V (z. B. 1.4529, 1.4565) erforderlich.'
  },
  {
    id: 't_echter_hausschwamm',
    difficulty: 'Mittel',
    title: 'Holzschäden: Der Echte Hausschwamm (Serpula lacrymans)',
    question: 'Warum gilt der Echte Hausschwamm als der gefährlichste Bauholzpilz in Altbauten und welche bautechnischen Sanierungsschritte schreibt die DIN 68800-4 zwingend vor?',
    moduleHint: { id: 'holzkorrosion', name: 'Holzkorrosion & Pilze' },
    solution: '1. **Biologische Besonderheit:**\n   Der Echte Hausschwamm bildet weitverzweigte, dicke Myzelstränge (Rhizomorphen) aus, mit denen er Wasser über mehrere Meter hinweg durch trockenes Mauerwerk hindurch transportieren kann. Er kann daher selbst trockenes Holz befeuchten und abbauen (Braunfäule mit typischen tiefen Würfelbrüchen).\n2. **Sanierung nach DIN 68800-4:**\n   - Befallene Holzteile müssen bis mindestens **1,0 m über den sichtbaren Befallsrand hinaus abgeschnitten** und fachgerecht entsorgt werden.\n   - Befallenes Mauerwerk wird über den Befallsbereich hinaus freigelegt, gereinigt und mit einem dafür zugelassenen Schwammsperrmittel im Bohrlochverfahren behandelt (Abflammen ist kein Ersatz für die chemische Sperre).\n   - Ursache des Feuchtigkeitseintrags (z.B. undichte Dächer oder Rohrbrüche) muss dauerhaft beseitigt werden.'
  }
];
