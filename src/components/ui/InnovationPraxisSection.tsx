import React from 'react';
import { Lightbulb, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { FormulaText } from './FormulaText';

interface Entry {
  title: string;
  subtitle?: string;
  description: string;
  pitfallOrFact?: string;
  standard?: string;
}

interface ModuleData {
  title: string;
  examples: Entry[];
  innovations: Entry[];
}

const DATABASE: Record<string, ModuleData> = {
  bp_beton: {
    title: 'Beton (Frisch-/Festbeton)',
    examples: [
      {
        title: 'Fugenlose Industriebodenplatte',
        subtitle: 'Praxis-Szenario',
        description: 'Herstellung einer hochbelastbaren Hallen-Bodenplatte (C30/37). Durch den kombinierten Einsatz von Stahlfasern zur Rissbreitenbeschränkung und Schwindreduzierern konnte auf Bewegungsfugen im Raster verzichtet werden.',
        pitfallOrFact: 'Gefahr von Frühschwindrissen bei unzureichender Nachbehandlung. Das Aufbringen einer feuchten Vliesabdeckung für mindestens 7 Tage ist obligatorisch.',
        standard: 'DIN 1045-2 / DIN EN 206'
      },
      {
        title: 'Massige Gründungssohle im Schleusenbau',
        subtitle: 'Praxis-Szenario',
        description: 'Betonage eines 3,0 m dicken Bauteils. Zur Begrenzung der Hydratationswärme-Entwicklung wurde ein zementoptimierter fließfähiger Massenbeton mit CEM III/B (Hüttensandzement) und Flugasche verwendet.',
        pitfallOrFact: 'Der Temperaturunterschied zwischen dem heißen Kern und der kühleren Außenluft darf 20 Kelvin nicht überschreiten, da sonst thermische Eigenspannungsrisse entstehen.',
        standard: 'DAfStb-Richtlinie Massige Bauteile'
      }
    ],
    innovations: [
      {
        title: 'Bio-Selbstheilender Beton',
        description: 'Einmischen von Mikrokapseln, die Sporen des Bakteriums *Bacillus pseudofirmus* und Nährstoffe enthalten. Tritt ein Riss auf und dringt Wasser ein, erwachen die Bakterien, verstoffwechseln Lactat zu Calciumcarbonat (Kalkstein) und dichten Risse bis zu 0,8 mm Breite autogen ab.',
        standard: 'Forschungsprojekte TU Delft'
      },
      {
        title: 'CO₂-mineralisierter Transportbeton',
        description: 'Gezieltes Einblasen von recyceltem Kohlenstoffdioxid in gasförmiger Form in den Mischer während der Frischbetonherstellung. Das CO₂ reagiert mit Calciumionen zu Nano-Calciumcarbonatkristallen, was die Druckfestigkeit erhöht und den Klinkerfaktor (Zementanteil) verringert.',
        standard: 'CarbonCure-Technologie / Nachhaltigkeitsguthaben'
      }
    ]
  },
  bp_betonfertigteile: {
    title: 'Betonfertigteile',
    examples: [
      {
        title: 'Elementmauerwerk (Hohlwand-Prinzip) im Wohnungsbau',
        subtitle: 'Praxis-Szenario',
        description: 'Einsatz zweischaliger, werkseitig hergestellter Betonplatten mit eingebauter Gitterträgerbewehrung. Die Montage erfolgt per Kran. Nach dem Ausrichten der Wände wird der Hohlraum mit erdfeuchtem bzw. fließfähigem Ortbeton verfüllt.',
        pitfallOrFact: 'Der hydrostatische Frischbetondruck beim Verfüllen darf die Belastbarkeit der werkseitigen Verbindungsstellen nicht überschreiten. Ein abschnittsweises Einbringen (max. 1,0 m Steighöhe/Stunde) ist einzuhalten.',
        standard: 'DIN EN 1992-1-1 / DIN 1045'
      },
      {
        title: 'Weit gespannte Spannbetonträger für Logistikhallen',
        subtitle: 'Praxis-Szenario',
        description: 'Vorgefertigte Dach-Binder aus vorgespanntem Beton mit sofortigem Verbund. Durch den optimierten Litzenzug wird der Baustoff Beton ideal ausgenutzt, wodurch Durchhang und Schwingungsneigung drastisch sinken.',
        pitfallOrFact: 'Garantierte Transportsicherung erforderlich: Spannbetonträger dürfen beim Transport und Kranzug niemals auf den Kopf gestellt oder seitlich gekippt werden.',
        standard: 'DIN EN 13369 / DIN EN 1168'
      }
    ],
    innovations: [
      {
        title: 'Infrarot-Sensorik und RFID zur Härteprüfung',
        description: 'In das Fertigteil eingelassene Funk-Sensoren messen online die Wärmeentwicklung der Hydratation. Aus dem zeitlichen Temperaturverlauf errechnen mathematische Algorithmen die tatsächliche Druckfestigkeit in Echtzeit. Das erlaubt eine minutengenaue Optimierung des Entschalungs- und Vorspannprozesses.',
        standard: 'Industrie 4.0 im Betonwerk'
      },
      {
        title: 'Glasfaser-verstärkter UHPC an Fassadentafeln',
        description: 'Einsatz von extrem hochfestem Beton (UHPC) mit reaktiven Feinststoffen. Filigrane Verkleidungstafeln mit Dicken von nur 15 bis 20 mm widerstehen enormen Winddruck- und Windsauglasten. Dies spart bis zu 70 % des Transportgewichts und der mineralischen Ressourcen ein.',
        standard: 'Zulassung im Einzelfall (ZiE) / DIN EN 12467'
      }
    ]
  },
  bp_betonwaren: {
    title: 'Betonwaren',
    examples: [
      {
        title: 'Ökologisches Sickerpflaster im Parkplatzbau',
        subtitle: 'Praxis-Szenario',
        description: 'Verlegung von haufwerksporigem Beton-Pflaster mit hoher Wasserdurchlässigkeit (> 540 l/(s*ha)). Diese Bauweise ermöglicht eine direkte Versickerung von Niederschlagswasser vor Ort.',
        pitfallOrFact: 'Kolmationsgefahr: Feinsande und Reifenabrieb können die Poren langfristig zusetzen. Eine regelmäßige Hochdruckreinigung des Fugenbereiches verlängert die Sickerleistung.',
        standard: 'FGSV-Merkblatt für versickerungsfähige Verkehrsflächen'
      },
      {
        title: 'Spezial-Bordsteine für barrierefreie ÖPNV-Haltestellen',
        subtitle: 'Praxis-Szenario',
        description: 'Speziell abgerundete, weiße Buskapsteine aus hochfestem, tausalzbeständigem Beton (XF4), an denen Reifen beschädigungsarm entlanggleiten können.',
        pitfallOrFact: 'Erfordert hohe Abriebfestigkeit (Verschleißklasse I nach DIN V 18078).',
        standard: 'DIN 18040-3 Barrierefreies Bauen'
      }
    ],
    innovations: [
      {
        title: 'Stickoxid-abbauende Titandioxid-Vorsatzschichten',
        description: 'In den Vorsatzbeton eingemischtes Titandioxid (TiO₂) fungiert als Photokatalysator. Unter UV-Lichteinstrahlung (Sonnenlicht) werden toxische Stickoxide (NOₓ) aus Abgasen in harmlose und wasserlösliche Nitrate (NO₃⁻) umgewandelt und mit dem Regenwasser abgewaschen.',
        standard: 'Photokatalytisch aktive Pflastersteine nach TX Active'
      },
      {
        title: 'Kratzfeste Solar-Verbundpflastersteine',
        description: 'Pflasterelemente, deren Oberfläche aus kratzfestem, hoch-berstfestem Spezial-Sicherheitsglas besteht. Darunter befinden sich robuste PV-Dünnschichtmodule und integrierte LED-Lichtbänder zur dynamischen Wegeleitung bei Nacht.',
        standard: 'Smart Urban Flooring / PV-Straße'
      }
    ]
  },
  bp_mauerwerk: {
    title: 'Mauerwerk',
    examples: [
      {
        title: 'Schallschutz-Wohnungstrennwand aus Kalksandstein',
        subtitle: 'Praxis-Szenario',
        description: 'Errichtung einer hoch-schalldämmenden Wand im Mehrfamilienhaus. Der Einsatz von massiven Kalksand-Plansteinen (Rohdichteklasse 2.0) im Dünnbettverfahren sichert den geforderten Schallschutz.',
        pitfallOrFact: 'Schallbrücken durch Mörteltaschen oder ungenügenden Wandanschluss (Entkopplung) unbedingt vermeiden.',
        standard: 'DIN EN 1996 (Eurocode 6) / DIN 4109'
      },
      {
        title: 'Zweischaliges Verblendmauerwerk an Küstenstandorten',
        subtitle: 'Praxis-Szenario',
        description: 'Ausführung einer schlagregensicheren Klinkerfassade. Die Vorsatzschale wird über bauaufsichtlich zugelassene Edelstahl-Drahtanker (Werkstoff 1.4401 oder 1.4571) mechanisch mit der tragenden Hintermauerung verbunden.',
        pitfallOrFact: 'Vergesst die Ablauf- und Belüftungsöffnungen im Fußpunktbereich sowie die Tropfscheibe auf den Ankermitten nicht.',
        standard: 'DIN EN 1996 mit NA'
      }
    ],
    innovations: [
      {
        title: 'Ziegel mit integriertem Vakuum-Dämmkern (VIP)',
        description: 'Hochloch-Planziegel, deren Hohlräume industriell mit hochwirksamen Vakuum-Isolationspaneelen (VIP) bestückt sind. Dies ermöglicht Passivhaus-taugliche Außenwände mit Wärmeleitfähigkeiten von $\\lambda \\approx 0,05$ W/(mK) ohne zusätzliche WDVS-Außendämmung.',
        standard: 'DIBt-Zulassungen dämmstoffgefüllter Planziegel'
      },
      {
        title: 'Carbonfaser-Mauerwerksspannbänder',
        description: 'Hoch-zugfeste Bänder aus carbonfaserverstärktem Kunststoff (CFK), die flach in die Lagerfugen eingelegt werden. Sie erhöhen die Erdbeben- und Scherfestigkeit von unbewehrtem Mauerwerk drastisch und reduzieren Risse an statischen Übergängen.',
        standard: 'DIN EN 1996-1-1 Nationaler Anhang'
      }
    ]
  },
  bp_dach_fassade: {
    title: 'Dach & Fassade',
    examples: [
      {
        title: 'Trapezblech-Warmdach einer Industrie-Produktionshalle',
        subtitle: 'Praxis-Szenario',
        description: 'Tragkonstruktion aus Stahl-Trapezprofilen, versehen mit einer Bitumen-Dampfsperrbahn, einer hocheffizienten PIR-Hartschaumdämmung und einer mechanisch befestigten FPO-Dachbahn zur Abdichtung.',
        pitfallOrFact: 'Sorgfältige Lagesicherung gegen Windsog erforderlich. Berechnung nach DIN EN 1991-1-4.',
        standard: 'Flachdachrichtlinie / DIN 18531'
      },
      {
        title: 'Vorgehängte Hinterlüftete Fassade (VHF) mit Faserzement',
        subtitle: 'Praxis-Szenario',
        description: 'Montage von großformatigen, durchgefärbten Faserzementplatten auf einer Aluminium-Unterkonstruktion. Das VHF-Prinzip trennt den Wetterschutz mechanisch von der Dämmung.',
        pitfallOrFact: 'Der freie Lüftungsquerschnitt (min. 200 cm²/Meter Fassadenfuß) darf durch Laub oder Schmutz nicht blockiert werden.',
        standard: 'DIN 18516-1'
      }
    ],
    innovations: [
      {
        title: 'Building Integrated Photovoltaics (BIPV)',
        description: 'Solarmodule im Gewand von Schieferplatten, Ziegeln oder Glasfassaden. Durch verbesserte Dünnschichttechnologie und antireflektierende Strukturgläser erzeugen auch geneigte Fassadenflächen hocheffizient Strom, ohne das architektonische Erscheinungsbild zu stören.',
        standard: 'DIN EN 50583'
      },
      {
        title: 'Algen-Bio-Fassadenelemente zur Energieerzeugung',
        description: 'Einbau doppelwandiger Glaselemente, in denen Mikroalgen in einem Nährstoffkreislauf wachsen. Diese absorbieren Sonnenenergie, binden direkt CO₂ und wachsen rasant. Die Algenmasse wird kontinuierlich abgeerntet und in Biogas/Strom umgewandelt; gleichzeitig dienen die Elemente als steuerbarer Sonnenschutz.',
        standard: 'BIQ House Referenz Hamburg'
      }
    ]
  },
  bp_trockenbau: {
    title: 'Trockenbau',
    examples: [
      {
        title: 'F90Brandschutz-Trennwand im Krankenhausausbau',
        subtitle: 'Praxis-Szenario',
        description: 'Krankenhauskabinenausbau mit einer Doppelständer-Metallunterkonstruktion, zweilagig beidseitig beplankt mit 12,5 mm Gips-Feuerschutzplatten (Type DF). Die Hohlraumdämmung besteht aus nichtbrennbarer Steinwolle mit Schmelzpunkt $\\ge 1000^\\circ\\text{C}$.',
        pitfallOrFact: 'Sicherheitsrelevanter Mangel: Steckdosen und Rohrdurchführungen dürfen nicht ungeschützt gegenüberliegend positioniert werden, sondern müssen brandschutztechnisch gekapselt sein.',
        standard: 'DIN 4102-4 / DIN EN 1364-1'
      },
      {
        title: 'Feuchtraumwand in einer Wellnessanlage',
        subtitle: 'Praxis-Szenario',
        description: 'Sanitärausbau mit feuchteunempfindlichen, zementgebundenen Bauplatten, montiert auf korrosionsschutzbeschichteten Metallprofilen (C4-Korrosionsschutzqualität).',
        pitfallOrFact: 'Gipskartonplatten (selbst hydrophobierte grüne GKBI) versagen bei dauerhafter Spritzwasserbelastung durch Schimmel und Quellung.',
        standard: 'DIN 18181 / DIN 18534'
      }
    ],
    innovations: [
      {
        title: 'Phasenwechselmaterialien (PCM) im Trockenbau',
        description: 'In den Gipskern eingebettete Mikrokapseln mit Paraffin-Wachsen. Steigt die Raumtemperatur über 23°C, schmilzt das Wachs im Inneren latent und speichert enorme Wärmemengen passiv. Kühlt es nachts ab, erstarrt das PCM und gibt die Wärme wieder frei - wirkt wie eine massive Betonwand zur Temperaturpufferung.',
        standard: 'PCM-Gipskartonplatten / Passivhaus-Technologie'
      },
      {
        title: 'Formaldehyd-abbauende Gipsplatten',
        description: 'Mineralische Spezialwirkstoffe im Gipsgefüge binden organische Luftschadstoffe (VOCs) und insbesondere Formaldehyd chemisch dauerhaft an sich. Die Schadstoffe werden irreversibel in inerte Substanzen aufgespalten und verbessern das Innenraumklima spürbar.',
        standard: 'Aktive VOC-abbauende Gipsplattentechnologie'
      }
    ]
  },
  bp_putz_estrich: {
    title: 'Putz & Estrich',
    examples: [
      {
        title: 'CAF-Heizestrich auf Trennlage',
        subtitle: 'Praxis-Szenario',
        description: 'Einbau eines Calciumsubat-Fließestrichs (CAF) über einer warmwassergeführten Fußbodenheizung. Der flüssige Einbau garantiert ein hohlraumfreies Umschließen der Heizrohre und damit optimalen Wärmeübergang.',
        pitfallOrFact: 'Die Restfeuchte (Belegreife) muss vor dem Aufbringen von Parkett oder Fliesen zwingend mit der CM-Methode gemessen werden (Grenzwert < 0,3 CM-% bei beheiztem CAF).',
        standard: 'DIN 18560 / DIN EN 13813'
      },
      {
        title: 'Klassischer Sanierputz bei aufsteigender Feuchtigkeit',
        subtitle: 'Praxis-Szenario',
        description: 'Sanierung eines feuchten Kellergewölbes im historischen Altbau. WTA-Sanierputz weist ein extrem hohes, wasserabweisendes Porenvolumen auf, in welchem Salze ohne Oberflächenabplatzung auskristallisieren können.',
        pitfallOrFact: 'Sanierputz heilt keine Ursachen! Er verzögert nur die Schadensbilder. Eine zusätzliche Horizontalsperre ist oft zwingend erforderlich.',
        standard: 'WTA-Merkblatt 2-9'
      }
    ],
    innovations: [
      {
        title: 'Aerogel-Hochleistungsdämmputz',
        description: 'Ein Dämmputz, dessen mineralische Matrix mit Silizium-Aerogel-Granulat angereichert ist. Erreicht eine überragende Wärmeleitfähigkeit von $\\lambda \\approx 0,028$ W/(mK). Dies ermöglicht die exzellente energetische Sanierung von krummen, denkmalgeschützten Fassaden bei vollständiger Erhaltung der Konturen.',
        standard: 'Fixit 222 Aerogel Dämmputz / EMPA Schweiz'
      },
      {
        title: 'Selbstreinigender bionischer Silikonharzputz',
        description: 'Putzbeschichtung mit mikrostrukturierter, hydrophober Oberfläche, nachempfunden dem Lotuseffekt. Regenwasser zieht Schmutzpartikel, Staub und Algensporen rückstandsfrei mit sich. Dies reduziert das Algenrisiko auf gedämmten Außenwänden ohne den Zusatz Biozid-Sondermülls.',
        standard: 'StoColor Dryonic Technologie'
      }
    ]
  },
  bp_abdichtung: {
    title: 'Abdichtungen',
    examples: [
      {
        title: 'Bauwerksabdichtung im Grundwasser (Weiße Wanne mit FBV)',
        subtitle: 'Praxis-Szenario',
        description: 'Erdberührtes Kellergeschoss im stauenden Sickerwasser. Um ein Hinterlaufen der Betonsohle im Schadensfall auszuschließen, wurde eine Frischbetonverbundfolie (FBV) auf der Sauberkeitsschicht verlegt, die sich beim Betonieren mechanisch im Zementleim verkrallt.',
        pitfallOrFact: 'Beschädigungen der FBV-Folie durch Bewehrungsverlegung und spitze Abstandshalter müssen durch Schutzvliese verhindert werden.',
        standard: 'DIN 18533 / DBV-Merkblatt Frischbetonverbundfolien'
      },
      {
        title: 'Injektionsschlauch-Abdichtung in der Arbeitsfuge',
        subtitle: 'Praxis-Szenario',
        description: 'Einbau eines perforierten Injektionsschlauchs im Kalt-Betonierstoß zwischen Bodenplatte und Kellerwand. Bei späterem Feuchteeintritt wird über Packer hochflüssiges Polyurethanharz injiziert.',
        pitfallOrFact: 'Der Schlauch muss flach aufliegen und darf beim Einrütteln des Wandbetons nicht aufschwimmen.',
        standard: 'DIN V 18073 / WU-Richtlinie DAfStb'
      }
    ],
    innovations: [
      {
        title: 'Smart Leakage Detection im Flachdachaufbau',
        description: 'Sensortechnik, bei der ein leitfähiges Gittervlies direkt unter der Abdichtungsbahn verlegt wird. Durch mikrofeine Widerstandsmessung kann das Leckortungssystem die genaue Schadstelle im Rastermaß von weniger als 15 cm direkt an eine Gebäude-Cloud übermitteln.',
        standard: 'Humidry / Sensor-integrierte Flachdachanlagen'
      },
      {
        title: 'Bitumenfreie reaktive Bauwerksabdichtung (FPD)',
        description: 'Schnelle, flexible polymermodifizierte Dickbeschichtungen (FPD), die lösungsmittelfrei und UV-beständig sind. Sie härten temperaturunabhängig durch bauchemische Vernetzung extrem schnell aus und überbrücken Risse weitaus flexibler als klassisches Bitumen.',
        standard: 'DIN 18533 (Aufnahme als neuer Standard)'
      }
    ]
  },
  bp_daemmung: {
    title: 'Dämmstoffe',
    examples: [
      {
        title: 'Gefälledämmung auf einem flachen Parkdeck',
        subtitle: 'Praxis-Szenario',
        description: 'Verlegung von druckfesten PIR-Hartschaumplatten mit werkseitig eingeschnittenem Gefälle von 2 % zur sicheren Entwässerung der Parkflächen.',
        pitfallOrFact: 'Die Platten müssen untereinander hohlraumfrei gestoßen und gegen Abscheren infolge dynamischer Pkw-Bremslasten gesichert werden.',
        standard: 'DIN EN 13165 / Flachdachrichtlinie'
      },
      {
        title: 'Einblas-Kerndämmung im zweischaligen Verblendmauerwerk',
        subtitle: 'Praxis-Szenario',
        description: 'Energetische Sanierung eines Wohngebäudes aus den 1970er Jahren. Durch bestehende Luftschichtanker hindurch wird hydrophobiertes EPS-Granulat oder Steinwollflocken lückenlos eingeblasen.',
        pitfallOrFact: 'Hindernisse in der Hohlschicht (Mörtelbrücken, Bauschutt) führen zu punktuellen Wärmebrücken und folglich Schimmelrisiko.',
        standard: 'DIN 4108-10 / GEG'
      }
    ],
    innovations: [
      {
        title: 'Vakuum-Isolationspaneele (VIP)',
        description: 'Paneele mit einem porösen Kieselsäurenkern, der unter Vakuum verschweißt ist. Erreicht Spitzenwerte von $\\lambda \\approx 0,007$ W/(mK). Dadurch lassen sich Passivhausdämmungen bei Balkonen oder Altbaunischen realisieren, bei denen nur 2-3 cm Platz zur Verfügung stehen.',
        standard: 'Zulassung durch das DIBt'
      },
      {
        title: 'Biologische Pilz-Myzel-Dämmplatten',
        description: 'Wachsender Bio-Dämmstoff der Zukunft. Landwirtschaftliche Abfallstoffe (z.B. Stroh, Hanfschalen) werden mit Pilzmyzelen geimpft. Das Myzel durchwächst das organische Substrat in wenigen Tagen im Dunkeln zu einer stabilen, faserigen Platte. Nach dem Backen (Inaktivierung) ist das Material hervorragend wärme- und schallmindernd und schwer entflammbar.',
        standard: 'Cradle-to-Cradle Gold / Kreislauf-Zertifikat'
      }
    ]
  },
  bp_befestigung: {
    title: 'Befestigungstechnik',
    examples: [
      {
        title: 'Nachträgliche Bewehrungsanschlüsse im Ingenieurbau',
        subtitle: 'Praxis-Szenario',
        description: 'Verbindung eines neuen Brückenkappe-Abschnitts mit dem Bestandsbauwerk. Es werden ca. 30 cm tiefe Bohrlöcher erstellt, staubfrei gesaugt und Bewehrungsstäbe mit Epoxidharz-Injektionsmörtel kraftschlüssig eingeklebt.',
        pitfallOrFact: 'Absoluter Montagefehler: Lochreinigung vergessen. Staub im Bohrloch senkt die Verbundspannung um bis zu 80 %!',
        standard: 'DIN EN 1992-1-1 / TR 023 (EOTA)'
      },
      {
        title: 'Konsolenbefestigung im gerissenen Beton',
        subtitle: 'Praxis-Szenario',
        description: 'Verankerung schwerer Stahlkonsolen in der Betonzugzone einer Deckenplatte. Zum Einsatz kommen bauaufsichtlich zugelassene, rissgeeignete Bolzenanker aus Edelstahl A4.',
        pitfallOrFact: 'Niemals Standard-Spreizdübel verwenden, da diese bei Rissöffnung den Halt verlieren.',
        standard: 'Eurocode 2 Teil 4 (DIN EN 1992-4)'
      }
    ],
    innovations: [
      {
        title: 'Injektionspatronen mit temperaturgesteuertem Farbumschlag',
        description: 'Spezielle Zweikomponenten-Harzkartuschen, die während des Einpressvorgangs blau gefärbt sind. Sobald die bauaufsichtlich geforderte Mindest-Aushärtezeit (abhängig von der Untergrundtemperatur) erreicht ist, schlägt die Farbe in Hellgrau um. Dies verhindert verfrühtes Belasten.',
        standard: 'Patentierte Befestigungssysteme'
      },
      {
        title: 'Smarte Lastüberwachungsschrauben (Sensor-Anker)',
        description: 'Stahldübel mit innenliegendem Mikro-Piezo-Sensor und Funkmodul. Sie messen kontinuierlich die tatsächliche Vorspannkraft und die einwirkende Last. Kritische Lastüberschreitungen oder Lockerungen durch dynamische Beanspruchung werden direkt an das Instandhaltungs-Leitsystem gefunkt.',
        standard: 'Smart Fastening Systems / IoT im Bauingenieurwesen'
      }
    ]
  },
  bp_klebstoffe: {
    title: 'Kleb- & Dichtstoffe',
    examples: [
      {
        title: 'Strukturelle Scheibenverklebung (Structural Glazing)',
        subtitle: 'Praxis-Szenario',
        description: 'Befestigung schwerer Isolierglasscheiben auf einer Aluminium-Unterkonstruktion mittels hoch-reißfester, UV-beständiger 2-Komponenten-Silikonklebstoffe.',
        pitfallOrFact: 'Verlust der Trageigenschaft bei falscher Vorbehandlung (Primer). Die Verarbeitung darf nur von zertifizierten Fachbetrieben ausgeführt werden.',
        standard: 'ETAG 002 / DIN EN 13022'
      },
      {
        title: 'Sanitärfugen-Erneuerung in öffentlichen Duschen',
        subtitle: 'Praxis-Szenario',
        description: 'Entfernen schimmelpilzbelasteter Altfugen und Neuverfugen mit essigsäure- bzw. neutral-härtendem Premium-Sanitärsilikon.',
        pitfallOrFact: 'Dreiflankenhaftung unbedingt durch das Einlegen einer PE-Hinterfüllschnur verhindern, das elastische Band darf nur an den beiden Fliesenflanken kleben.',
        standard: 'DIN 18540 / IVD-Merkblatt Nr. 3'
      }
    ],
    innovations: [
      {
        title: 'Debonding-on-Demand (Lösbare Klebeverbindungen)',
        description: 'Um ein sortenreines Recycling beim Rückbau zu garantieren, wurden Klebstoffe entwickelt, die Nanopartikel enthalten. Werden diese Partikel über ein elektromagnetisches Wechselfeld (Induktion) oder UV-Speziallicht angeregt, erwärmen sie sich lokal blitzartig und lösen die Klebeverbindung rückstandsfrei.',
        standard: 'Cradle-to-Cradle Designleitfäden / Recyclingklasse'
      },
      {
        title: 'Feuchtigkeitstolerante Bio-Proteinkleber (Muscheleffekt)',
        description: 'Synthetischer Klebstoff auf Basis der Aminosäure DOPA, welche die Miesmuschel nutzt, um unter Wasser extrem haftfeste Verbindungen an nassen Felsen aufzubauen. Erlaubt dauerhafte, structural-glazing-taugliche Verklebungen auf feuchtem Beton ohne Primer.',
        standard: 'Bionische Baustoffforschung'
      }
    ]
  },
  bp_farben_lacke: {
    title: 'Farben & Lacke',
    examples: [
      {
        title: 'OS 8-Betonoberflächenschutz in einer Tiefgarage',
        subtitle: 'Praxis-Szenario',
        description: 'Beschichtung stark beanspruchter Pkw-Fahrflächen. Auftrag einer starren Epoxidharz-Grundierung mit Einstreuung von Quarzsand zur Rutschhemmung und Kopfversiegelung.',
        pitfallOrFact: 'Gefahr von Blasenbildung bei rückseitiger Feuchtigkeitsbelastung aus dem Erdreich. Untergrundfeuchte vorab messen (< 4,0 Masse-%).',
        standard: 'DIN EN 1504-2 / DAfStb Instandsetzungsrichtlinie'
      },
      {
        title: 'Verkieselnde Silikatfarbe auf historischem Kalkmörtel',
        subtitle: 'Praxis-Szenario',
        description: 'Fassadenanstrich an einem Baudenkmal. Reine Silikatfarbe verbindet sich durch chemische Reaktion (Verkieselung) unlösbar mit dem mineralischen Putzuntergrund.',
        pitfallOrFact: 'Reine Silikatfarbe kann nicht auf Dispersionsaltanstrichen oder Gips aufgetragen werden, da dort kein Reaktionspartner vorhanden ist.',
        standard: 'DIN 18363 Abs. 2.4.1 (Silikatfarben)'
      }
    ],
    innovations: [
      {
        title: 'Hydrophobe Lotuseffekt-Fassadenfarben',
        description: 'Bionische Fassadenbeschichtungen mit mikrofeiner, nanostrukturierter Topographie. Wassertropfen kugeln sofort ab und reißen sämtliche Schmutzpartikel, Staub und Ruß einfach mit sich. Dies garantiert trockene Fassaden und entzieht Algen- und Pilzsporen ohne giftige Biozide den Nährboden.',
        standard: 'DIN EN ISO 4628'
      },
      {
        title: 'Graphen-Nanoplättchen im Korrosionsschutz',
        description: 'Einarbeitung von nanometerdünnen Graphenplättchen in Industrielacke. Die hexagonalen Kohlenstoffgitter bilden eine unüberwindbare, Labyrinth-artige Barriere für Wasserdampf und Chloridionen, wodurch herkömmlicher Rostschutz um ein Vielfaches übertroffen wird.',
        standard: 'DIN EN ISO 12944 (Korrosionsschutzklassen)'
      }
    ]
  },
  bp_betonzusatzmittel: {
    title: 'Betonzusatzmittel',
    examples: [
      {
        title: 'Herstellung eines selbstverdichtenden Betons (SVB)',
        subtitle: 'Praxis-Szenario',
        description: 'Für ein filigranes Bauteil mit extrem dichter Bewehrung wurde ein SVB konzipiert. Durch die präzise Kombination von Polycarboxylatether-Fließmitteln (PCE Generation) und Stabilisierern fließt der Beton hohlraumfrei allein unter Schwerkraftwirkung.',
        pitfallOrFact: 'Extreme Empfindlichkeit gegenüber minimalen Wassergehaltsschwankungen. Eine kontinuierliche Feuchtemessung der Gesteinskörnung ist unverzichtbar.',
        standard: 'DIN EN 206 / SVB-Richtlinie des DAfStb'
      },
      {
        title: 'Monolithischer Betoniervorgang im Tunnelbau (Verzögerer)',
        subtitle: 'Praxis-Szenario',
        description: 'Einsatz eines Erstarrungsverzögerers (VZ) im Transportbeton, um das Ansteifen des Betons über eine Transportzeit von 4 Stunden hinweg sicher zu unterbinden und kalte Arbeitsfugen im Bauteilquerschnitt zu verhindern.',
        pitfallOrFact: 'Bei tiefen Baustellentemperaturen kann sich der Verzögerungseffekt unvorhergesehen verlängern, was zu übermäßig langem Ausschalwiderstand führt.',
        standard: 'DIN EN 934-2'
      }
    ],
    innovations: [
      {
        title: 'C-S-H-Keimbildner zur Frühfestigkeitssteigerung',
        description: 'Zusatzmittel mit fein dispergierten, synthetischen Calcium-Silikat-Hydrat-Nanokristallen. Diese fungieren im frischen Beton als Kristallisationskeime (Keimbildner). Sie beschleunigen das natürliche Kristallwachstum massiv, verdoppeln die Festigkeit nach 12 Stunden und erlauben eine drastische Verkürzung der Zyklen im Fertigteilwerk.',
        standard: 'C-S-H-Keimbeschleuniger (z. B. Master X-Seed-Technologie als Beispiel) / Nanoforschung'
      },
      {
        title: 'Kristallines Bulk-Abdichtungsadditiv',
        description: 'In den Mischer eindosierte, reaktive Wirkstoffe, die latent im erhärteten Beton schlummern. Tritt später Feuchtigkeit ein, reagieren diese Wirkstoffe sofort und züchten unlösliche, nadelförmige Kristalle im Porensystem heran. Dies dichtet Risse bis 0,4 mm selbsttätig unter anstehendem hydrostatischem Druck ab.',
        standard: 'Integral Crystalline Waterproofing (ICW)'
      }
    ]
  },
  bp_holzprodukte: {
    title: 'Holzprodukte',
    examples: [
      {
        title: 'Brettsperrholz (BSP / CLT) im mehrgeschossigen Wohnungsbau',
        subtitle: 'Praxis-Szenario',
        description: 'Tragendes Wohnungsgerüst in Holz-Massivbauweise. Kreuzweise flach verleimte Nadelholzlamellen bilden großformatige Wand- und Deckenelemente mit exzellenter Dimensionsstabilität.',
        pitfallOrFact: 'Feuchteschutz während der Rohbauphase: Unbedingt vor stehendem Wasser (Pfützenbildung) auf montierten Deckenflächen schützen.',
        standard: 'DIN EN 16351 / Zulassungen nach ETA'
      },
      {
        title: 'Brettschichtholz-Weitspannträger im Hallenbadbau',
        subtitle: 'Praxis-Szenario',
        description: 'Auslegung gebogener Satteldachträger aus Brettschichtholz (BSH-GL24h). Holz ist im Vergleich zu Stahl vollkommen unempfindlich gegenüber chloridreichen, feuchten Hallenbadatmosphären.',
        pitfallOrFact: 'Auf Querzugspannungen im gekrümmten Bereich achten. Gegebenenfalls sind Querzugverstärkungen (eingeklebte Gewindestangen) erforderlich.',
        standard: 'DIN EN 14080'
      }
    ],
    innovations: [
      {
        title: 'Flüssigmodifiziertes Holz (Kebony & Thermoholz)',
        description: 'Biologische Imprägnierung heimischer Weichhölzer (z.B. Kiefer) mit Furfurylalkohol (Bio-Abfallprodukt aus der Landwirtschaft) und anschließende thermo-chemische Aushärtung. Die Zellstruktur verdichtet sich irreversibel; das Holz erlangt Dimensionsstabilität und biologische Resistenzwerte auf dem Niveau edler Tropenhölzer.',
        standard: 'Dauerhaftigkeitsklasse 1 nach DIN EN 350-2'
      },
      {
        title: 'Verdichtetes Super-Wood mit Stahl-Zugfestigkeiten',
        description: 'Holz wird chemisch teil-entholzigt (Entfernung von Lignin) und anschließend bei $100^\\circ\\text{C}$ auf ein Drittel seiner Ursprungdicke heißgepresst. Die verbleibenden Cellulose-Fasern formen dichteste Wasserstoffbrücken aus. Das Ergebnis ist ein Baustoff mit höherer spezifischer Zugfestigkeit als Titan bei nur einem Bruchteil des Gewichts.',
        standard: 'Materialforschung an der University of Maryland'
      }
    ]
  },
  bp_kunststoffe: {
    title: 'Kunststoffe im Bauwesen',
    examples: [
      {
        title: 'Flexible Trinkwasserrohre aus vernetztem Polyethylen',
        subtitle: 'Praxis-Szenario',
        description: 'Haustechnischer Leitungsbau mit PE-Xa Rohren. Die Vernetzung der Molekülketten sorgt für extreme Beständigkeit gegenüber Spannungsrissen und Inkrustationen.',
        pitfallOrFact: 'Gefahr von Knickbildung bei zu kleinen Biegeradien. Ein Mindestradius von 5 x Außendurchmesser ist einzuhalten.',
        standard: 'DIN EN ISO 15875'
      },
      {
        title: 'Stegmehrfachplatten aus bruchzähem Polycarbonat',
        subtitle: 'Praxis-Szenario',
        description: 'Erstellung einer Dachlichtband-Anlage im Hallenbau. Polycarbonat (PC) bietet exzellente Lichtausbeute, geringes Eigengewicht und hohe Schlagregensicherheit.',
        pitfallOrFact: 'UV-Beanspruchung beachten. Nur Platten mit werkseitig co-extrudierter UV-Schutzschicht im Außenbereich verlegen, da PC sonst versprödet.',
        standard: 'DIN EN 16153 / DIN 4102-1'
      }
    ],
    innovations: [
      {
        title: 'Bio-basierte und reststoff-recycelte Bau-Profile',
        description: 'Kunststoffprofile für Fenster oder Fassaden, bei denen das Rohöl vollständig durch bio-basiertes PLA (Polymilchsäure aus Pflanzenabfällen) oder aus Industrie-Abfallströmen recyceltes Hart-PVC ersetzt wird. Ein Cradle-to-Cradle Goldstatus belegt die geschlossene Recycelbarkeit beim Rückbau.',
        standard: 'DIN EN ISO 14021'
      },
      {
        title: 'Gefüllte Carbonfaser-Verbundprofile (CFK)',
        description: 'Extrudierte Hohlprofile mit hochfestem GFK/CFK-Skelettkern. Sie weisen ein Elastizitätsmodul auf, das mit Stahl konkurriert, sind jedoch vollkommen witterungs- und korrosionsresistent und ideal für Fußgängerbrücken oder Geländerbaugruppen in Meeresnähe geeignet.',
        standard: 'Allgemeine Bauaufsichtliche Zulassung (abZ)'
      }
    ]
  },
  bp_mineralisch: {
    title: 'Mineralische Werkstoffe',
    examples: [
      {
        title: 'Hinterlüftete Steinplattenfassade aus Granit',
        subtitle: 'Praxis-Szenario',
        description: 'Fassadenverkleidung mit 30 mm dicken, polierten Granitplatten. Die Platten werden über Edelstahl-Dornanker in den Plattenkanten mit einer statisch dimensionierten Aluminium-Unterkonstruktion verbunden.',
        pitfallOrFact: 'Die Tiefe der Dornlöcher muss exakt kalibriert sein, um Ausbrüche an den Rändern infolge von Windlastschwingungen zu verhindern.',
        standard: 'DIN 18516-3'
      },
      {
        title: 'Historische Ziegelfassadensanierung im Altbau',
        subtitle: 'Praxis-Szenario',
        description: 'Austausch frostgeschädigter Mauersteine. Die neuen Ersatzziegel wurden bezüglich Porosität und Saugverhalten exakt auf den historischen Trasskalkeinsatz abgestimmt.',
        pitfallOrFact: 'Einsatz von modernen Zementmörteln führt unweigerlich zu Salzabplatzungen am weicheren historischen Ziegelgefüge.',
        standard: 'WTA-Merkblätter zur Ziegelinstandsetzung'
      }
    ],
    innovations: [
      {
        title: 'Transluzentes Naturstein-Laminat',
        description: 'Nur 2-3 mm dünne Natursteinfurniere (Marmor, Schiefer), die auf ein hochfestes Glasfaser-Polyestergewebe laminiert sind. Im Verbund mit LED-Hintergrundbeleuchtung entstehen faszinierende transluzente Lichteffekte bei minimalem Materialverbrauch.',
        standard: 'Materialdesign / Leichtbau'
      },
      {
        title: 'Bakteriell induzierte CO₂-negative Bio-Mauersteine',
        description: 'Mineralische Bausteine, die bei normaler Raumtemperatur ohne energieintensiven Brennofen gepresst werden. Bakterien im Gemisch scheiden biochemisch Calciumcarbonat (CaCO₃) aus, welches die Sandkörner fest verkittet. Die Steine besitzen die Festigkeit von Kalksandsteinen, weisen jedoch eine hervorragend grüne Ökobilanz auf.',
        standard: 'Biomineralisation / BioMasonry'
      }
    ]
  },
  bp_metallisch: {
    title: 'Metallische Werkstoffe',
    examples: [
      {
        title: 'Titanzink-Stehfalzdeckung einer Villen-Dachlandschaft',
        subtitle: 'Praxis-Szenario',
        description: 'Eindeckung eines Daches mit Titanzink-Scharen auf einer strukturierten Trennlage. Die Trennlage stellt sicher, dass Schwitzwasser auf der Unterseite des Zinkblechs schadfrei ablaufen kann.',
        pitfallOrFact: 'Thermische Längenänderung der Zinkscharen unbedingt berücksichtigen: Schiebe- und Festhaften nach Richtlinie platzieren.',
        standard: 'Fachregeln des Klempnerhandwerks / DIN EN 501'
      },
      {
        title: 'Edelstahlbewehrung im Gesimsbereich von Brückenbauwerken',
        subtitle: 'Praxis-Szenario',
        description: 'Betonage der Brückenkappe, die höchster Belastung durch Frost-Tausalz-Gemische ausgesetzt ist. Um Lochfraßkorrosion dauerhaft auszuschließen, wurde gerippter Betonstahl aus Edelstahl (Werkstoff 1.4362 / 1.4571) verbaut.',
        pitfallOrFact: 'Hohe Materialkosten; der Edelstahl muss im statischen Rechenmodell getrennt bewertet werden, ist jedoch hochgradig wartungsfrei.',
        standard: 'DIN EN 10088-5 / Zulassung DIBt'
      }
    ],
    innovations: [
      {
        title: 'Formgedächtnis-Legierungen (SMA - Shape Memory Alloys)',
        description: 'Der Einsatz von Nitinol (Nickel-Titan) im Brückenbau ermöglicht eine aktive Vorspannung von Risszonen. Nachträglich eingebrachte SMA-Stäbe geraten unter Induktionserhärtung unter Zugspannung, was den Beton dehnungsfrei zusammendrückt und bestehende Risse schließt.',
        standard: 'Forschungsprojekte EMPA Schweiz'
      },
      {
        title: 'Zink-Magnesium (ZMg) Hochleistungskorrosionsschutz',
        description: 'Stahlbleche mit einer innovativen Zink-Magnesium-Legierungsbeschichtung. Bei Schnittkantenbeschädigungen wandern Magnesiumionen im Elektrolytfilm aktiv zum Kratzer und bilden dort eine unlösliche, weiße Deckschicht aus, welche den Rostprozess wirksam blockiert.',
        standard: 'DIN EN 10346'
      }
    ]
  },
  bp_stahlbauprofile: {
    title: 'Stahlbauprofile',
    examples: [
      {
        title: 'Fachwerkträger aus kreisrunden Hohlprofilen im Hallenbau',
        subtitle: 'Praxis-Szenario',
        description: 'Konstruktion eines weitgespannten, optisch anspruchsvollen Dachtragwerks für ein Terminalgebäude. Der Träger wurde komplett aus geschweißten Rohrprofilen des Baustahls S355H gefertigt.',
        pitfallOrFact: 'Schweißnahtprüfung an den Rohrknotenpunkten ist zwingend erforderlich (zerstörungsfreie Prüfung z.B. per Ultraschall).',
        standard: 'DIN EN 1993-1-8 (Eurocode 3 Kapsel Anschlüsse)'
      },
      {
        title: 'Verbundstützen im Hochhausbau',
        subtitle: 'Praxis-Szenario',
        description: 'Verwendung massiver HEB-Träger aus S460-Baustahl, die im Inneren einer runden Betonstütze einbetoniert sind. Diese Konstruktion vereint die extreme Knicksteifigkeit des Betons mit der schadensfreien Zugelastizität des Konstruktionsstahls.',
        pitfallOrFact: 'Genaue Abstimmung des Betonierens und Rüttelns im dichten Profilinneren erforderlich.',
        standard: 'DIN EN 1994 (Eurocode 4)'
      }
    ],
    innovations: [
      {
        title: 'Green Steel (Wasserstoff-direktreduzierter H2-Stahl)',
        description: 'Stahlbauprofile der neuesten Generation, deren Eisenerzreduktion im Primärwerk nicht über Kokskohle im Hochofen, sondern mit grünem Wasserstoff in Direktreduktionsanlagen geschieht. Dies reduziert die Scope-1-Herstellungsemissionen um über 95 %, bei exakt identischen werkstofflichen Eigenschaften des S355/S460 Profilstahls.',
        standard: 'LCA-Guthaben / DIN EN 15804 EPD'
      },
      {
        title: 'Ultra-hochfeste Baustähle (S960)',
        description: 'Innovative Profilstähle mit Streckgrenzen von über 960 MPa. Durch thermomechanisches Walzen (TM) weisen sie höchste Zähigkeit auf. Dies ermöglicht eine Reduktion der Bauteilquerschnitte um bis zu 40 % gegenüber S355, was den Transportaufwand und die Schweißzeiten massiv senkt.',
        standard: 'DIN EN 1993-1-12'
      }
    ]
  }
};

interface Props {
  moduleKey: string;
}

export function PraxisTabContent({ moduleKey }: Props) {
  const data = DATABASE[moduleKey];
  if (!data || !data.examples || data.examples.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-l-4 border-shiraz pl-4 py-1">
        <h3 className="text-lg font-bold text-text-main">Praktische Schadensfälle &amp; Ausführungsszenarien</h3>
        <p className="text-xs text-home-grau mt-0.5">Ergänzendes Expertenwissen für Studium, Lehre und Baupraxis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {data.examples.map((item, index) => (
          <div key={index} className="bg-white border border-home-grau/20 p-5 rounded-xl shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/10 pb-3">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider">{item.subtitle || 'Praxis-Szenario'}</span>
              {item.standard && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono font-semibold border border-slate-200">
                  {item.standard}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-text-main text-sm mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </div>

            {item.pitfallOrFact && (
              <div className="bg-amber-50/60 border border-amber-200/50 p-4 rounded-xl text-sm leading-relaxed flex gap-2.5 items-start mt-auto">
                <AlertCircle size={16} className="text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-amber-950 font-bold block mb-0.5">Fallstrick / Expertenhinweis:</strong>
                  <span className="text-amber-900">{item.pitfallOrFact}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InnovationTabContent({ moduleKey }: Props) {
  const data = DATABASE[moduleKey];
  if (!data || !data.innovations || data.innovations.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <h3 className="text-lg font-bold text-text-main">Marktinnovationen &amp; Zukunftstrends</h3>
        <p className="text-xs text-home-grau mt-0.5">Innovative Werkstoffe, Fertigungsverfahren und zukünftige Entwicklungsschritte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {data.innovations.map((item, index) => (
          <div key={index} className="bg-amber-50/[0.04] border border-amber-500/20 p-5 rounded-xl shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/10 pb-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> Zukunftstechnologie
              </span>
              {item.standard && (
                <span className="text-xs bg-amber-50/50 text-amber-800 border border-amber-200/50 px-2.5 py-1 rounded-md font-mono">
                  {item.standard}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-text-main text-sm mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const InnovationPraxisSection: React.FC<Props> = ({ moduleKey }) => {
  const data = DATABASE[moduleKey];

  if (!data) return null;

  return (
    <div className="mt-8 border border-shiraz/35 bg-white/75 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-shiraz to-shiraz/90 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-300 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase">Praxis &amp; Innovation</h3>
            <p className="text-[10px] text-white/85">Ergänzendes Expertenwissen für Studium, Lehre und Praxis</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Modul: {data.title}
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Säule 1: Praxisbeispiele */}
        <div className="space-y-4 pb-4 lg:pb-0">
          <div className="flex items-center gap-2 text-shiraz font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Praktische Schadensfälle &amp; Ausführungsszenarien</span>
          </div>

          <div className="space-y-4">
            {data.examples.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-xs">{item.title}</h4>
                  {item.standard && (
                    <span className="text-[9px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {item.standard}
                    </span>
                  )}
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  <FormulaText text={item.description} />
                </div>
                {item.pitfallOrFact && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[10px] leading-relaxed flex gap-1.5 items-start">
                    <AlertCircle size={12} className="text-amber-700 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-amber-950 font-bold">Fallstrick / Expertenhinweis:</strong>{' '}
                      <span className="text-amber-900"><FormulaText text={item.pitfallOrFact} /></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Säule 2: Produktinnovationen */}
        <div className="space-y-4 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 text-shiraz font-bold text-xs uppercase tracking-wider">
            <Lightbulb size={16} className="text-amber-500" />
            <span>Marktinnovationen &amp; Zukunftstrends</span>
          </div>

          <div className="space-y-4">
            {data.innovations.map((item, index) => (
              <div key={index} className="bg-amber-50/[0.12] border border-amber-550/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-[#A3113E] text-xs flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500 shrink-0" />
                    {item.title}
                  </h5>
                  {item.standard && (
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                      {item.standard}
                    </span>
                  )}
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  <FormulaText text={item.description} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
