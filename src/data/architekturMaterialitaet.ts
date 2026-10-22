
export interface MaterialitaetInfo {
  optikTextur: string;
  haptikOberflaeche: string;
  lichtReflexion: string;
  alterungPatina: string;
  architekturBezug: string;
}

export const ARCHITEKTUR_MATERIALITAET: Record<string, MaterialitaetInfo> = {
  gesteine: {
    optikTextur: "Unikatcharakter durch natürliche Korngefüge, Aderungen (z. B. Marmor), Spaltflächen (Schiefer) und lebendige Farbvariationen von homogenem Anthrazit (Basalt) bis zu lebhaften Erdtönen (Kalkstein, Sandstein).",
    haptikOberflaeche: "Je nach Steinmetzbearbeitung differenzierte taktile Wahrnehmung: samtig-warm bei geschliffenem/gebürstetem Sandstein, samtweich-kühl bei poliertem Marmor/Granit, rau-griffig bei gestockten, geflammten oder gespaltenen Naturwerksteinen.",
    lichtReflexion: "Polierte Hartgesteine erzeugen gerichtete Glanzspiegelungen und Tiefenbrillanz; matte, spaltraue oder scharrierte Sedimentgesteine streuen Tageslicht diffus und verleihen Fassaden plastische Schattentiefe.",
    alterungPatina: "Hohe Würde des Alterns: Bildung dezenter Schutzpatina (Kalksinter, Flechtenbeläge im Außenraum), Kantenrundung und edle Glättung an berührten Lauf- und Griffzonen ohne Festigkeitsverlust.",
    architekturBezug: "Symbol für Monumentalität, Dauerhaftigkeit und Verankerung im Ort (z. B. Schweizer Therme Vals von Peter Zumthor aus Andeerer Gneis; David Chipperfield James-Simon-Galerie Berlin)."
  },
  mauerwerk: {
    optikTextur: "Modulare Rhythmik durch Fugenbild (Kreuz-, Block-, Wilder Verband) und Formatproportionen (Reichsformat, Dünnformat, Modulformat); Farbpalette reicht von reduzierter Kohlebrand-Optik bis zu leuchtenden Terrakotta-Nuancen.",
    haptikOberflaeche: "Rau, mineralisch und trocken; taktile Differenzierung zwischen kantenscharfem Hartbrand-Klinker, lebhaft-unregelmäßigem Handformziegel und feinkörnigem Kalksandstein.",
    lichtReflexion: "Tiefe Schattenwirkung an den Fugenflanken bei schrägem Streiflicht; durch variierte Fugenausbildung (flächenbündig vs. zurückliegend) wird der Baukörper skulptural plastisch modelliert.",
    alterungPatina: "Traditionell alterungsfähig: Farbintensivierung, dezente Verwitterung von Kalkfugen; bei diffusionsoffenem Klinker edle Ausstrahlung über Jahrhunderte.",
    architekturBezug: "Archetyp tektonischer Schichtung von Karl Friedrich Schinkel (Bauakademie Berlin) über Fritz Höger (Chilehaus Hamburg) bis zu Arno Brandlhuber und Caruso St John."
  },
  mauerziegel: {
    optikTextur: "Klassischer Ziegelbrand mit lebendigem Farbspiel (Eisenoxidrot, Manganbraun, Gelbtöne) und charakteristischen Brennspuren (Schmauch, Anflammungen).",
    haptikOberflaeche: "Trockene, erdige Haptik mit feinen Kavernen, Narbungen und Schlämmresten bei Wasserstrich- und Handschlagziegeln.",
    lichtReflexion: "Matte, warme Lichtstreuung mit weicher Schattenzeichnung in Laibungen und Zierverbänden.",
    alterungPatina: "Hervorragende Alterungsbeständigkeit; Klinker bildet wetterfeste Sinterhaut, während Vormauerziegel bei guter Detailausbildung charaktervolle Witterungsspuren tragen.",
    architekturBezug: "Norddeutsche Backsteingotik, Ziegel-Expressionismus der 1920er und moderne skandinavische Wohnarchitektur (Jørn Utzon)."
  },
  kalksandstein: {
    optikTextur: "Ruhiges, homogenes, weiß-graues Fugenbild; präzise Kantenausbildung und monolithische Flächenwirkung im Sichtmauerwerk.",
    haptikOberflaeche: "Gleichmäßig sandig-feinkörnig, fest und mineralisch-kühl; feine Sandkornmatrix taktil spürbar.",
    lichtReflexion: "Sehr hohe diffuse Lichtreflexion im Innenraum, die tageslichtaufhellend und raumvergrößernd wirkt.",
    alterungPatina: "Im Außenbereich vergrauend, weshalb Kalksandstein im Fassadenbereich typischerweise verputzt oder als hinterlüftete Bekleidung geschützt wird.",
    architekturBezug: "Klassisches Konstruktionsmaterial für kosteneffizienten, minimalistischen Wohnungsbau und präzise strukturierte Industrie- und Sakralbauten."
  },
  porenbeton: {
    optikTextur: "Monolithisch-homogenes Erscheinungsbild mit mikroskopisch feiner Porenstruktur; nach außen fast immer durch Putz- oder Fassadensysteme geschützt.",
    haptikOberflaeche: "Extrem leicht, kreidig-trocken, wärmeisolierend warm im Handkontakt (geringe Wärmeeindringzahl b).",
    lichtReflexion: "Reinweiß bis hellgrau; extrem diffuse Streuung ohne jede Spiegelung.",
    alterungPatina: "Rein funktionaler Werkstoff; benötigt zwingend Witterungsschutz durch hydrophobierte Putzschichten.",
    architekturBezug: "Ideal für hochwärmedämmende, einschalige monolithische Wandaufbauten ohne Zusatzdämmung im energieeffizienten Wohnungsbau."
  },
  leichtbeton: {
    optikTextur: "Poröse, lebendige Gefügestruktur durch Blähton-, Bims- oder Blähglas-Zuschläge; architektonisch reizvoll als Dämmbeton mit offenen Poren.",
    haptikOberflaeche: "Rau, bimsartig offenporig, fühlbar leichter und wärmer als herkömmlicher Normalbeton.",
    lichtReflexion: "Diffuse, weiche Lichtreflexion; schluckt Lichtreflexe und erzeugt tiefe stoffliche Ruhe.",
    alterungPatina: "Gute Beständigkeit; monolithische Dämmbetonbauten entwickeln mit den Jahren eine wetterfeste, lebendige Natursteinoptik.",
    architekturBezug: "Monolithische Infraleichtbeton- und Dämmbeton-Villen (z. B. Entwürfe von Mike Schlaich, Atelier Kempe Thill)."
  },
  lehmstein: {
    optikTextur: "Warm-erdige Töne von Ocker über Rotbraun bis Oliv; natürliche Unschärfe und feine Fasereinschlüsse (Stroh, Hanf).",
    haptikOberflaeche: "Angenehm temperiert, samtig-weich, feuchtigkeitsregulierend und handsympathisch; strahlt natürliche Behaglichkeit aus.",
    lichtReflexion: "Vollkommen blendfreie, matte Streuung; absorbiert grelles Licht und dämpft Raumakustik spürbar.",
    alterungPatina: "Lebendiges Altern im Innenbereich; erfordert im Außenbereich konstruktiven Spritzwasserschutz ('Stiefel und Hut').",
    architekturBezug: "Pionierarchitektur des zirkulären und klimaneutralen Bauens (Martin Rauch, Anna Heringer, Lehm-Pavillons)."
  },
  putzemoertel: {
    optikTextur: "Strukturreichtum von feinstem Glättputz (Stucco Lustro, Marmormehl) bis zu rustikalem Kellenwurf-, Kratz- und Besenstrichputz.",
    haptikOberflaeche: "Variiert von seidenweich poliert bis raubeinig körnig; taktile Tiefenwirkung durch manuelle Handwerksspuren.",
    lichtReflexion: "Besenstrich- und Kratzputze brechen Streiflicht in feine Mikroschatten; polierte Kalk-Gips-Glätten reflektieren Licht schemenhaft.",
    alterungPatina: "Mineralische Silikat- und Kalkputze altern harmonisch durch natürliche Farbtonreife; organische Dispersionsputze neigen dagegen eher zu Vergrauung.",
    architekturBezug: "Klassisches Fassadenkleid der europäischen Stadtbaukunst von der Renaissance über Otto Wagner bis zu Peter Märkli."
  },
  gips: {
    optikTextur: "Lupenreine, homogene, fugenlose weiße Flächen; ermöglicht scharfe Kantenabschlüsse, Schattenfugen und skulpturale Stuckprofile.",
    haptikOberflaeche: "Pudrig-glatt bis seidenweich geschliffen, kreidefrei bei sachgerechter Grundierung, angenehm trocken und zimmerwarm.",
    lichtReflexion: "Hoher Lichtreflexionsgrad (bis zu 85%); verteilt Tageslicht optimal in tiefen Räumen und erzeugt reflexionsarme, homogene Lichtdecken.",
    alterungPatina: "Reiner Innenbaustoff; UV-stabil, altert verzugsfrei bei stabiler relativer Luftfeuchte (40-60%).",
    architekturBezug: "Voraussetzung für die moderne puristische Innenraumarchitektur und den trockenen, flexiblen Skelettausbau (Mies van der Rohe)."
  },
  kalk: {
    optikTextur: "Charakteristischer wolkenartiger, transluzenter Tiefenschmelz durch kristallines Calciumcarbonat; sanft nuancierte Weiß- und Pastellschattierungen.",
    haptikOberflaeche: "Kreidig-mineralisch bis samtig marmoriert (Tadelakt, Kalkglätte); fühlt sich atmend, trocken und feuchtigkeitsaktiv an.",
    lichtReflexion: "Halbmatte, lebendige Lichtbrechung an den Calcitkristallen, die Räumen eine natürliche Leuchtkraft verleiht.",
    alterungPatina: "Hervorragende historische Alterung: Selbstheilung von Mikrorissen durch Rekarbonatisierung bei Befeuchtung; edle Verwitterung an historischen Baudenkmälern.",
    architekturBezug: "Kernelement des baubiologischen Ausbaus und der Denkmalpflege (venezianische Spachteltechniken, marokkanischer Tadelakt)."
  },
  lehmbau: {
    optikTextur: "Erdige, ursprüngliche Materialität mit sichtbaren organischen Zuschlagfasern, Schilfmatten oder Stampflehm-Schichtungen.",
    haptikOberflaeche: "Warm, stofflich, leicht porös und handschmeichelnd; besitzt die höchste thermische Behaglichkeit aller mineralischen Baustoffe.",
    lichtReflexion: "Vollkommen blendfrei, warme Erdtöne absorbieren kühles Tageslicht und wandeln es in beruhigende Raumstimmungen.",
    alterungPatina: "Kann beliebig oft durch Wasserzugabe reaktiviert werden (Cradle-to-Cradle); im Innenraum unbegrenzt haltbar.",
    architekturBezug: "Stampflehmbauten von Martin Rauch (Kapelle der Versöhnung Berlin), Lehm-Holz-Hybridentwürfe zeitgenössischer Vorzeige-Nachhaltigkeit."
  },
  erdbau: {
    optikTextur: "Morphologie des gewachsenen Baugrunds, von plastischen Tonen über feine Sandbänke bis zu groben Schotterbetten.",
    haptikOberflaeche: "Direkte Auseinandersetzung mit der Topografie: körnig, bindig, feucht oder felsig-hart.",
    lichtReflexion: "Natürliche Bodenreflexion, bestimmt durch Feuchtigkeitsgehalt und Mineralogie.",
    alterungPatina: "Ständige geotechnische und biologische Dynamik (Vegetationsansiedlung, Konsolidation).",
    architekturBezug: "Topografische Architektur, landschaftsgebundene Einbettung, Erdhäuser (Peter Vetsch) und Geländemodellierungen."
  },
  glas: {
    optikTextur: "Absolute Transparenz, Transluzenz oder Spiegelung; je nach Eisenoxidgehalt farbneutral (Weißglas) oder mit zartem Grünstich (Floatglas).",
    haptikOberflaeche: "Vollkommen glatt, unnachgiebig, kühl und porenlos; bei Mattierung (Satinato, Sandstrahlung) seidig-weich.",
    lichtReflexion: "Maximale Transmission für Tageslichteintrag kombiniert mit scharfen Spiegelungen der Umgebung bei wechselndem Außenlicht.",
    alterungPatina: "Praktisch alterungsfrei bei gereinigter Oberfläche; UV-resistent, versprödet nicht; Dichtstoffe und Randverbünde bestimmen Systemlebensdauer.",
    architekturBezug: "Entmaterialisierung der Gebäudehülle von Kristallpalast (Paxton 1851) und Bauhaus Dessau über Glasvorhangfassaden bis zur Pariser Glaspyramide (I. M. Pei)."
  },
  stahl: {
    optikTextur: "Schlankheit und geometrische Präzision bei Walzprofilen; industrieller Zunder bei rohem Stahl; samtig-rostbraune Rostnarbigkeit bei wetterfestem Cortenstahl.",
    haptikOberflaeche: "Massiv, hart, kühl und kraftvoll; glatte Haptik bei pulverbeschichteten Profilen, raue Rosttextur bei Cortenstahl.",
    lichtReflexion: "Je nach Veredelung: Hochglänzend bis spiegelnd (Edelstahl geschliffen), seidenmatt (feuerverzinkt mit Zinkblumen) oder lichtschluckend-rostrot (Corten).",
    alterungPatina: "Cortenstahl bildet schützende Edelrost-Deckschicht; unlegierter Stahl erfordert permanenten Korrosionsschutz (Beschichtungssysteme C1 bis CX).",
    architekturBezug: "Ikonische Weitspann- und Hochhaustragwerke (Eiffelturm, Centre Pompidou von Piano & Rogers, Mies van der Rohe Neue Nationalgalerie Berlin)."
  },
  metalle: {
    optikTextur: "Edle Glanz- und Mattgrade metallischer Gebäudehüllen aus Aluminium, Zink, Kupfer, Messing oder Blei.",
    haptikOberflaeche: "Extrem präzise gefräste, gekantete oder gewalzte Oberflächen; kühl und metallisch-rein.",
    lichtReflexion: "Dynamische Interaktion mit Sonne und Himmelsfarben; von sanfter Spiegelung (eloxiertes Aluminium) bis zu samtigem Kupferschimmer.",
    alterungPatina: "Kupfer entwickelt berühmte smaragdgrüne Patina; Titanzink bildet matte blaugraue Zinkkarbonatschicht; Aluminium bleibt durch Eloxalschicht unverändert.",
    architekturBezug: "Skulpturale Fassadenarchitektur (Frank Gehry Guggenheim Bilbao in Titan, Daniel Libeskind Jüdisches Museum Berlin in Zink)."
  },
  aluminium: {
    optikTextur: "Präzise Leichtigkeit; seidenmatte Eloxaloberflächen (C0 bis C35) oder unbegrenzte Farbflexibilität durch Pulverbeschichtung.",
    haptikOberflaeche: "Kühl, samtglatt, gratfrei und formstabil.",
    lichtReflexion: "Gezielte Steuerung von diffusem Lichtschimmer bis zu scharfen Reflexen; ideal für Lamellenfassaden und Sonnenschutz.",
    alterungPatina: "Selbstpassivierende Oxidschicht garantiert dauerhafte Korrosionsfreiheit ohne Abblättern.",
    architekturBezug: "Schlanke Pfosten-Riegel-Fassaden, Fensterkonstruktionen und aerodynamische Gebäudehüllen der High-Tech-Architektur (Foster + Partners)."
  },
  kupfer: {
    optikTextur: "Faszinierender Farbwechsel über Jahrzehnte: lachsrot glänzend bei Montage → warmes Dunkelbraun → edles Malachitgrün.",
    haptikOberflaeche: "Handschmeichelnd, geschmeidig formbar bei handwerklicher Stehfalzdeckung.",
    lichtReflexion: "Warme Lichtabstrahlung im frischen Zustand, später samtig-tiefes, blendfreies Grün.",
    alterungPatina: "Bildung basischer Kupferkarbonat-Patina; gilt als Inbegriff lebendiger architektonischer Alterung mit über 100 Jahren Lebensdauer.",
    architekturBezug: "Traditionelle Sakraldächer, moderne Fassadenbekleidungen (Herzog & de Meuron Signalbox Basel)."
  },
  baustahl: {
    optikTextur: "Dunkelanthrazitfarbene Walzhaut mit Schweißnähten, Nieten oder Schraubbildern; zelebriert die Kräfteführung des Tragwerks.",
    haptikOberflaeche: "Rau-industriell, kantig und unnachgiebig schwer.",
    lichtReflexion: "Schluckt Licht im unbeschichteten Zustand; reflektiert scharf an Kanten beleuchteter Profile.",
    alterungPatina: "Ohne Beschichtung rasche Rostbildung; mit Brandschutz- und Korrosionsbeschichtungen dauerhaft stabil.",
    architekturBezug: "Sichtbare Ingenieurbaukunst, Hallentragwerke und Brückenbau (Santiago Calatrava, Schlaich Bergermann Partner)."
  },
  edelstahl: {
    optikTextur: "Zeitlose Eleganz in Kornschliff-, Bürst- oder Spiegeloptik; absolut rostfrei und makellos.",
    haptikOberflaeche: "Hygienisch-rein, kühl, porenfrei und widerstandsfähig gegen Abrieb.",
    lichtReflexion: "Kornschliff erzeugt irisierende Lichtstreifen; spiegelpoliert löst Edelstahl Gebäudekanten im Himmelslicht auf.",
    alterungPatina: "Keine Patina; bleibt über Jahrzehnte im originalen Glanzgrad erhalten.",
    architekturBezug: "Detailarchitektur, Seilnetze, Handläufe und monumentale Skulpturbauten (z. B. The Bean / Cloud Gate in Chicago von Anish Kapoor)."
  },
  zink: {
    optikTextur: "Matte, vorbewitterte blaugraue bis schiefergraue Oberfläche mit feinen handwerklichen Falznähten.",
    haptikOberflaeche: "Samtig, weich, angenehm griffig und metallisch dicht.",
    lichtReflexion: "Blendfreie, sanfte Reflexion; fügt sich harmonisch in wechselnde Himmelsstimmungen ein.",
    alterungPatina: "Hydrozinkit-Schicht heilt Kratzer selbsttätig durch Luftfeuchtigkeit und CO₂.",
    architekturBezug: "Typische Pariser Mansarddächer, skulpturale Zinkbänder im modernen Museumsbau (Libeskind)."
  },
  blei: {
    optikTextur: "Mattes, schweres Dunkelgrau; extreme Verformbarkeit an komplizierte Dachanschlüsse.",
    haptikOberflaeche: "Weich, schwer, fettig-mineralischer Griff.",
    lichtReflexion: "Vollkommen stumpf, schluckt Lichtreflexe gänzlich.",
    alterungPatina: "Bildet dichte weißgraue Bleikarbonatschicht (giftig bei direktem Abrieb).",
    architekturBezug: "Historische Denkmalbedachungen, Kirchenkuppeln und Strahlenschutzräume."
  },
  titan: {
    optikTextur: "Schillernde, champagner- bis silberfarbene Reflexe; leichte Welligkeit dünner Bleche erzeugt lebendige Lichtspiele.",
    haptikOberflaeche: "Extrem hart, kratzfest, leicht und seidenmatt.",
    lichtReflexion: "Hohe Lichtbrechung bei wechselndem Sonnenstand; changiert zwischen Gold, Silber und Himmelblau.",
    alterungPatina: "Vollkommen inert und korrosionsresistent selbst in aggressiver Meeresluft.",
    architekturBezug: "Dekonstruktivistische Monumentalarchitektur (Frank Gehry Guggenheim-Museum Bilbao)."
  },
  holz: {
    optikTextur: "Warme, organische Maserung mit Jahresringen, Astbildern und Wuchsrichtungen; jede Bohle ein Unikat von hellem Fichtenholz bis dunklem Nussbaum.",
    haptikOberflaeche: "Handsympathisch, warm (sehr geringe Wärmeeindringzahl), samtig gehobelt oder strukturiert gebürstet.",
    lichtReflexion: "Streut Licht warm und weich; verleiht Innenräumen natürliche Geborgenheit und dämpft Schallreflexionen.",
    alterungPatina: "Im Außenbereich Ausbildung einer silbergrauen Schutzschicht (Vergrauung durch UV- und Ligninabbau) bei konstruktivem Holzschutz; im Innenraum warmes Nachdunkeln.",
    architekturBezug: "Vorreiter nachhaltigen Bauens vom skandinavischen Holzskelett bis zu modernen Hochhäusern aus Brettsperrholz (CLT) wie Mjøstårnet oder Roots Hamburg."
  },
  holzwerkstoffe: {
    optikTextur: "Grafische Rhythmik: Strands bei OSB, feine Faserstruktur bei MDF, gestreifte Lamellen bei Brettschichtholz (BSH) und Kreuzlagen bei CLT.",
    haptikOberflaeche: "Glatt geschliffen, formstabil und verzugsfrei, trocken und behaglich warm.",
    lichtReflexion: "Gleichmäßige, warme Lichtstreuung; OSB erzeugt lebhaft geflecktes Licht-Schatten-Spiel.",
    alterungPatina: "Im Innenraum farbstabil; im Außenraum nur mit dauerhaftem Witterungsschutz einsetzbar.",
    architekturBezug: "Konstruktiv ehrliche Ästhetik im zeitgenössischen Ausbau und Vorfertigungsbau (Shigeru Ban, Kengo Kuma)."
  },
  asphalt: {
    optikTextur: "Dunkelanthrazitfarbene bis tiefschwarze Körnungstextur; fugenlose Fläche; im Hochbau als geschliffener Gussasphalt-Terrazzo hochästhetisch.",
    haptikOberflaeche: "Im Straßenbau rau und griffig; als geschliffener Terrazzo-Estrich spiegelglatt, fugenlos, fußwarm und elastisch im Tritt.",
    lichtReflexion: "Frischer Asphalt schluckt Licht (Sicherheitsfaktor im Straßenbau); polierter Gussasphalt reflektiert elegant mit sichtbaren Kornoberflächen.",
    alterungPatina: "Hellt unter Sonneneinstrahlung zu homogenem Grau auf; extrem dauerhaft und abriebfest.",
    architekturBezug: "Fugenlose Loftböden, Ausstellungsräume und Galerien (z. B. Kolumba-Museum Köln von Peter Zumthor)."
  },
  kunststoffe: {
    optikTextur: "Unbegrenzte Form- und Farbgebung; von glasklaren ETFE-Kissen über transluzente Polycarbonat-Stegplatten bis zu farbigen Fassadenplatten.",
    haptikOberflaeche: "Leicht, glatt, warm, flexibel bis elastisch; fugenarme Großformate.",
    lichtReflexion: "Transluzente Membranen filtern Tageslicht blendfrei und lassen Baukörper nachts als Leuchtkörper erstrahlen.",
    alterungPatina: "UV-Strahlung führt langfristig zu Verfärbung oder Versprödung; hochwertige Fluorpolymere (PTFE, ETFE) sind selbstreinigend durch Lotuseffekt.",
    architekturBezug: "Pneumatische Membranfassaden und Stadionüberdachungen (Allianz Arena München von Herzog & de Meuron, Eden Project)."
  },
  faserverbund: {
    optikTextur: "High-Tech-Gewebeoptik (Carbonfasergitter, Glasfaserrovings); ermöglicht extrem schlanke, filigrane Querschnitte.",
    haptikOberflaeche: "Glatte Harzoberfläche (Epoxid, Vinylester), extrem steif und federleicht.",
    lichtReflexion: "Tiefschwarze Lichtabsorption bei Sichtcarbon; seidenmatte Streuung bei transluzenten GFK-Paneelen.",
    alterungPatina: "Vollkommen korrosionsfrei; erfordert UV-Schutzlackierung im Außenraum.",
    architekturBezug: "Bionische Pavillons, Freiformschalen und extrem schlanke Brückentragwerke (Achim Menges ICD/ITKE Stuttgart)."
  },
  daemmstoffe: {
    optikTextur: "Faserige Wollgefüge (Steinwolle, Hanf, Holzfaser) oder geschlossenzellige Hartschaumstrukturen (EPS, XPS, PIR); meist in der Hülle verborgen.",
    haptikOberflaeche: "Weich, nachgiebig und extrem warm (niedrigste Wärmeleitfähigkeit aller Baustoffe).",
    lichtReflexion: "Diffus streuend; bei Sicht-Holzfaserdämmplatten im Innenraum angenehm schallschluckend und blendfrei.",
    alterungPatina: "Dauerhaft geschützt in der Bauteilschicht; bestimmt den thermischen Komfort und die Energieeffizienz des Baukörpers.",
    architekturBezug: "Ermöglicht Passivhaus- und Plusenergie-Architektur mit behaglichen, zugfreien Raumoberflächen."
  },
  zement: {
    optikTextur: "Feinstes mineralisches Pulver (Grauzement mit Klinkerasche, Weißzement); bildet das formgebende Bindeglied für jede Betonarchitektur.",
    haptikOberflaeche: "Trocken, pudrig-alkalisch; transformiert mit Wasser zu einem fugenlosen Steinmonolithen.",
    lichtReflexion: "Bestimmt den Grundfarbton des Betons maßgeblich von kühlem Zementgrau bis zu leuchtendem Weiß.",
    alterungPatina: "Basis für die generationenlange Dauerhaftigkeit und Karbonatisierung von Massivbauten.",
    architekturBezug: "Das Rückgrat moderner Infrastruktur- und Hochbauikonen vom Römischen Reich bis zu Le Corbusier."
  },
  beton: {
    optikTextur: "Flüssiger Stein: Übernimmt jedes Detail der Schalungshaut (gehobelte sägerohe Bretter, glatte Schaltafeln, strukturierte Elastomer-Matrizen); sichtbar geordnete Fugen- und Schalungsanker-Raster.",
    haptikOberflaeche: "Von samtweich poliert bis steinmetzmäßig rau (gestockt, sandgestrahlt, gesäuert); kühl, monolithisch und schwer.",
    lichtReflexion: "Sichtbeton spiegelt sanft bei nichtsaugenden Schalungen; diffuse, weiche Lichtführung an matten Holzschalungsflächen.",
    alterungPatina: "Entwickelt unter Witterungseinfluss eine lebendige, wettergeprägte Patina; erfordert saubere Wasserführung an Tropfkanten gegen Schmutzfahnen.",
    architekturBezug: "Brutalismus, Sichtbeton-Moderne und puristische Meisterwerke von Tadao Ando (Kirche des Lichts), Louis Kahn und Peter Zumthor."
  },
  bitumen: {
    optikTextur: "Pechschwarz, samtglänzend im Neuzustand, wasserdicht verschmolzene Bahnenüberdeckungen mit Schiefereinstreuung auf Dächern.",
    haptikOberflaeche: "Viskoelastisch, zäh, klebrig bei Wärme, fest bei Kälte.",
    lichtReflexion: "Schluckt Sonnenlicht weitgehend; dient im Dachaufbau als wärmeabsorbierende Schutzebene.",
    alterungPatina: "Oberflächliche Photooxidation schützt tieferliegende Schichten; Bestreuung mit Schiefersplitt schützt vor UV-Degradation.",
    architekturBezug: "Das unsichtbare Schutzschild moderner Flachdächer, Tiefgaragen und expressiver Gründachlandschaften."
  }
};
