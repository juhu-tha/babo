import React from 'react';
import { 
  Scale, 
  Layers, 
  FlaskConical, 
  Microscope, 
  Mountain, 
  Package, 
  Droplets, 
  ShieldCheck, 
  Trees, 
  Calculator, 
  Thermometer, 
  Leaf, 
  Monitor, 
  Building2, 
  Trash2, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  HardHat,
  Network,
  Cpu,
  Flame,
  Volume2,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Award,
  Box,
  Compass,
  FileText
} from 'lucide-react';

export interface OverviewStep {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  iconName: string;
  keyFacts: string[];
  normOrFormula?: string;
  color: string;
}

export interface InterconnectionItem {
  from: string;
  to: string;
  relation: string;
  causeEffect: string;
}

export interface ModuleOverviewData {
  title: string;
  tagline: string;
  leitfrage: string;
  corePrinciples: {
    title: string;
    description: string;
    takeaway: string;
  }[];
  systemicExplanation: string;
  zusammenhaengeText: string;
  graphicalPipelineTitle: string;
  graphicalPipelineDesc: string;
  steps: OverviewStep[];
  interconnections: InterconnectionItem[];
  practicalInsight: {
    title: string;
    desc: string;
  };
}

export const MODULE_OVERVIEWS: Record<string, ModuleOverviewData> = {
  grundlagen: {
    title: 'Bauingenieur-Grundlagen',
    tagline: 'Mathematische, physikalische und chemische Basiskonzepte für Tragwerk und Baustoffkunde',
    leitfrage: 'Wie wird aus mikroskopischen Naturgesetzen ein verlässliches makroskopisches Sicherheits- und Bemessungskonzept für Bauwerke?',
    corePrinciples: [
      {
        title: 'Skalenhierarchie: Von Nano bis Makro',
        description: 'Jede mechanische Eigenschaft eines Baustoffs (Zugfestigkeit, E-Modul, Wärmedehnung) ist eine direkte Folge des atomaren Bindungstyps (kovalent, metallisch, ionisch) und des Mikrogefüges (Kristallgitter, Porengeometrie).',
        takeaway: 'Ohne Verständnis der mikroskopischen Gefügephänomene bleiben Festigkeitswerte reine Zufallsparameter.'
      },
      {
        title: 'Semiprobabilistische Sicherheit (Eurocode 0)',
        description: 'Lasten und Materialfestigkeiten streuen stochastisch. Das Sicherheitskonzept trennt Einwirkungen Ed von Widerständen Rd und sichert durch Teilsicherheitsbeiwerte γ und Kombinationsbeiwerte ψ eine Zielzuverlässigkeit ab: Zuverlässigkeitsindex β = 3,8 für 50 Jahre in der üblichen Schadensfolgeklasse CC2 – das entspricht einer Versagenswahrscheinlichkeit von rund 7 · 10⁻⁵.',
        takeaway: 'Bemessung bedeutet nicht absolute Lastgleichheit, sondern stochastisch abgesicherte Grenztragfähigkeit: Ed ≤ Rd.'
      },
      {
        title: 'Stoffübergreifende Bilanzierung',
        description: 'Kräftegleichgewichte, Massenerhaltung, Wärmeleitung und Diffusionskinetiken gehorchen materialunabhängigen Differentialgleichungen, die durch spezifische Materialkonstitutivgesetze geschlossen werden.',
        takeaway: 'Mechanik und Bauchemie liefern die universellen Erhaltungssätze für alle Disziplinen.'
      }
    ],
    systemicExplanation: 'Die Grundlagen verbinden formale Maßeinheiten (SI-System), stoffliche Kenngrößen (Rohdichte, Porosität, Elastizität) und bauchemische Reaktionsgleichungen zu einem universellen Vokabular. Erst wenn Studierende verstehen, wie eine Kraft pro Fläche (N/mm² = MPa) aus molekularen Bindungsenergien resultiert und wie Streuungen normativ über 5%-Quantile abgefangen werden, können sie Tragwerke in Beton, Stahl, Holz oder Mauerwerk sicher entwerfen.',
    zusammenhaengeText: 'Das Modul schlägt die Brücke zwischen reiner Naturwissenschaft und konstruktiver Ingenieurpraxis. Aus der Bauchemie (Korrosion, Hydratation) folgen die Kennwerte der Baustoffkunde; aus den Kennwerten folgen die Materialgesetze der Mechanik; und aus diesen wiederum resultieren die Bemessungsformeln des Eurocodes.',
    graphicalPipelineTitle: 'Kausalkette der Grundlagen: Vom Molekül zum Nachweis',
    graphicalPipelineDesc: 'Interaktiver 4-Stufen-Weg von den mikroskopischen Naturgesetzen zur normgerechten Tragwerksbemessung:',
    steps: [
      {
        step: '1',
        title: 'Mikroebene',
        subtitle: 'Atombindung & Chemie',
        desc: 'Ionen-, Metall- & kovalente Gitterstrukturen, Hydratphasenbildung, chemische Stabilität.',
        iconName: 'FlaskConical',
        keyFacts: ['Gitterdefekte', 'Hydratationsenergie', 'Elektronegativität'],
        normOrFormula: 'CaO + H_2O \\rightarrow Ca(OH)_2',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '2',
        title: 'Mesoebene',
        subtitle: 'Gefüge & Porenraum',
        desc: 'Porenverteilung (Gel-, Kapillar- & Luftporen), Roh- vs. Reindichte, Wasseraufnahmekinetik.',
        iconName: 'Layers',
        keyFacts: ['Porosität P', 'Dichteverhältnis', 'Sättigungsgrad'],
        normOrFormula: 'P = 1 - \\frac{\\rho}{\\rho_R}',
        color: 'from-blue-500 to-blue-600'
      },
      {
        step: '3',
        title: 'Makroebene',
        subtitle: 'Materialkennwerte',
        desc: 'Druck- und Zugfestigkeiten, Elastizitätsmodul, Querdehnzahl ν und thermischer Ausdehnungskoeffizient.',
        iconName: 'Scale',
        keyFacts: ['Spannung-Dehnung', 'E-Modul E', 'Bruchdehnung \\varepsilon_u'],
        normOrFormula: '\\sigma = E \\cdot \\varepsilon',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        step: '4',
        title: 'Nachweisebene',
        subtitle: 'Eurocode-Sicherheitskonzept',
        desc: 'Semiprobabilistische Bemessung nach DIN EN 1990: Grenzzustände GZT & GZG unter Teilsicherheitsbeiwerten.',
        iconName: 'ShieldCheck',
        keyFacts: ['Zuverlässigkeitsindex β', 'Teilsicherheitsbeiwerte γ', 'Kombinationsbeiwerte ψ'],
        normOrFormula: 'E_d \\le R_d',
        color: 'from-rose-500 to-rose-600'
      }
    ],
    interconnections: [
      { from: 'Mikroebene', to: 'Mesoebene', relation: 'Struktursteuerung', causeEffect: 'Hydratphasen und Kristallwachstum formen die Porengrößenverteilung und die Grenzflächenzone (ITZ).' },
      { from: 'Mesoebene', to: 'Makroebene', relation: 'Kennwertgenerierung', causeEffect: 'Ein geringeres Kapillarporenvolumen steigert E-Modul und Druckfestigkeit (z. B. Potenzansatz nach Powers über das Gel-Raum-Verhältnis).' },
      { from: 'Makroebene', to: 'Nachweisebene', relation: 'Quantilfestlegung', causeEffect: 'Aus Labor-Mittelwerten und Standardabweichungen wird das charakteristische 5%-Quantil f_k für den Sicherheitsnachweis abgeleitet.' }
    ],
    practicalInsight: {
      title: 'Der rote Faden für Prüfungen & Praxis',
      desc: 'Merke: Kein Kennwert existiert isoliert. Wer die Porosität kennt, kann E-Modul, Wärmeleitfähigkeit und Frostbeständigkeit vorhersagen. Wer das semiprobabilistische Sicherheitskonzept verstanden hat, versteht jeden Eurocode gleichermaßen.'
    }
  },

  labor: {
    title: 'Labor, Sensorik & Analytik',
    tagline: 'Praxisnahe Prüfverfahren, moderne Bauwerksdiagnostik und statistische Versuchsplanung',
    leitfrage: 'Wie werden streuende Messdaten aus Probekörpern, Bohrkernen und Sensoren zu belastbaren Festigkeits- und Konformitätsaussagen?',
    corePrinciples: [
      {
        title: 'Repräsentativität schlägt Probenanzahl',
        description: 'Ein Versuchsresultat ist nur so gut wie die Entnahmeplanung (Prüfbereiche nach DIN EN 13791, Entnahme nach DIN EN 12504-1). Systematische Fehler durch ungleiche Feuchte, Bohrrichtungsartefakte oder Randstörungen wiegen schwerer als zufällige Streuungen.',
        takeaway: 'Planung und Probenkonditionierung entscheiden über Validität oder Fehlurteil.'
      },
      {
        title: 'Zerstörungsfrei (ZfP) kalibriert zerstörend',
        description: 'Zerstörungsfreie Verfahren (Rückprallhammer, Ultraschall, Radar) liefern flächige Trendprofile, müssen jedoch an realen zerstörenden Bohrkernen kalibriert werden.',
        takeaway: 'ZfP detektiert Inhomogenitäten – der zerstörende Bruch liefert die absolute Skalierung.'
      },
      {
        title: 'Statistische Quantilsicherheit',
        description: 'Für Festigkeiten ist nicht der Mittelwert fm maßgebend, sondern das 5-%-Quantil fck = fm − k_n·s. Kleine Probenreihen erhalten einen größeren Faktor k_n (DIN EN 1990, Anhang D).',
        takeaway: 'Große Streuungen und kleine Stichproben senken den charakteristischen Wert deutlich ab.'
      }
    ],
    systemicExplanation: 'Das Modul bildet das experimentelle Rückgrat des Bauingenieurwesens. Von der repräsentativen Probenahme vor Ort über die Belastungsprüfung in der servohydraulischen Prüfmaschine bis zur Auswertung mittels Gauß-Verteilung und Ausreißertests nach Grubbs wird der gesamte Prüfpfad abgebildet.',
    zusammenhaengeText: 'Das Labor verbindet Theorie und Realität: Es prüft, ob die in der Baustoffkunde versprochenen Kennwerte im realen Bauteil tatsächlich ankommen und ob die Konformitätskriterien nach DIN EN 206 erfüllt sind.',
    graphicalPipelineTitle: 'Der Prüf- und Bewertungskreislauf im Labor',
    graphicalPipelineDesc: 'Von der Bohrkernentnahme bis zur Konformitätsentscheidung nach DIN EN 12504 / DIN EN 206:',
    steps: [
      {
        step: '1',
        title: 'Erkundung',
        subtitle: 'Probenahme & ZfP',
        desc: 'Bewehrungssuche per Wirbelstrom/Radar, Entnahmeplan für Bohrkerne, Rückprallhammer.',
        iconName: 'Microscope',
        keyFacts: ['Zerstörungsfreie Ortung', 'Kernbohrung d=100mm', 'Feuchteversiegelung'],
        normOrFormula: 'DIN EN 12504-1',
        color: 'from-sky-500 to-sky-600'
      },
      {
        step: '2',
        title: 'Präparation',
        subtitle: 'Konditionierung',
        desc: 'Planschleifen oder Abgleichen der Lastflächen, Maßkontrolle, Lagerung nach Prüfnorm.',
        iconName: 'Wrench',
        keyFacts: ['h/d = 1 oder 2', 'Ebenheit 0,0006 · d', 'Lagerung nach DIN EN 12390-2'],
        normOrFormula: 'DIN EN 12390-1',
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        step: '3',
        title: 'Prüfmaschine',
        subtitle: 'Bruchversuch & Sensorik',
        desc: 'Kraft- und wegaufnehmende Belastung (Druck, Spaltzug, Haftzug), Rissfortschrittsmessung.',
        iconName: 'Activity',
        keyFacts: ['Belastungsrate 0,6 ± 0,2 MPa/s', 'DMS / Laser-Wegaufnehmer', 'Spannungs-Dehnungskurve'],
        normOrFormula: 'f_c = \\frac{F_{max}}{A_c}',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '4',
        title: 'Statistik',
        subtitle: 'Konformitätsnachweis',
        desc: 'Berechnung von Mittelwert, Standardabweichung, 5%-Quantil fck und Konformitätskriterien.',
        iconName: 'Calculator',
        keyFacts: ['Normalverteilung', 'Ausreißertest nach Grubbs', 'Konformitätskriterium 1 & 2'],
        normOrFormula: 'f_{ck} = f_m - k_n \\cdot s',
        color: 'from-rose-500 to-rose-600'
      }
    ],
    interconnections: [
      { from: 'Erkundung', to: 'Präparation', relation: 'Geometriekorrektur', causeEffect: 'Abweichende Schlankheiten h/d erfordern eine Umrechnung; DIN EN 13791 ordnet h/d = 1 dem Würfel und h/d = 2 dem Zylinder zu.' },
      { from: 'Präparation', to: 'Prüfmaschine', relation: 'Spannungsfeld', causeEffect: 'Unebene Lastflächen erzeugen Kantenpressungen und führen zu deutlich zu niedrigen Bruchlasten.' },
      { from: 'Prüfmaschine', to: 'Statistik', relation: 'Datenfeed', causeEffect: 'Einzelprüfwerte speisen die Stichprobenvarianz; je kleiner die Streuung s, desto höher die nutzbare charakteristische Festigkeit.' }
    ],
    practicalInsight: {
      title: 'Praxistipp für die Baustellenabnahme',
      desc: 'Bei kleinen Gruppen (n = 3) entscheidet jeder Einzelwert mit (Kriterium 2: f_ci ≥ f_ck − 4 N/mm²). Rückstellproben erlauben eine Nachprüfung bei Prüffehlern; bestehen Zweifel an der Festigkeit im Bauwerk, wird an Bohrkernen nach DIN EN 13791 bewertet.'
    }
  },

  baustoffe: {
    title: 'Baustoffkunde im Detail',
    tagline: 'Das gesamte Spektrum mineralischer, metallischer und organischer Werkstoffe',
    leitfrage: 'Wie wählt man für ein Bauteil den werkstofflich optimalen Kompromiss aus Festigkeit, Dauerhaftigkeit, Kosten und CO2-Fußabdruck?',
    corePrinciples: [
      {
        title: 'Die 4 Werkstoffhauptgruppen',
        description: 'Alle Baustoffe unterteilen sich in: Mineralische Bindemittel/Gesteine (hohe Druck-, geringe Zugfestigkeit), Metalle (duktil, hochfest, korrosionsempfindlich), Organische Werkstoffe wie Holz/Polymere (anisotrop, leicht, brennbar) und Verbundwerkstoffe (synergetisch kombiniert).',
        takeaway: 'Kein Werkstoff kann alles; Tragwerke leben von gezielter Materialpaarung.'
      },
      {
        title: 'Dichte-Festigkeits-Korrelation',
        description: 'Im Allgemeinen skaliert die mechanische Druckfestigkeit überproportional mit der Reindichte und sinkt drastisch mit zunehmender Porosität (Ryshkewitch-Gleichung).',
        takeaway: 'Höhere Porosität bedeutet exzellente Wärmedämmung, aber dramatischen Festigkeitsverlust.'
      },
      {
        title: 'Umwelt-Interaktionsdynamik',
        description: 'Baustoffe sind keine statischen Festkörper, sondern reagieren kontinuierlich mit Feuchte, CO2, Chloriden und Temperaturzyklen (Quellen, Schwinden, Karbonatisierung).',
        takeaway: 'Materialauswahl ist immer auch Dauerhaftigkeitsauswahl über Jahrzehnte.'
      }
    ],
    systemicExplanation: 'Dieses Modul ist die fundamentale Material-Enzyklopädie des Bauingenieurs. Es systematisiert Zemente, Kalke, Gipse, Mauersteine, Gläser, Bauhölzer, Baustähle und Kunststoffe anhand ihrer chemischen Zusammensetzung, Fertigungsverfahren und bautechnischen Leistungsgrenzen.',
    zusammenhaengeText: 'Die Baustoffkunde liefert das Materialwissen für Betontechnologie, Massivbau, Holzbau und Schadensanalyse: Erst wer weiß, warum gebrannter Gips bei Feuchtigkeit quillt und warum hochfester Stahl versprödungsgefährdet ist, kann Bauschäden im Keim ersticken.',
    graphicalPipelineTitle: 'Das Materialuniversum: Struktureller Stammbaum',
    graphicalPipelineDesc: 'Klassifizierung der Baustoffe nach chemisch-physikalischer Natur und Tragfunktion:',
    steps: [
      {
        step: '1',
        title: 'Mineralisch',
        subtitle: 'Gesteine & Bindemittel',
        desc: 'Zement, Kalk, Gips, Naturstein, Mauerziegel, Beton. Hohe Druckfestigkeit, mineralischer Brandwiderstand A1.',
        iconName: 'Mountain',
        keyFacts: ['Sprödbruch', 'Karbonatisierung', 'Wärmespeicherfähig'],
        normOrFormula: 'DIN EN 197 / DIN EN 459',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '2',
        title: 'Metallisch',
        subtitle: 'Stahl, Alu & Guss',
        desc: 'Betonstahl B500B, Baustahl S235–S460, Edelstahl, Aluminium. Hohe Duktilität, plastische Verformungsreserven.',
        iconName: 'ShieldCheck',
        keyFacts: ['Streckgrenze f_y', 'Duktilitätsmaß f_t/f_y', 'Korrosionsschutz'],
        normOrFormula: 'DIN 488 / DIN EN 10025',
        color: 'from-slate-600 to-slate-700'
      },
      {
        step: '3',
        title: 'Organisch',
        subtitle: 'Holz & Polymere',
        desc: 'Nadel- & Laubholz, Brettschichtholz, Dämmstoffe (EPS, PUR), Bitumen, Kunststoffe. Leicht, hygroskopisch, brennbar.',
        iconName: 'Trees',
        keyFacts: ['Anisotropie', 'Gleichgewichtsfeuchte', 'CO2-Senke Holz'],
        normOrFormula: 'DIN EN 338 / DIN EN 14080',
        color: 'from-emerald-600 to-emerald-700'
      },
      {
        step: '4',
        title: 'Verbunde',
        subtitle: 'Hybride Hochleistung',
        desc: 'Stahlbeton, Carbonbeton, Faserverbundwerkstoffe (CFK/GFK), Glas-Metall-Fassaden. Kombination von Druck & Zug.',
        iconName: 'Layers',
        keyFacts: ['Verbundspannungen', 'Rissüberbrückung', 'Gewichtseinsparung'],
        normOrFormula: '\\tau_b = f(s)',
        color: 'from-purple-600 to-purple-700'
      }
    ],
    interconnections: [
      { from: 'Mineralisch', to: 'Verbunde', relation: 'Druckmatrix', causeEffect: 'Mineralische Stoffe liefern die kostengünstige, druckfeste und brandbeständige Matrix.' },
      { from: 'Metallisch', to: 'Verbunde', relation: 'Zugbewehrung', causeEffect: 'Stahlbewehrung kompensiert die Sprödigkeit des Betons und ermöglicht weitgespannte Biegetragwerke.' },
      { from: 'Organisch', to: 'Verbunde', relation: 'Leichtbau & Ökologie', causeEffect: 'Holz-Beton-Verbunddecken vereinen die Schallschutzmasse des Betons mit der CO2-Speicherung des Holzes.' }
    ],
    practicalInsight: {
      title: 'Die goldene Baustoffregel',
      desc: 'Ein Baustoff versagt fast nie an der reinen Überlastung, sondern fast immer an unverstandenen hygrothermischen Zwangspannungen, falschem Verbund oder chemischer Unverträglichkeit zweier aneinandergrenzender Schichten.'
    }
  },

  bauprodukte: {
    title: 'Bauprodukte & Bauproduktenrecht',
    tagline: 'Europäisches Baurecht, CE-Kennzeichnung, Leistungserklärungen und Konformität',
    leitfrage: 'Wie gelangt ein Werkstoff legal und haftungssicher von der Fabrik über die BauPVO in das genehmigte Tragwerk?',
    corePrinciples: [
      {
        title: 'Die Bauproduktenverordnung (BauPVO / CPR)',
        description: 'EU-Verordnungen gelten unmittelbar in allen Mitgliedsstaaten. Ein Bauprodukt darf nur in Verkehr gebracht werden, wenn es nach harmonisierter Norm (hEN) oder Europäischer Technischer Bewertung (ETA) CE-gekennzeichnet ist.',
        takeaway: 'Das CE-Zeichen ist der europäische Warenpass, garantiert aber noch nicht die nationale Brauchbarkeit!'
      },
      {
        title: 'Die Leistungserklärung (Declaration of Performance, DoP)',
        description: 'Der Hersteller erklärt verbindlich die wesentlichen Merkmale (Brandverhalten, Tragfähigkeit, Schallschutz). Ohne gültige DoP ist der Einbau bauordnungsrechtlich unzulässig.',
        takeaway: 'Die DoP ist das rechtlich bindende Dokument, das auf der Baustelle vorliegen muss.'
      },
      {
        title: 'Europäisches Inverkehrbringen vs. Nationale Verwendung',
        description: 'Die EU regelt das Inverkehrbringen (CE-Zeichen), aber die Bundesländer regeln über die Landesbauordnungen (MBO/LBO) und die Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB), was tatsächlich eingebaut werden darf.',
        takeaway: 'CE-Kennzeichnung + nationale Anwendungsnorm = rechtlich belastbares Bauwerk.'
      }
    ],
    systemicExplanation: 'Dieses Modul klärt die juristisch-technische Schnittstelle jedes Bauprojekts. Es führt durch den Dschungel aus hEN-Normen, allgemeinen bauaufsichtlichen Zulassungen (abZ), allgemeinen Bauartgenehmigungen (aBG), Vorhabenbezogenen Bauartgenehmigungen (vBg) und Umwelt-Produktdeklarationen (EPDs).',
    zusammenhaengeText: 'Das Bauproduktenrecht schützt Bauleiter und Planer vor massiven Haftungsrisiken: Wer Bauprodukte ohne gültige CE-Kennzeichnung oder ohne Passfähigkeit zur MVV TB einbaut, riskiert behördliche Baustopps und den Verlust des Versicherungsschutzes.',
    graphicalPipelineTitle: 'Der rechtlich belastbare Zulassungs- und Verifikationspfad',
    graphicalPipelineDesc: 'Vom Fabriktor bis zur Abnahme auf der Baustelle nach BauPVO und Landesbauordnung:',
    steps: [
      {
        step: '1',
        title: 'Produktion',
        subtitle: 'WPK & Erstprüfung',
        desc: 'Herstellung unter werkseigener Produktionskontrolle (WPK), Erstprüfung der Typmuster.',
        iconName: 'Package',
        keyFacts: ['WPK-Handbuch', 'Notifizierte Prüfstelle', 'AVCP-System 1+ bis 4'],
        normOrFormula: 'EU-BauPVO Nr. 305/2011',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '2',
        title: 'Deklaration',
        subtitle: 'DoP & CE-Label',
        desc: 'Ausstellung der rechtsverbindlichen Leistungserklärung (DoP) und Anbringen der CE-Kennzeichnung.',
        iconName: 'FileText',
        keyFacts: ['Wesentliche Merkmale', 'NPD (No Performance Determined)', 'Rückverfolgbarkeit'],
        normOrFormula: 'DoP-Dokumentation',
        color: 'from-cyan-600 to-cyan-700'
      },
      {
        step: '3',
        title: 'Verwendung',
        subtitle: 'MVV TB & Landesrecht',
        desc: 'Prüfung der nationalen Anwendbarkeit nach MVV TB, Landesbauordnung und Eurocode-Anwendungsregeln.',
        iconName: 'Scale',
        keyFacts: ['Musterbauordnung § 16a', 'Anlage A/B der MVV TB', 'abZ / aBG bei Abweichung'],
        normOrFormula: 'MBO § 16a / MVV TB',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '4',
        title: 'Einbaukontrolle',
        subtitle: 'Übereinstimmung vor Ort',
        desc: 'Lieferscheinkontrolle auf der Baustelle, Übereinstimmungsbestätigung des Unternehmers.',
        iconName: 'CheckCircle2',
        keyFacts: ['Lieferscheinabgleich', 'Bautagebucheintrag', 'Haftungsausschluss Planer'],
        normOrFormula: 'VOB/B § 4 Nr. 2',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'Produktion', to: 'Deklaration', relation: 'Basisnachweis', causeEffect: 'Ohne akkreditierte Typprüfung darf der Hersteller keine DoP rechtswirksam unterzeichnen.' },
      { from: 'Deklaration', to: 'Verwendung', relation: 'Leistungsabgleich', causeEffect: 'Die deklarierten DoP-Leistungswerte müssen die Mindestanforderungen der regionalen MVV TB übertreffen.' },
      { from: 'Verwendung', to: 'Einbaukontrolle', relation: 'Soll-Ist-Vergleich', causeEffect: 'Die Bauleitung haftet dafür, dass das angelieferte Produkt exakt der deklarierten Kennziffer der statischen Berechnung entspricht.' }
    ],
    practicalInsight: {
      title: 'Haftungsfalle auf der Baustelle',
      desc: 'Ein Produkt mit CE-Kennzeichnung nach AVCP 4 darf frei in Europa gehandelt werden, genügt im deutschen Hochbau aber oft nicht für tragende Bauteile (dort ist AVCP 1+ oder 2+ gefordert). Immer AVCP-Stufe im Lieferschein prüfen!'
    }
  },

  beton: {
    title: 'Betontechnologie & Dauerhaftigkeit',
    tagline: 'Mischungsentwurf, Rheologie, Hydratationskinetik und Hochleistungsgefüge',
    leitfrage: 'Wie steuert man die komplexe Wechselwirkung aus Zementhydratation, Porenraum und Einbaurheologie für 100 Jahre Lebensdauer?',
    corePrinciples: [
      {
        title: 'Das Walz-Gesetz & der w/z-Wert',
        description: 'Der Wasserzementwert (w/z-Wert) ist die zentrale Stellschraube. Für die Hydratation von Zement sind chemisch nur ca. 0,25 und physikalisch gebunden ca. 0,15 Teile Wasser nötig (w/z_hydr ≈ 0,40). Jedes zusätzliche Wasser hinterlässt kapillare Hohlräume, die Festigkeit und Dichtigkeit drastisch senken.',
        takeaway: 'Ein w/z-Wert über 0,45 erzeugt ein zusammenhängendes Kapillarporennetz und macht Beton anfällig für Carbonatisierung und Chloride.'
      },
      {
        title: 'Stoffraumrechnung (Dreisatz des Betons)',
        description: '1 m³ verdichteter Frischbeton besteht aus der Summe der absoluten Volumina aller Einzelkomponenten plus Restluft: V_Zement + V_Wasser + V_Gestein + V_Luft = 1000 Liter.',
        takeaway: 'Mischungsentwurf ist exakte Volumengeometrie, keine Schätzaufgabe.'
      },
      {
        title: 'Hydratationsdynamik & Eigenspannungen',
        description: 'Die Reaktion von Alit (C3S) und Belit (C2S) mit Wasser setzt ca. 300–500 kJ/kg Hydratationswärme frei. In massigen Bauteilen führt der Temperaturgradient zwischen Kern und Außenfläche zu starkem Zwang und Frühschwindrissen.',
        takeaway: 'Nachbehandlung und Hydratationswärmesteuerung sind statisch hochgradig relevant.'
      }
    ],
    systemicExplanation: 'Beton ist der meistverwendete menschengemachte Werkstoff der Erde. Dieses Modul verknüpft die Stoffgesetze der Ausgangsstoffe (Zemente nach DIN EN 197, Gesteinskörnungen nach DIN EN 12620, Zusatzmittel nach DIN EN 934-2) mit der Frischbetonrheologie (Konsistenzklassen F1–F6, Slump) und den mechanischen Festbetoneigenschaften bis hin zum Hochleistungs- und Carbonbeton.',
    zusammenhaengeText: 'Das Betonmodul speist den Massivbau mit Festigkeitsdaten (fck, Ecm), bedingt die Dauerhaftigkeitsklassen (XC, XD, XS, XF, XA) und bildet das Scharnier zur Dekarbonisierung (klinkerreduzierte CEM II/C- und CEM III-Zemente).',
    graphicalPipelineTitle: 'Kausalkette der Betontechnologie: Von der Gesteinskörnung zum Festbetongefüge',
    graphicalPipelineDesc: 'Der 5-Stufen-Weg von den Rohstoffen über Einbau und Hydratation zum dauerhaften Tragwerk:',
    steps: [
      {
        step: '1',
        title: 'Rezeptur',
        subtitle: 'Stoffraum & w/z-Wert',
        desc: 'Auswahl von Zementtyp, Sieblinie (A/B-Bereich) und Zusatzmitteln. Berechnung nach Stoffraumrechnung.',
        iconName: 'Scale',
        keyFacts: ['w/z-Wert ≤ 0.45', 'Mehlkorngehalt', 'Fließmittel PCE'],
        normOrFormula: '\\frac{w}{z} = \\frac{m_w}{m_z + k \\cdot m_f}',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '2',
        title: 'Frischbeton',
        subtitle: 'Rheologie & Einbau',
        desc: 'Transport, Verarbeitbarkeitszeitfenster, Rüttelverdichtung zur Minimierung von Verdichtungsporen.',
        iconName: 'Droplets',
        keyFacts: ['Ausbreitmaß F1–F6', 'Luftporengehalt', 'Entmischungsstabilität'],
        normOrFormula: 'DIN EN 12350-5',
        color: 'from-blue-500 to-blue-600'
      },
      {
        step: '3',
        title: 'Hydratation',
        subtitle: 'Exothermie & C-S-H',
        desc: 'Auflösung der Klinkerphasen, Fällung mikrokristalliner C-S-H-Nadeln, Temperaturmaximum.',
        iconName: 'Flame',
        keyFacts: ['Exotherme Wärme', 'Zwangspannungen', 'Gelporenbildung'],
        normOrFormula: 'C_3S + H \\rightarrow C\\text{-}S\\text{-}H + CH',
        color: 'from-rose-500 to-rose-600'
      },
      {
        step: '4',
        title: 'Nachbehandlung',
        subtitle: 'Schutz vor Schwinden',
        desc: 'Feuchthalten, Abdecken, Schalungsfristen nach DIN 1045-3 zur Verhinderung frühzeitigen Austrocknens.',
        iconName: 'ShieldCheck',
        keyFacts: ['Mindestdauer r.F.', 'Frühschwindrisse', 'Dichte Randzone'],
        normOrFormula: 'DIN 1045-3 / DIN EN 13670',
        color: 'from-teal-500 to-teal-600'
      },
      {
        step: '5',
        title: 'Dauerhaftigkeit',
        subtitle: 'Expositionsklassen',
        desc: 'Absicherung gegen Carbonatisierung (XC), Frost-Tausalz (XF), Chloride (XD/XS) und chemischen Angriff (XA).',
        iconName: 'Award',
        keyFacts: ['Mindestbetondeckung c_nom', 'Dichtes Zementsteingefüge', '50–100 Jahre Lebensdauer'],
        normOrFormula: 'DIN EN 206 / DIN 1045-2',
        color: 'from-purple-500 to-purple-600'
      }
    ],
    interconnections: [
      { from: 'Rezeptur', to: 'Frischbeton', relation: 'Rheologiesteuerung', causeEffect: 'Moderne PCE-Fließmittel dispergieren Zementflocken elektrostatisch und senken den Wasserbedarf um bis zu 30 %.' },
      { from: 'Frischbeton', to: 'Hydratation', relation: 'Gefügedichte', causeEffect: 'Ungenügende Verdichtung hinterlässt Makro-Luftporen, die Festigkeit und Dichtigkeit exponentiell abwerten.' },
      { from: 'Hydratation', to: 'Nachbehandlung', relation: 'Schadensprävention', causeEffect: 'Wird die Randzone in den ersten 3 Tagen nicht feucht gehalten, verdampft das Anmachwasser vor der Hydratation und erzeugt Risse.' },
      { from: 'Nachbehandlung', to: 'Dauerhaftigkeit', relation: 'Diffusionsbarriere', causeEffect: 'Eine dichte, hydratisierte Randzone verlangsamt das Vordringen von CO2 und Chloriden um Zehnerpotenzen.' }
    ],
    practicalInsight: {
      title: 'Die 5-Minuten-Regel des Baustellenbetonprüfers',
      desc: 'Wird Frischbeton auf der Baustelle unzulässig mit Wasser "nachgewässert", um ihn fließfähiger zu machen, steigt der w/z-Wert unkontrolliert an: Aus einem bestellten C30/37 wird im Bauteil schnell ein minderfester C20/25 mit ruinierter Dauerhaftigkeit!'
    }
  },

  stahlbeton: {
    title: 'Stahlbetonbau & Bemessung',
    tagline: 'Tragwerksentwurf, Schnittgrößen, Grenzzustände und konstruktive Durchbildung',
    leitfrage: 'Wie nutzen wir das ideale Verbundspiel aus druckfestem Beton und hochzugfestem Stahl für schlanke, duktile Tragwerke?',
    corePrinciples: [
      {
        title: 'Das ideale Verbundprinzip',
        description: 'Beton besitzt eine Druckfestigkeit von 20–100 N/mm², aber nur 10 % Zugfestigkeit. Stahl bietet 500 N/mm² Zugfestigkeit. Durch identische Wärmeausdehnung (α_T ≈ 10·10⁻⁶ 1/K) und mechanischen Rippenverbund entsteht ein monolithischer Hochleistungsverbundwerkstoff.',
        takeaway: 'Beton nimmt Druckspannungen auf, Stahl übernimmt die Zugspannungen im gerissenen Zustand II.'
      },
      {
        title: 'Grenzzustand der Tragfähigkeit (GZT)',
        description: 'Im Bruchzustand wird das Gleichgewicht am gerissenen Querschnitt angesetzt: Betondruckzone mit Spannungsblock (fcd = αcc·fck/γc) und Stahlzugkräfte (fyd = fyk/γs) bilden das innere Kräftepaar mit Hebelarm z.',
        takeaway: 'MEd ≤ MRd sichert die Einsturzsicherheit gegen Biegung, Querkraft und Durchstanzen.'
      },
      {
        title: 'Grenzzustand der Gebrauchstauglichkeit (GZG)',
        description: 'Ein Bauwerk stürzt nicht ein, wird aber unbrauchbar, wenn Risse zu breit werden (w_k ≤ 0,3 mm) oder Decken zu stark durchhängen. Rissbreitenbeschränkung sichert Korrosionsschutz.',
        takeaway: 'Häufig dimensioniert nicht der GZT, sondern der GZG (Rissbreite oder Durchbiegung) die Bauteildicke.'
      }
    ],
    systemicExplanation: 'Der Stahlbetonbau ist die ingenieurmäßige Krone des Massivbaus nach Eurocode 2 (DIN EN 1992-1-1). Dieses Modul führt rechnerisch und didaktisch durch Biegebemessung, Querkraftbemessung mit Druckstrebenmodell, Stützenknicken nach Theorie II. Ordnung, Durchstanznachweise an Flachdecken sowie Verankerungslängen und Rissbreitennachweise.',
    zusammenhaengeText: 'Stahlbeton greift direkt auf die Materialkennwerte der Baustoffkunde (fck, Ecm, fyk) zu und übergibt die Bauteildimensionen an die Bauwerksinstandhaltung und Dauerhaftigkeitsanalyse.',
    graphicalPipelineTitle: 'Kräftefluss und Bemessungspfad im Stahlbetonbau',
    graphicalPipelineDesc: 'Vom Einwirkungszustand über Schnittgrößen zur normgerechten Bewehrungsauswahl:',
    steps: [
      {
        step: '1',
        title: 'Einwirkungen',
        subtitle: 'Lastkombination Ed',
        desc: 'Eigengewicht g_k, Nutzlast q_k, Schnee, Wind. Kombination nach DIN EN 1990 mit Teilsicherheitsbeiwerten.',
        iconName: 'TrendingDown',
        keyFacts: ['γ_G = 1.35', 'γ_Q = 1.50', 'Grundkombination'],
        normOrFormula: 'E_d = 1{,}35 \\cdot G_k + 1{,}50 \\cdot Q_k',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '2',
        title: 'Schnittgrößen',
        subtitle: 'Statische Analyse',
        desc: 'Berechnung von Biegemoment M_Ed, Querkraft V_Ed und Normalkraft N_Ed an Balken, Platten oder Rahmen.',
        iconName: 'Calculator',
        keyFacts: ['Zustand I (ungestört)', 'Feld- und Stützmomente', 'Querkraftverlauf'],
        normOrFormula: 'M_{Ed} = \\frac{q_d \\cdot l^2}{8}',
        color: 'from-blue-500 to-blue-600'
      },
      {
        step: '3',
        title: 'Biegebemessung',
        subtitle: 'Kräftepaar & As',
        desc: 'Spannungs-Dehnungs-Linie, Betondruckzone x, Hebelarm z, erforderliche Längsbewehrung A_s,req.',
        iconName: 'Layers',
        keyFacts: ['kd-Verfahren', 'Dehnungszustand ε_c/ε_s', 'Duktiles Versagen'],
        normOrFormula: 'A_{s,req} = \\frac{M_{Ed}}{z \\cdot f_{yd}}',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        step: '4',
        title: 'Querkraft',
        subtitle: 'Fachwerkmodell',
        desc: 'Druckstrebenneigung θ, Querkrafttragfähigkeit ohne Bewehrung V_Rd,c und Bügelbewehrung a_sw.',
        iconName: 'Activity',
        keyFacts: ['Betondruckstrebe', 'Bügelabstand s', 'Risswinkel 21.8°–45°'],
        normOrFormula: 'V_{Rd,s} = a_{sw} \\cdot z \\cdot f_{ywd} \\cdot \\cot\\theta',
        color: 'from-purple-500 to-purple-600'
      },
      {
        step: '5',
        title: 'Gebrauchstauglichkeit',
        subtitle: 'Risse & Betondeckung',
        desc: 'Nachweis der Rissbreite w_k ≤ 0,3 mm, Mindestbewehrung für Zwang, Verankerungslänge l_bd.',
        iconName: 'ShieldCheck',
        keyFacts: ['Grenzstabdurchmesser', 'Betondeckung c_nom', 'Dauerhaftigkeit'],
        normOrFormula: 'w_k = s_{r,max} \\cdot (\\varepsilon_{sm} - \\varepsilon_{cm})',
        color: 'from-rose-500 to-rose-600'
      }
    ],
    interconnections: [
      { from: 'Einwirkungen', to: 'Schnittgrößen', relation: 'Lastabtrag', causeEffect: 'Erhöhte Nutzlasten erfordern steifere Deckenquerschnitte zur Vermeidung von Durchbiegungsproblemen.' },
      { from: 'Schnittgrößen', to: 'Biegebemessung', relation: 'Dimensionierung', causeEffect: 'MEd bestimmt über den Hebelarm z direkt die Quadratzentimeter der Zugbewehrung As.' },
      { from: 'Biegebemessung', to: 'Querkraft', relation: 'Kopplung', causeEffect: 'Der Hebelarm z aus der Biegung definiert die wirksame Höhe der Betondruckstrebe im Fachwerkmodell.' },
      { from: 'Querkraft', to: 'Gebrauchstauglichkeit', relation: 'Risskontrolle', causeEffect: 'Schiefe Schirmrisse aus Querkraft beanspruchen die Betondeckung und erfordern engmaschige Bügelanordnungen.' }
    ],
    practicalInsight: {
      title: 'Die Duktilitätsregel im Massivbau',
      desc: 'Ein Querschnitt darf niemals "überbewehrt" sein! Bei Überbewehrung versagt der Beton schlagartig durch Druckbruch ohne Vorankündigung. Er muss immer unterbewehrt sein, damit der Stahl vor dem Beton fließt und Risse rechtzeitig warnen.'
    }
  },

  holzbau: {
    title: 'Ingenieurholzbau nach Eurocode 5',
    tagline: 'Anisotropie, Holzfeuchte, Stabilitätsnachweise und Verbindungsmitteltechnik',
    leitfrage: 'Wie nutzt man die phänomenale Zug- und Druckfestigkeit nachwachsender Holzfasern trotz Anisotropie und Feuchtedehnung sicher im Ingenieurbau?',
    corePrinciples: [
      {
        title: 'Orthotrope Anisotropie',
        description: 'Holz ist ein natürlicher biologischer Faserverbundwerkstoff. Die Festigkeit parallel zur Faser ist um ein Vielfaches höher als rechtwinklig zur Faser. Querzugbeanspruchungen sind die Achillesferse des Holzbaus.',
        takeaway: 'Querzugspannungen müssen konstruktiv vermieden oder durch Querzugverstärkungen (Vollgewindeschrauben) abgefangen werden.'
      },
      {
        title: 'Hygroskopisches Gleichgewicht & k_mod',
        description: 'Holz quillt und schwindet unterhalb des Fasersättigungsbereichs (~28–32 %). Feuchtigkeit und Lasteinwirkungsdauer mindern die Tragfähigkeit maßgeblich über den Modifikationsbeiwert k_mod.',
        takeaway: 'Festigkeit im Holzbau ist zeit- und feuchteabhängig: X_d = k_mod · X_k / γ_M.'
      },
      {
        title: 'Verbindungsmittel bestimmen das Tragwerk',
        description: 'Im Holzbau versagt fast nie das Stabbündel im Feld, sondern der Knotenpunkt. Verbindungsmittel (Stabdübel, Bolzen, Nagelplatten, Schwalbenschwanz) leiten Kräfte duktil über Lochleibung und Fließgelenke ab.',
        takeaway: 'Der Knotenentwurf ist die eigentliche Kunst des Holzbauingenieurs.'
      }
    ],
    systemicExplanation: 'Holzbau nach DIN EN 1995-1-1 (Eurocode 5) ist der Vorreiter des zirkulären und klimapositiven Bauens. Das Modul vermittelt Vollholz (C24), Brettschichtholz (GL24–GL32) und Brettsperrholz (CLT), Stabilitätsnachweise (Biegeknicken nach Ersatzstabverfahren, Biegedrillknicken) sowie Heißbemessung über die Abbrandrate.',
    zusammenhaengeText: 'Holz verbindet Mechanik (Stabilität), Bauphysik (Brandschutz durch Schutzholzkohleschicht β0, Dampfdiffusion) und Nachhaltigkeit (CO2-Speicherung von ca. 1 t CO2 pro m³ Holz).',
    graphicalPipelineTitle: 'Der Systemkreis des Ingenieurholzbaus',
    graphicalPipelineDesc: 'Vom Faseraufbau über Feuchtemodifikation zu Verbindungsmitteln und Brandschutz:',
    steps: [
      {
        step: '1',
        title: 'Werkstoff',
        subtitle: 'Faser & Anisotropie',
        desc: 'Zellulose, Lignin, Röhrengefüge. Festigkeiten f_m,k, f_t,0,k vs. geringe Querzugfestigkeit f_t,90,k.',
        iconName: 'Trees',
        keyFacts: ['C24 / GL28h / CLT', 'Faserausrichtung', 'Rohdichte ρ_k'],
        normOrFormula: 'DIN EN 338 / DIN EN 14080',
        color: 'from-emerald-600 to-emerald-700'
      },
      {
        step: '2',
        title: 'Umwelt',
        subtitle: 'Feuchte & k_mod',
        desc: 'Nutzungsklassen NKL 1 bis 3, Kriechverformungen k_def, Abminderung der Festigkeiten über k_mod.',
        iconName: 'Droplets',
        keyFacts: ['NKL 1 (beheizt)', 'NKL 2 (überdacht)', 'NKL 3 (Freiluft)'],
        normOrFormula: 'R_d = k_{mod} \\cdot \\frac{R_k}{\\gamma_M}',
        color: 'from-teal-600 to-teal-700'
      },
      {
        step: '3',
        title: 'Stabilität',
        subtitle: 'Knicken & Kippen',
        desc: 'Ersatzstabverfahren für Druckstäbe, geometrische Imperfektionen, Biegedrillknickbeiwerte k_crit.',
        iconName: 'Activity',
        keyFacts: ['Schlankheitsgrad λ', 'Knickbeiwert k_c', 'Theorie II. Ordnung'],
        normOrFormula: '\\sigma_{c,0,d} \\le k_c \\cdot f_{c,0,d}',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '4',
        title: 'Verbindung',
        subtitle: 'Duktile Knoten',
        desc: 'Johansen-Theorie: Lochleibung im Holz vs. Biegebruch im Stahlstift, Ausziehfestigkeit von Schrauben.',
        iconName: 'Wrench',
        keyFacts: ['Stabdübel & Passbolzen', 'Vollgewindeschrauben', 'Spaltversagen'],
        normOrFormula: 'F_{v,Rk} = \\min(Johansen)',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '5',
        title: 'Brandschutz',
        subtitle: 'Abbrandrate β0',
        desc: 'Berechenbarer Abbrand (0,65–0,8 mm/min), Ausbildung einer dämmenden Kohleschicht, Restquerschnittsmethode.',
        iconName: 'Flame',
        keyFacts: ['Kein Schmelzen', 'Konstante Restfestigkeit', 'R30 bis R90 Nachweis'],
        normOrFormula: 'd_{ef} = d_{char} + k_0 \\cdot d_0',
        color: 'from-rose-600 to-rose-700'
      }
    ],
    interconnections: [
      { from: 'Werkstoff', to: 'Umwelt', relation: 'Klimaanpassung', causeEffect: 'Schwankende Luftfeuchte induziert Quell- und Schwindspannungen, die bei Querdrucklagern Risse treiben.' },
      { from: 'Umwelt', to: 'Stabilität', relation: 'Steifigkeitsverlust', causeEffect: 'Höhere Feuchte verringert den E-Modul und senkt die Knicklast λcrit spürbar ab.' },
      { from: 'Stabilität', to: 'Verbindung', relation: 'Haltekräfte', causeEffect: 'Kippgefährdete Träger müssen über Verbindungsmittel torsionssteif an Verbände angeschlossen werden.' },
      { from: 'Verbindung', to: 'Brandschutz', relation: 'Schwachstellen', causeEffect: 'Stahlverbindungsmittel leiten Hitze ins Holzinnere und müssen durch Holzüberdeckungen oder Brandmanschetten geschützt werden.' }
    ],
    practicalInsight: {
      title: 'Konstruktiver Holzschutz vor Chemie',
      desc: 'Die wichtigste Holzbaunorm ist der konstruktive Holzschutz (DIN 68800-2): Wer Holz vor stehendem Wasser, Spritzwasser und aufsteigender Feuchte schützt, braucht keinerlei chemischen Holzschutz!'
    }
  },

  mechanik: {
    title: 'Mechanik & Baustatik',
    tagline: 'Kräftegleichgewicht, Elastizitätstheorie, Schnittgrößen und Stabilität',
    leitfrage: 'Wie berechnet man innere Spannungszustände aus äußeren Lasten, um Versagen, Rissbildung und Knicken vorherzusehen?',
    corePrinciples: [
      {
        title: 'Die drei Gleichgewichtsbedingungen',
        description: 'In der klassischen Statik muss jeder Körper im Ruhezustand sein: Summe aller Horizontalkräfte ΣH = 0, Vertikalkräfte ΣV = 0 und Biegemomente um jeden beliebigen Punkt ΣM = 0.',
        takeaway: 'Das statische Gleichgewicht gilt unerbittlich an jedem Knoten, jedem Stab und jedem infinitesimalen Volumenelement.'
      },
      {
        title: 'Schnittprinzip & Spannungstensor',
        description: 'Ein fiktiver Schnitt durch ein Bauteil legt die inneren Kräfte frei: Normalkraft N, Querkraft V, Biegemoment M und Torsion T. Diese verteilen sich als Normalspannungen σ und Schubspannungen τ über die Querschnittsfläche.',
        takeaway: 'Spannungen sind Schnittgrößen dividiert durch Querschnittswerte: σ = N/A ± M/W.'
      },
      {
        title: 'Verzerrungs-Verschiebungs-Beziehungen & Hooke',
        description: 'Kräfte erzeugen Spannungen, Spannungen erzeugen Dehnungen (über den E-Modul E), Dehnungen integrieren sich zu Verschiebungen (Biegelinie w(x)).',
        takeaway: 'Statik koppelt Kräfte, Geometrie und Materialkonstanten zur Biegelinie: EI · w\'\'(x) = -M(x).'
      }
    ],
    systemicExplanation: 'Die Technische Mechanik ist die mathematische Sprache aller Tragwerksdisziplinen. Sie spannt den Bogen von der Starrkörperstatik über die Festigkeitslehre (Spannungstransformation, Mohrscher Spannungskreis) und Energiemethoden (Prinzip der virtuellen Verschiebungen PvV, Satz von Castigliano) bis zu Stabilitätsproblemen (Euler-Knicken I–IV).',
    zusammenhaengeText: 'Ohne Mechanik gibt es keine Bemessung: Ob Beton, Stahl oder Holz – jeder Eurocode setzt die exakte Schnittgrößenermittlung aus der Mechanik voraus.',
    graphicalPipelineTitle: 'Die Kausalkette der Baumechanik',
    graphicalPipelineDesc: 'Vom äußeren Lastmodell über Gleichgewicht und Schnittgrößen zur Querschnittsspannung:',
    steps: [
      {
        step: '1',
        title: 'Modellierung',
        subtitle: 'Lager & Lasten',
        desc: 'Idealisierung des realen Tragwerks: Stäbe, Gelenke, feste und verschiebliche Lager, Einwirkungen.',
        iconName: 'Compass',
        keyFacts: ['Freikörperbild', 'Auflagerreaktionen', 'Statische Bestimmtheit'],
        normOrFormula: '\\sum F_x = 0, \\sum F_y = 0, \\sum M = 0',
        color: 'from-slate-600 to-slate-700'
      },
      {
        step: '2',
        title: 'Schnittgrößen',
        subtitle: 'N, V, M-Verläufe',
        desc: 'Integration der Lasten entlang des Trägers, Differentialbeziehungen der Stabstatik.',
        iconName: 'Calculator',
        keyFacts: ['Querkraftsprung', 'Momentenmaximum', 'Differentialgleichung'],
        normOrFormula: '\\frac{dM}{dx} = V(x), \\frac{dV}{dx} = -q(x)',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '3',
        title: 'Querschnittswerte',
        subtitle: 'A, I, W, S',
        desc: 'Schwerpunktberechnung, Flächenträgheitsmomente I_y, Widerstandsmomente W_y, Satz von Steiner.',
        iconName: 'Layers',
        keyFacts: ['Flächenträgheit', 'Steiner-Anteil', 'Hauptträgheitsachsen'],
        normOrFormula: 'I_y = \\int z^2 dA',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '4',
        title: 'Spannungsnachweis',
        subtitle: 'σ- und τ-Verteilungen',
        desc: 'Normalspannungen aus Biegung und Normalkraft, Schubspannungen aus Querkraft, Hauptspannungen.',
        iconName: 'Activity',
        keyFacts: ['Biegespannung', 'Schubspannung τ', 'Mohrscher Spannungskreis'],
        normOrFormula: '\\sigma = \\frac{N}{A} + \\frac{M_y}{I_y} \\cdot z',
        color: 'from-rose-600 to-rose-700'
      },
      {
        step: '5',
        title: 'Verformung & Stabilität',
        subtitle: 'Biegelinie & Knicken',
        desc: 'Ermittlung von Durchbiegungen w(x) und Verzweigungslasten (Euler-Knickfälle 1 bis 4).',
        iconName: 'TrendingDown',
        keyFacts: ['Biegelinie', 'Knicklänge s_k', 'Euler-Kraft N_crit'],
        normOrFormula: 'N_{crit} = \\frac{\\pi^2 \\cdot E \\cdot I}{s_k^2}',
        color: 'from-amber-600 to-amber-700'
      }
    ],
    interconnections: [
      { from: 'Modellierung', to: 'Schnittgrößen', relation: 'Gleichgewichtsfluss', causeEffect: 'Falsch angenommene Lagerbedingungen (z. B. fälschlich starre statt gelenkige Einspannung) verfälschen alle Momente.' },
      { from: 'Schnittgrößen', to: 'Spannungsnachweis', relation: 'Schnittkraft/Geometrie', causeEffect: 'Das maximale Biegemoment M_max trifft auf das Widerstandsmoment W und erzeugt die maßgebende Randfaser-Zugspannung.' },
      { from: 'Querschnittswerte', to: 'Verformung & Stabilität', relation: 'Biegesteifigkeit EI', causeEffect: 'Das Flächenträgheitsmoment I geht mit der vierten Potenz der Bauteildicke ein; Verdoppelung der Trägerhöhe verachtfacht die Steifigkeit!' }
    ],
    practicalInsight: {
      title: 'Statiker-Weisheit',
      desc: 'Die Natur rechnet nicht mit Computern, sie folgt dem Weg des geringsten Widerstands. Kräfte wandern dorthin, wo Steifigkeit vorhanden ist. Wer Steifigkeiten falsch einschätzt, leitet Lasten unbemerkt an falsche Stellen.'
    }
  },

  bauphysik: {
    title: 'Bauphysik: Wärme, Feuchte, Schall & Brand',
    tagline: 'Energieeffizienz, hygrothermische Simulation, Raumakustik und passiver Brandschutz',
    leitfrage: 'Wie gestaltet man Bauteilschichten so, dass weder Schimmel entsteht, noch Energie verloren geht, Schall draußen bleibt und im Brandfall Menschenleben geschützt werden?',
    corePrinciples: [
      {
        title: 'Wärmedurchgang & Fourier-Gesetz',
        description: 'Wärme fließt stets von warm nach kalt. Der Wärmedurchgangskoeffizient (U-Wert) beschreibt den Wärmestrom pro m² und Kelvin. Je kleiner der U-Wert, desto höher die thermische Behaglichkeit und desto geringer der Heizenergiebedarf.',
        takeaway: 'U = 1 / (Rsi + Σ(d/λ) + Rse) ist die Leitformel des energieeffizienten Bauens.'
      },
      {
        title: 'Dampfdiffusion & Tauwasserausfall (Glaser-Verfahren)',
        description: 'Warme Raumluft transportiert Wasserdampf (hoher Dampfdruck). Wandert dieser durch die Wand nach außen in kältere Schichten, kann die Sättigungstemperatur unterschritten werden: Es fällt Tauwasser aus. Kondensat zerstört Dämmstoffe und erzeugt Schimmelpilz.',
        takeaway: 'Wände müssen von innen nach außen dampfdiffusionsoffener werden: Innen dicht, außen diffusionsoffen!'
      },
      {
        title: 'Massegesetz der Bauakustik & Entkopplung',
        description: 'Luftschalldämmung folgt für einschalige Bauteile dem Massegesetz: Theoretisch (Berger) steigt R um 6 dB je Verdopplung der flächenbezogenen Masse m\', nach der empirischen Massekurve der DIN 4109-32 um rund 9 dB. Trittschall und Flankenübertragung erfordern zwingend elastische Entkopplung.',
        takeaway: 'Gegen Luftschall hilft Masse, gegen Tritt- und Körperschall hilft nur elastische Entkopplung.'
      }
    ],
    systemicExplanation: 'Die Bauphysik ist die Schutzdisziplin des Hochbaus nach GModG (Gebäudemodernisierungsgesetz, vormals GEG), DIN 4108 (Wärme- und Feuchteschutz), DIN 4109 (Schallschutz) und DIN 4102 / DIN EN 13501 (Brandschutz). Sie garantiert die physiologische Behaglichkeit der Nutzer und den baulichen Werterhalt.',
    zusammenhaengeText: 'Bauphysik greift tief in die Werkstoffkunde ein: Die Wahl von Dämmstoffen (Mineralwolle, Holzfaser, EPS), Putzen und Fenstern bestimmt U-Werte, fRsi-Faktoren und Feuerwiderstandsdauern (REI 30–REI 120).',
    graphicalPipelineTitle: 'Die 4 Schutzdimensionen der Bauphysik',
    graphicalPipelineDesc: 'Integrales Schichtenmodell für hygrothermische, akustische und brandschutztechnische Sicherheit:',
    steps: [
      {
        step: '1',
        title: 'Wärmeschutz',
        subtitle: 'U-Wert & Wärmebrücken',
        desc: 'Wärmeleitfähigkeit λ, Wärmedurchgangswiderstand R, U-Wert-Berechnung, Isothermenanalyse.',
        iconName: 'Thermometer',
        keyFacts: ['GModG-/GEG-Anforderungen', 'Temperaturfaktor f_Rsi ≥ 0,70', 'Sommerlicher Wärmeschutz'],
        normOrFormula: 'U = \\frac{1}{R_{si} + \\sum \\frac{d_i}{\\lambda_i} + R_{se}}',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '2',
        title: 'Feuchteschutz',
        subtitle: 'Dampfdiffusion & Tauwasser',
        desc: 'Glaser-Verfahren (DIN 4108-3), Wasserdampf-Diffusionswiderstandszahl μ, s_d-Wert, hygrothermische Simulation.',
        iconName: 'Droplets',
        keyFacts: ['Tauperiode vs. Verdunstung', 'Schimmelpilzkriterium', 'Dampfbremse s_d'],
        normOrFormula: 's_d = \\mu \\cdot d',
        color: 'from-blue-500 to-blue-600'
      },
      {
        step: '3',
        title: 'Schallschutz',
        subtitle: 'Luft- & Trittschall',
        desc: 'Bewertetes Schalldämmmaß R\'w, Norm-Trittschallpegel L\'n,w, Biegeweichheit, schwimmender Estrich.',
        iconName: 'Volume2',
        keyFacts: ['Massegesetz R ~ 20 log(m\')', 'Flankenübertragung', 'Trittschalldämmung ΔL_w'],
        normOrFormula: 'DIN 4109-1',
        color: 'from-purple-500 to-purple-600'
      },
      {
        step: '4',
        title: 'Brandschutz',
        subtitle: 'Baustoffklassen & REI',
        desc: 'Reaktion auf Feuer (Euroklassen A1 bis F), Feuerwiderstand R (Tragfähigkeit), E (Raumabschluss), I (Isolation).',
        iconName: 'Flame',
        keyFacts: ['Brandverhaltensklassen', 'REI 30 bis REI 120', 'Rettungswege'],
        normOrFormula: 'DIN EN 13501-1/2',
        color: 'from-rose-500 to-rose-600'
      }
    ],
    interconnections: [
      { from: 'Wärmeschutz', to: 'Feuchteschutz', relation: 'Kondensatrisiko', causeEffect: 'Schlecht gedämmte Wärmebrücken kühlen die Innenoberfläche ab; fällt f_Rsi unter 0,70, steigt die Oberflächenfeuchte über 80 % und Schimmel droht.' },
      { from: 'Feuchteschutz', to: 'Wärmeschutz', relation: 'Leitfähigkeitserhöhung', causeEffect: 'Nasse Dämmung verliert ihre Dämmwirkung: Wasser leitet Wärme 25-mal besser als ruhende Luft (λ_Wasser ≈ 0,6 vs. λ_Luft ≈ 0,025).' },
      { from: 'Wärmeschutz', to: 'Schallschutz', relation: 'Materialzielkonflikt', causeEffect: 'Leichte, steife Hartschaumdämmplatten (EPS) verschlechtern die Schalldämmung; faserige, schwere Mineralwolle dämmt thermisch und akustisch gleichermaßen.' }
    ],
    practicalInsight: {
      title: 'Die goldene Faustregel der Bauphysik',
      desc: 'Dampfdichte Schichten (Dampfsperren, Bitumen) gehören auf die warme Innenseite der Dämmebene. Liegen sie ohne innere Dampfsperre auf der kalten Außenseite, droht Tauwasser in der Dämmebene; Ausnahmen (z. B. Umkehrdach, Holzkonstruktionen mit Feuchtenachweis) erfordern einen Nachweis.'
    }
  },

  nachhaltigkeit: {
    title: 'Nachhaltigkeit & Ökobilanzierung',
    tagline: 'LCA-Methodik, Treibhauspotenzial (GWP), Zirkularität, Materialeffizienz und EPBD',
    leitfrage: 'Wie dekarbonisieren wir den Gebäude- und Bausektor (rund 37 % der globalen energie- und prozessbedingten CO₂-Emissionen) bis zur Treibhausgasneutralität – in Deutschland bis 2045?',
    corePrinciples: [
      {
        title: 'Lebenszyklusanalyse (LCA nach DIN EN 15978)',
        description: 'Gebäudeemissionen teilen sich in "graue Emissionen" (Herstellung A1–A3, Transport & Einbau A4–A5) und "betriebliche Emissionen" (Heizen, Kühlen B1–B7). Bei hocheffizienten Neubauten entfällt häufig mehr als die Hälfte der Lebenszyklusemissionen auf die Herstellung.',
        takeaway: 'Klimaschutz im Bauen entscheidet sich in den ersten 6 Monaten auf der Baustelle, nicht über 50 Jahre Betrieb.'
      },
      {
        title: 'Die 3 Säulen der Nachhaltigkeit',
        description: 'Effizienz (bessere Baustoffe, klinkerarme Zemente), Konsistenz (zirkuläre Stoffkreisläufe, Urban Mining, Recyclingschotter) und Suffizienz (Flächenoptimierung, Sanieren statt Neubau).',
        takeaway: 'Suffizienz spart 100 % der Emissionen, Effizienz nur 20–40 %.'
      },
      {
        title: 'Zirkularität & Trennbarkeit (Design for Disassembly)',
        description: 'Ein Gebäude ist ein temporäres Rohstofflager. Verklebte Verbundmaterialien (z. B. verklebte WDVS) enden als Sondermüll. Mechanisch demontierbare Fügungen ermöglichen echtes Rezyklieren.',
        takeaway: 'Nur was sortenrein demontiert werden kann, ist kreislauffähig.'
      }
    ],
    systemicExplanation: 'Dieses Modul verankert die ökologische Transformation des Bauingenieurwesens. Es führt durch Ökobilanzen nach ÖKOBAUDAT, Umweltproduktdeklarationen (EPDs), EU-Taxonomie, EPBD (EU) 2024/1275, Gebäudemodernisierungsgesetz (GModG, vormals GEG) und Zertifizierungssysteme (DGNB, BNB, QNG).',
    zusammenhaengeText: 'Nachhaltigkeit ist das Dach aller Module: Sie hinterfragt Materialmengen der Mechanik, Zementgehalte der Betontechnologie, Entsorgbarkeit von Bauprodukten und setzt das Bauen im Bestand als Leitstrategie durch.',
    graphicalPipelineTitle: 'Das zirkuläre Lebenszyklusmodell des Bauens',
    graphicalPipelineDesc: 'Von der Wiege bis zur Bahre – und zurück in den Stoffkreislauf nach DIN EN 15804 / 15978:',
    steps: [
      {
        step: 'A1–A5',
        title: 'Herstellung & Bau',
        subtitle: 'Embodied Carbon (Graue Energie)',
        desc: 'Rohstoffgewinnung (A1), Transport (A2), Werksproduktion (A3), Baustellentransport (A4), Einbau (A5).',
        iconName: 'Factory',
        keyFacts: ['Klinkerbrand im Zementwerk', 'Hochofenroute vs. Lichtbogenstahl', 'EPD-Deklaration GWP_total'],
        normOrFormula: 'GWP_{Herstellung} [\\text{kg CO}_2\\text{-eq}/\\text{m}^2]',
        color: 'from-rose-500 to-rose-600'
      },
      {
        step: 'B1–B7',
        title: 'Betriebsphase',
        subtitle: 'Operational Carbon',
        desc: 'Nutzung (B1), Instandhaltung (B2), Reparatur (B3), Ersatz (B4), Energie- & Wasserbetrieb (B6/B7).',
        iconName: 'Leaf',
        keyFacts: ['Wärmepumpenstrom', 'Photovoltaik-Eigenstrom', 'Rebound-Effekte'],
        normOrFormula: 'GModG / EPBD (EU) 2024/1275',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: 'C1–C4',
        title: 'Lebensende',
        subtitle: 'End of Life',
        desc: 'Rückbau (C1), Transport (C2), Abfallaufbereitung (C3) und Beseitigung (C4).',
        iconName: 'Trash2',
        keyFacts: ['Selektiver Rückbau', 'Schadstoffabtrennung', 'Deponievermeidung'],
        normOrFormula: 'DIN EN 15978',
        color: 'from-slate-500 to-slate-600'
      },
      {
        step: 'Modul D',
        title: 'Gutschrift',
        subtitle: 'Beyond System Boundary',
        desc: 'Wiederverwendungs- und Recyclingpotenzial für Folgelebenszyklen außerhalb der Systemgrenze.',
        iconName: 'Sparkles',
        keyFacts: ['RC-Gesteinskörnung', 'Stahlrecycling im EAF', 'Holzkaskadennutzung'],
        normOrFormula: '\\text{Gutschrift } \\Delta GWP < 0',
        color: 'from-emerald-500 to-emerald-600'
      }
    ],
    interconnections: [
      { from: 'A1–A5', to: 'B1–B7', relation: 'Amortisationszeit', causeEffect: 'Hoher Materialaufwand in A1–A3 (z. B. dicke Dreifachverglasung, massive Dämmung) muss sich über geringere B6-Betriebsemissionen innerhalb von 15 Jahren amortisieren.' },
      { from: 'C1–C4', to: 'Modul D', relation: 'Sortenreinheit', causeEffect: 'Nur sauber getrennte Rückbaumassen erzielen in Modul D signifikante CO2-Gutschriften; Mischabbruch führt zu Deponielasten in C4.' },
      { from: 'Modul D', to: 'A1–A5', relation: 'Stoffkreislaufschluss', causeEffect: 'Sekundärrohstoffe ersetzen Primärrohstoffe in künftigen Produkten (Phase A1); die dadurch vermiedenen Lasten werden als Modul D getrennt ausgewiesen und nicht mit A–C verrechnet.' }
    ],
    practicalInsight: {
      title: 'Die wichtigste Formel des Klimaschutzes',
      desc: 'Das klimafreundlichste Gebäude ist jenes, das gar nicht erst gebaut werden muss, sondern durch kluge Umnutzung eines bestehenden Bauwerks entsteht. Erhalt spart 100 % der Fundament- und Rohbauemissionen!'
    }
  },

  digitales: {
    title: 'Digitales, BIM & KI im Bauwesen',
    tagline: 'Building Information Modeling, algorithmischer Entwurf und KI-Inspektion',
    leitfrage: 'Wie überwinden wir Informationsbrüche zwischen Planung, Baustelle und Betrieb durch digitale Datenströme?',
    corePrinciples: [
      {
        title: 'BIM als semantischer Zwilling (Open BIM)',
        description: 'BIM ist kein 3D-Zeichenprogramm, sondern eine objektorientierte Datenbank. Jedes Bauteil (Wand, Stütze) trägt geometrische (3D) und alphanumerische Attribute (Kosten 5D, Termine 4D, LCA 6D, Betrieb 7D) im herstellerunabhängigen IFC-Format.',
        takeaway: 'Ein Strich im CAD ist dumm; ein IFC-Objekt kennt sein Material, sein Volumen und seine Festigkeit.'
      },
      {
        title: 'Single Source of Truth',
        description: 'In konventionellen Projekten existieren hunderte veraltete PDF-Pläne parallel. BIM bündelt die Planung in einer gemeinsamen Datenumgebung (CDE – Common Data Environment) mit revisionssicheren Freigabeprozessen.',
        takeaway: 'Planungskollisionen werden vor dem ersten Spatenstich im virtuellen Modell gelöst.'
      },
      {
        title: 'Computer Vision & KI-Bauwerksdiagnostik',
        description: 'Drohnenaufnahmen, Photogrammetrie und LiDAR-Punktwolken werden per Convolutional Neural Networks (CNN) und Segmentierung auf Rissmuster, Abplatzungen und Feuchteflecken analysiert.',
        takeaway: 'KI ersetzt nicht den Ingenieur, automatisiert aber die mühsame Risskartierung um den Faktor 100.'
      }
    ],
    systemicExplanation: 'Die Digitalisierung transformiert die Bauwirtschaft von einer handwerklichen Silo-Branche zu einer vernetzten Industrie. Dieses Modul spannt den Bogen von IFC-Datenstrukturen (DIN EN ISO 16739) über BIM-Anwendungsfälle (BAP, AIA) bis hin zu parametrischer Geometrie und KI-Bilderkennung für Schadensanalysen.',
    zusammenhaengeText: 'Digitale Modelle speisen Massenauszüge für Ökobilanzen (LCA), liefern Geometrien für statische FE-Netze und bilden die lückenlose Bauakte für Facility Management und Rückbau.',
    graphicalPipelineTitle: 'Die digitale Prozesskette im Bauwesen',
    graphicalPipelineDesc: 'Vom parametrischen Entwurf über Baustellenüberwachung zum digitalen Betriebszwilling:',
    steps: [
      {
        step: '1',
        title: 'BIM-Modell',
        subtitle: 'Geometrie & IFC-Daten',
        desc: 'Objektorientierte Modellierung mit Attributierung (Material, Festigkeit, Brandklasse) im CDE.',
        iconName: 'Monitor',
        keyFacts: ['IFC 4.3 Standard', 'LOD / LOIN Reifegrade', 'Kollisionsprüfung'],
        normOrFormula: 'DIN EN ISO 19650',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '2',
        title: 'Simulation',
        subtitle: 'Statik & LCA-Kopplung',
        desc: 'Automatisierte Übergabe an FE-Berechnungsprogramme und direkte Verknüpfung mit Ökobilanz-Datenbanken.',
        iconName: 'Cpu',
        keyFacts: ['BIM-to-FEM', 'Mengenermittlung QTO', 'CO2-Echtzeitbilanz'],
        normOrFormula: 'ÖKOBAUDAT / EPD-Link',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '3',
        title: 'Baustelle',
        subtitle: 'Sensorik & Scan-to-BIM',
        desc: 'Drohnenvermessung, LiDAR-Punktwolkenscans, digitaler Baufortschrittsvergleich (Soll vs. Ist).',
        iconName: 'HardHat',
        keyFacts: ['Punktwolkenregistrierung', 'Bautagebuch-App', 'AR-Bauüberwachung'],
        normOrFormula: 'Scan-to-BIM Workflows',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '4',
        title: 'Betrieb & KI',
        subtitle: 'Digital Twin & KI-Diagnose',
        desc: 'Echtzeitmonitoring über IoT-Sensoren, KI-gestützte Risserkennung und vorausschauende Wartung.',
        iconName: 'Sparkles',
        keyFacts: ['Computer Vision Risserkennung', 'IoT Dehnungssensoren', 'Facility Management CAFM'],
        normOrFormula: 'Predictive Maintenance',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'BIM-Modell', to: 'Simulation', relation: 'Datenkontinuität', causeEffect: 'Konsistente Bauteilattribute im Modell ersparen das doppelte Modellieren des Tragwerks in Statiksoftware.' },
      { from: 'Simulation', to: 'Baustelle', relation: 'Ausführungsplan', causeEffect: 'Aus dem 4D-BIM-Modell generierte Ablaufsimulationen verhindern Baustellenstillstände durch verspätete Betonagen.' },
      { from: 'Baustelle', to: 'Betrieb & KI', relation: 'As-Built-Modell', causeEffect: 'Punktwolkenscans sichern den tatsächlichen Bauzustand (inkl. verdeckter Leitungen) für das spätere Bauwerksmonitoring.' }
    ],
    practicalInsight: {
      title: 'Die BIM-Realität',
      desc: 'BIM scheitert nie an der Software, sondern immer an unklar definierten Auftraggeber-Informationsanforderungen (AIA). Wer vor Beginn nicht festlegt, wer welche Daten in welchem Format liefern muss, erzeugt digitales Chaos.'
    }
  },

  bestand: {
    title: 'Bauen im Bestand & Denkmalpflege',
    tagline: 'Historische Baustoffe, zerstörungsfreie Erkundung, EN 1990-2:2026 und Umnutzung',
    leitfrage: 'Wie beurteilt man die Tragfähigkeit und Dauerhaftigkeit eines 100 Jahre alten Bauwerks, für das keine statischen Berechnungen existieren?',
    corePrinciples: [
      {
        title: 'Historischer Kontext bestimmt Materialeigenschaften',
        description: 'Ein Beton aus den 1920er bis 1950er Jahren (z. B. B 120, B 160 nach DIN 1045 alter Fassung) gehorcht völlig anderen Regeln als moderne Betone. Schüttbeton, Hochofenzement, Zementleimüberschuss und Kieskanten müssen historisch exakt datiert werden.',
        takeaway: 'Erst das Baujahr und die Bauakte studieren, dann erst das Prüfgerät ansetzen.'
      },
      {
        title: 'Das Nachrechnungskonzept (EN 1990-2:2026)',
        description: 'Für bestehende Bauwerke dürfen nicht starr Neubaunormen angesetzt werden. Da das Bauwerk seine Tragfähigkeit über Jahrzehnte bewiesen hat (Tragwerksgeschichte), dürfen modifizierte Teilsicherheitsbeiwerte auf Basis tatsächlicher Streuungen verwendet werden.',
        takeaway: 'Ermittelte Bauteilabmessungen und Materialprüfungen reduzieren Modellunsicherheiten drastisch.'
      },
      {
        title: 'Minimal-Invasiver Substanzerhalt',
        description: 'Im Bestand gilt: So viel wie nötig, so wenig wie möglich eingreifen. Jeder zerstörende Eingriff schädigt historische Substanz und vernichtet graue Energie.',
        takeaway: 'Ertüchtigung durch Kraftumlagerung und intelligente Lastabtragung schlägt Abbruch und Neubau.'
      }
    ],
    systemicExplanation: 'Mit rund zwei Dritteln des Wohnungsbauvolumens (Bestandsmaßnahmen, DIW-Bauvolumenrechnung) ist das Bauen im Bestand die ökonomisch und ökologisch wichtigste Bauingenieursdisziplin. Das Modul vermittelt historische Mauerwerksverbände, Holzbalkendecken, frühe Betonbauweisen, ZfP-Bauwerksdiagnostik, Feuchtesanierung und statische Nachrechnungen nach EN 1990-2:2026.',
    zusammenhaengeText: 'Bauen im Bestand verbindet Werkstoffkunde (historische Kalke, Schlackenzemente), Schadensanalyse (Salz- und Feuchtebelastungen), Bauphysik (Innendämmung ohne Tauwasserschaden) und Tragwerksplanung.',
    graphicalPipelineTitle: 'Der 4-Phasen-Ablauf der Bestandssanierung',
    graphicalPipelineDesc: 'Vom Archiv über die Diagnose zur statischen Nachrechnung und denkmalgerechten Ertüchtigung:',
    steps: [
      {
        step: '1',
        title: 'Archivrecherche',
        subtitle: 'Bauakte & Historie',
        desc: 'Auswertung historischer Baupläne, Kriegsschäden, Sanierungsphasen und zeitgenössischer Normen.',
        iconName: 'Building2',
        keyFacts: ['Bauaktenarchiv', 'Historische Normen (DIN 1045 von 1925/1972)', 'Umbauhistorie'],
        normOrFormula: 'Archiv- & Quellenanalyse',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '2',
        title: 'Vor-Ort-Diagnose',
        subtitle: 'ZfP & Kartierung',
        desc: 'Zerstörungsfreie Prüfung, Bohrkernentnahme, Endoskopie, Riss- und Feuchtekartierung.',
        iconName: 'Microscope',
        keyFacts: ['Radar & Ultraschall', 'Bewehrungsdeckung & Korrosion', 'Salz- & Feuchteprofil'],
        normOrFormula: 'DIN EN 12504-1 / WTA-Merkblätter',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '3',
        title: 'Nachrechnung',
        subtitle: 'EN 1990-2:2026 Statik',
        desc: 'Statische Nachrechnung mit modifizierten Teilsicherheitsbeiwerten und Ist-Materialfestigkeiten.',
        iconName: 'Calculator',
        keyFacts: ['Aktivierung von Tragreserven', 'Reduzierte γ-Werte durch Prüfung', 'Grenztragfähigkeit'],
        normOrFormula: 'EN 1990-2:2026 / DBV-Merkblätter Bauen im Bestand',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '4',
        title: 'Ertüchtigung',
        subtitle: 'Sanierungskonzept',
        desc: 'Substanzerhaltende Verstärkung: CFK-Lamellen, Spritzbeton, Holz-Beton-Verbund, Mauerwerksvernadelung.',
        iconName: 'Wrench',
        keyFacts: ['Minimal-invasiv', 'Denkmalverträglichkeit', 'Reversible Maßnahmen'],
        normOrFormula: 'WTA / DIN EN 1504',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'Archivrecherche', to: 'Vor-Ort-Diagnose', relation: 'Hypothesenbildung', causeEffect: 'Erst das Wissen um den Baujahr-Stahl (z. B. Thomas-Stahl vs. BSt 220/340 = Betonstahl I, glatt, nach DIN 488:1972) steuert die Wahl der richtigen Schweißbarkeits- und Zugversuche.' },
      { from: 'Vor-Ort-Diagnose', to: 'Nachrechnung', relation: 'Ist-Zustands-Transfer', causeEffect: 'Verifizierte Betonfestigkeiten aus Bohrkernen senken die statistische Unsicherheit und erlauben den Nachweis ohne teure Verstärkungen.' },
      { from: 'Nachrechnung', to: 'Ertüchtigung', relation: 'Maßnahmendefinition', causeEffect: 'Zeigt die Nachrechnung nur ein lokales Schubversagen, reicht eine gezielte Einbringung von Querkraftschrauben statt eines Deckenabbruchs.' }
    ],
    practicalInsight: {
      title: 'Die goldene Altbauregel',
      desc: 'Niemals ohne Voruntersuchung eine Innendämmung anbringen! Innendämmung nur mit hygrothermischem Nachweis (DIN 4108-3, WTA 6-4/6-5): Die Wand wird kälter, die Tauwasser- und Frostgefahr steigt, Balkenköpfe in der Außenwand können geschädigt werden.'
    }
  },

  rueckbau: {
    title: 'Rückbau, Schadstoffe & Recycling',
    tagline: 'Selektiver Abbruch, Schadstoffkataster, Asbestsanierung und Ersatzbaustoffverordnung',
    leitfrage: 'Wie wandeln wir den Rückbau eines kontaminierten Gebäudes in eine werterhaltende Rohstoffmine um?',
    corePrinciples: [
      {
        title: 'Vom Abriss zum selektiven Rückbau',
        description: 'Der rohe Baggerbiss erzeugt unbrauchbaren Mischabbruch. Selektiver Rückbau demontiert schichtweise: Erst Schadstoffe (Asbest, KMF, PCB), dann Ausbau (Türen, Glas, Metalle), dann Hülle (Dämmung) und zuletzt der mineralische Rohbau.',
        takeaway: 'Sortenreinheit auf der Baustelle entscheidet über hochwertiges Recycling oder teure Deponierung.'
      },
      {
        title: 'Schadstofferkundung ist gesetzliche Pflicht',
        description: 'Bauten vor 1993 enthalten fast ausnahmslos Asbest (Spachtelmassen, Fliesenkleber, Putze, Rohre), Bauten vor 1975 oft PCB in Fugen und PAK in Teerklebern. Sanierung erfolgt streng nach TRGS 519 (Asbest) und TRGS 521 (KMF).',
        takeaway: 'Schadstoffüberraschungen während des Abbruchs führen zum sofortigen Baustopp durch die Gewerbeaufsicht.'
      },
      {
        title: 'Die Ersatzbaustoffverordnung (EBV)',
        description: 'Seit August 2023 regelt die EBV bundeseinheitlich das Ende der Abfalleigenschaft mineralischer Ersatzbaustoffe (MEB) für den Einbau in technischen Bauwerken (Straßenunterbau, Dämme, Lärmschutzwände).',
        takeaway: 'Geprüfter Recyclingschotter ist ein vollwertiger Bauproduktbaustein, kein Abfall.'
      }
    ],
    systemicExplanation: 'Dieses Modul deckt das Lebensende (End of Life) von Bauwerken ab. Es vermittelt Schadstoffkataster nach VDI 6202, Abbruchstatik, Arbeits- und Immissionsschutz sowie die Aufbereitung zu normgerechten RC-Gesteinskörnungen nach DIN EN 12620.',
    zusammenhaengeText: 'Rückbau ist der Beginn des neuen Materialkreislaufs: Er schließt die Lücke zur Nachhaltigkeit (Modul D) und liefert Zuschlagstoffe für die Betontechnologie (R-Beton).',
    graphicalPipelineTitle: 'Der geordnete, zirkuläre Rückbauprozess',
    graphicalPipelineDesc: 'Von der historischen Schadstofferkundung bis zur CE-zertifizierten Rezyklataufbereitung:',
    steps: [
      {
        step: '1',
        title: 'Schadstoffkataster',
        subtitle: 'VDI 6202 Erkundung',
        desc: 'Historische Erfassung, Probenahme auf Asbest, KMF, PCB, PAK, Schwermetalle.',
        iconName: 'AlertTriangle',
        keyFacts: ['TRGS 519 (Asbest)', 'TRGS 521 (KMF)', 'Schadstoffkataster'],
        normOrFormula: 'VDI 6202 Blatt 1/2',
        color: 'from-rose-600 to-rose-700'
      },
      {
        step: '2',
        title: 'Sanierung',
        subtitle: 'Schadstoffentfrachtung',
        desc: 'Arbeiten im Schwarzbereich unter Unterdruck, staubdichte Schleusen, fachgerechte Entsorgung.',
        iconName: 'ShieldCheck',
        keyFacts: ['Personalschutz', 'Freimessung VDI 3492', 'Entsorgungsnachweis'],
        normOrFormula: 'Gefahrstoffverordnung (GefStoffV)',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '3',
        title: 'Selektiver Rückbau',
        subtitle: 'Demontage von oben nach unten',
        desc: 'Entkernung von Ausbau, Dämmung und Fassade; statisch abgesicherter Abbruch des Tragwerks.',
        iconName: 'Trash2',
        keyFacts: ['Abbruchstatik', 'Sortenreine Container', 'Staub- & Lärmschutz'],
        normOrFormula: 'DIN 18007 / DIN EN 1991-1-6',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '4',
        title: 'Aufbereitung',
        subtitle: 'Brechen & Sieben',
        desc: 'Mobiles Brechen von Beton- und Ziegelbruch, Magnetabscheidung von Bewehrungsstahl, Siebung.',
        iconName: 'Layers',
        keyFacts: ['RC-Gesteinskörnung', 'Ersatzbaustoffverordnung (EBV)', 'Störstoffauslese'],
        normOrFormula: 'EBV / DIN EN 12620',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'Schadstoffkataster', to: 'Sanierung', relation: 'Gefahrenabwehr', causeEffect: 'Unerkannter Asbest im Fliesenkleber kontaminiert bei Brecherarbeiten die gesamte Bauschuttcharge und macht sie unbrauchbar.' },
      { from: 'Sanierung', to: 'Selektiver Rückbau', relation: 'Freigabe', causeEffect: 'Erst nach bestandener VDI-Freimessung (Asbestfasern < 500 F/m³) darf die konventionelle Entkernung starten.' },
      { from: 'Selektiver Rückbau', to: 'Aufbereitung', relation: 'Qualitätsgarantie', causeEffect: 'Gipsreste (Gipsputz) ruinieren Betonschotter; Sulfat erzeugt im neuen Beton Ettringittreiben. Daher Gips zwingend vorab entfernen!' }
    ],
    practicalInsight: {
      title: 'Die Sulfat-Falle im Recycling',
      desc: 'Gelangt Calciumsulfat (Gips) aus Trockenbauwänden in den mineralischen Bauschutt, übersteigt der Sulfatgehalt schnell die Grenzwerte der EBV. Der gesamte Schutt wird als Verwertungsstoff gesperrt und muss teuer deponiert werden!'
    }
  },

  dauerhaftigkeit: {
    title: 'Dauerhaftigkeit & Korrosionsschutz',
    tagline: 'Degradationsmodelle, Carbonatisierung, Chlorideindringung und Schutzmechanismen',
    leitfrage: 'Wie verhindert man, dass chemische und physikalische Umweltangriffe ein Tragwerk vor Ablauf seiner Lebensdauer zerstören?',
    corePrinciples: [
      {
        title: 'Passivierung & Depassivierung',
        description: 'Im Beton herrscht durch Calciumhydroxid (Ca(OH)2) ein hochalkalisches Milieu (pH ≈ 12,5–13,5). Dieses erzeugt auf dem Stahl eine hauchdünne Passivschicht aus Eisenoxiden. Sinkt der pH-Wert unter 9 (Carbonatisierung) oder überschreitet der Chloridgehalt ~0,4 % bezogen auf Zementgewicht, bricht die Passivierung zusammen.',
        takeaway: 'Bewehrungskorrosion startet nicht mit Sauerstoff, sondern mit dem Verlust der Passivschicht.'
      },
      {
        title: 'Das Tuutti-Modell der Lebensdauer',
        description: 'Dauerhaftigkeit teilt sich in zwei Phasen: 1. Initiierungsphase (Transport von CO2 oder Chloriden durch die Betondeckung bis zum Stahl, keine sichtbaren Schäden). 2. Propagationsphase (aktive Korrosion, Rostvolumenzunahme um Faktor 2–6, Abplatzungen).',
        takeaway: 'Wirtschaftliche Instandsetzung muss in der Initiierungsphase greifen, bevor der Beton abplatzt.'
      },
      {
        title: 'Die Schutzfunktion der Betondeckung c_nom',
        description: 'Die Betondeckung c_nom = c_min + Δc_dev ist die primäre Barriere. Da Diffusionsprozesse dem 2. Fick\'schen Gesetz folgen (Eindringtiefe proportional zur Quadratwurzel der Zeit: x ~ √(D·t)), verdoppelt eine Verdoppelung der Betondeckung die Schutzdauer um das Vierfache!',
        takeaway: '1 cm mehr Betondeckung schützt ein Bauteil besser als nachträgliche Beschichtungen.'
      }
    ],
    systemicExplanation: 'Dauerhaftigkeit ist die zeitliche Dimension des konstruktiven Ingenieurbaus. Dieses Modul analysiert Carbonatisierungsfortschritt, Chlorideindringung in Parkbauten und Brücken, Frost-Tausalz-Angriffe (XF), Alkali-Kieselsäure-Reaktionen (AKR) sowie Säure- und Sulfattreiben.',
    zusammenhaengeText: 'Dauerhaftigkeit verbindet Bauchemie (Korrosionskinetik) mit Betontechnologie (Expositionsklassen XC, XD, XS, XF, XA) und steuert die Mindestmaße der Stahlbetonbemessung.',
    graphicalPipelineTitle: 'Das Tuutti-Degradationsmodell der Lebensdauer',
    graphicalPipelineDesc: 'Vom ungestörten Neubau über die Diffusionsfront zum Korrosionsschaden:',
    steps: [
      {
        step: '1',
        title: 'Passiviert',
        subtitle: 'pH > 12.5 Neubau',
        desc: 'Intakte Eisenoxid-Passivschicht durch Calciumhydroxid im Porenwasser. Keine Korrosion.',
        iconName: 'ShieldCheck',
        keyFacts: ['pH 12.5–13.5', 'Ca(OH)2 Puffer', 'Fe-Passivschicht'],
        normOrFormula: 'pH \\ge 12{,}5',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        step: '2',
        title: 'Initiierung',
        subtitle: 'Diffusionsphase',
        desc: 'CO2 wandelt Ca(OH)2 in CaCO3 um (pH sinkt); oder Chloride wandern durch Kapillarporen.',
        iconName: 'Activity',
        keyFacts: ['2. Fick\'sches Gesetz', 'Kein Masseverlust', 'Messung mit Phenolphthalein'],
        normOrFormula: 'x(t) = k \\cdot \\sqrt{t}',
        color: 'from-blue-500 to-blue-600'
      },
      {
        step: '3',
        title: 'Depassivierung',
        subtitle: 'Kritischer Grenzwert',
        desc: 'Carbonatisierungsfront oder kritischer Chloridgehalt erreicht die Bewehrungsoberfläche.',
        iconName: 'AlertTriangle',
        keyFacts: ['pH < 9.0', 'Cl- > 0,4–0,5% m/z', 'Lochfraßgefahr'],
        normOrFormula: 'c_{crit} \\text{ erreicht}',
        color: 'from-amber-500 to-amber-600'
      },
      {
        step: '4',
        title: 'Propagation',
        subtitle: 'Aktive Korrosion',
        desc: 'Eisen löst sich anodisch auf, Rostbildung mit 3- bis 6-facher Volumenzunahme erzeugt Risse und Abplatzungen.',
        iconName: 'TrendingDown',
        keyFacts: ['Querschnittsverlust Stahl', 'Spaltzugrisse', 'Abplatzung der Betondeckung'],
        normOrFormula: 'Fe \\rightarrow Fe^{2+} + 2e^-',
        color: 'from-rose-500 to-rose-600'
      }
    ],
    interconnections: [
      { from: 'Passiviert', to: 'Initiierung', relation: 'Transportkinetik', causeEffect: 'Dichte Zemente (CEM III) und niedrige w/z-Werte senken den Diffusionskoeffizienten D und verlängern die Initiierungsphase von 20 auf 100 Jahre.' },
      { from: 'Initiierung', to: 'Depassivierung', relation: 'Schadensschwelle', causeEffect: 'Tausalzeintrag an Parkhausstützen depassiviert den Stahl ohne Carbonatisierung und führt zu verdecktem Lochfraß.' },
      { from: 'Depassivierung', to: 'Propagation', relation: 'Reaktionsantrieb', causeEffect: 'Sobald Feuchte und Sauerstoff Zutritt haben, treibt die elektrochemische Zelle Rost auf und sprengt die Betondeckung ab.' }
    ],
    practicalInsight: {
      title: 'Das t²-Gesetz',
      desc: 'Wird die Betondeckung um 50 % reduziert (z. B. 20 mm statt 40 mm durch mangelhafte Abstandhalter), sinkt die Zeit bis zur Korrosion nicht um die Hälfte, sondern auf ein Viertel!'
    }
  },

  schaeden: {
    title: 'Schadensdiagnostik & Forensik',
    tagline: 'Systematische Rissursachenanalyse, Schadensmechanismen und Gutachtenpraxis',
    leitfrage: 'Wie ermittelt man als Bausachverständiger zweifelsfrei die wahre Ursache eines Bauschadens aus Rissbildern und Schadenssymptomen?',
    corePrinciples: [
      {
        title: 'Symptom ist nicht Ursache',
        description: 'Ein Riss im Mauerwerk ist ein Symptom, keine Ursache. Die Ursache kann Baugrundsetzung, thermische Dehnung, unvollständige Betonerhärtung, fehlende Dehnfugen oder Feuchtequellung sein.',
        takeaway: 'Niemals den Riss verspachteln, ohne die Ursache eliminiert zu haben.'
      },
      {
        title: 'Rissmorphologie liest das Kraftfeld',
        description: 'Risse verlaufen immer rechtwinklig zur Hauptzugspannung. Biegerisse verlaufen von der Zugseite senkrecht zur Bauteilachse (bei Balken also vertikal); horizontale Risse in Wänden deuten eher auf Lagerfugenversagen, Kipp- oder Ausmittigkeitsprobleme, Längsrisse entlang der Bewehrung auf Korrosion; diagonale 45°-Risse auf Schub/Querkraft oder Baugrundsetzung, netzartige Risse auf Schwinden.',
        takeaway: 'Das Rissbild ist der Fingerabdruck der mechanischen Überlastung.'
      },
      {
        title: 'Die 4-teilige Schadensforensik',
        description: 'Jeder Schaden resultiert aus: 1. Planungsfehler (z. B. fehlende Fugen), 2. Materialfehler (z. B. mangelhafter Zement), 3. Ausführungsfehler (z. B. fehlende Nachbehandlung) oder 4. Nutzungsfehler (z. B. falsche Raumnutzung).',
        takeaway: 'Die gutachterliche Beweislast verlangt lückenlose Kausalketten.'
      }
    ],
    systemicExplanation: 'Dieses Modul ist die forensische Ursachenanalyse des Bauwesens. Es führt durch optische und instrumentelle Diagnoseverfahren (Risslupe, Rissmonitore, Rissbreitenmikroskope, Ultraschall, Kernbohrungen), ordnet Schadensbilder den physikalisch-chemischen Phänomenen zu und strukturiert Sachverständigengutachten nach VDI 6200.',
    zusammenhaengeText: 'Die Schadensdiagnostik schließt den Kreis aller Module: Sie deckt auf, wo Grundlagen, Betontechnologie, Bauphysik oder Ausführung versagt haben, und leitet direkt in die Instandsetzung über.',
    graphicalPipelineTitle: 'Der gutachterliche Schadensanalyse-Pfad',
    graphicalPipelineDesc: 'Vom Schadenssymptom über instrumentelle Diagnose zur nachvollziehbaren Kausalitätsprüfung:',
    steps: [
      {
        step: '1',
        title: 'Befundung',
        subtitle: 'Symptomerfassung',
        desc: 'Fotodokumentation, Risskartierung, Bestimmung von Rissbreite w, Rissverlauf und Rissdynamik (lebendig/ruhend).',
        iconName: 'AlertTriangle',
        keyFacts: ['Rissbreitenlineal', 'Gipsmarke / Rissmonitor', 'Feuchteindikation'],
        normOrFormula: 'Schadensprotokollierung',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '2',
        title: 'Messung',
        subtitle: 'Instrumentelle Diagnose',
        desc: 'Bohrkernentnahme, Carbonatisierungstiefe, Chloridprofil per Bohrmehl, Ultraschalllaufzeit, Feuchtemessung.',
        iconName: 'Microscope',
        keyFacts: ['Phenolphthalein-Test', 'Potenzialfeldmessung', 'Darr-Methode'],
        normOrFormula: 'DIN EN 12504 / WTA',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '3',
        title: 'Kausalität',
        subtitle: 'Ursachenanalyse',
        desc: 'Soll-Ist-Abgleich mit Statik, Baustoffnormen und Ausführungsplänen. Identifikation des Primärauslösers.',
        iconName: 'Compass',
        keyFacts: ['Planungs- vs. Ausführungsfehler', 'Normabweichung zum Bauzeitpunkt', 'Schadensmechanismus'],
        normOrFormula: 'BGB § 633 / a. R. d. T. zum Abnahmezeitpunkt',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '4',
        title: 'Bewertung',
        subtitle: 'Tragwirkung & Gutachten',
        desc: 'Beurteilung der Resttragfähigkeit, Einstufung in Standsicherheitsrisiko und Sanierungsempfehlung.',
        iconName: 'Scale',
        keyFacts: ['Gefahr im Verzug?', 'Gebrauchstauglichkeitsminderung', 'Sanierungskonzept'],
        normOrFormula: 'Gutachten nach BGB / VOB',
        color: 'from-rose-600 to-rose-700'
      }
    ],
    interconnections: [
      { from: 'Befundung', to: 'Messung', relation: 'Verdachtsmoment', causeEffect: 'Ein diagonaler Riss am Wandansatz lenkt die instrumentelle Prüfung gezielt auf Setzungsmessungen und Baugrunduntersuchungen.' },
      { from: 'Messung', to: 'Kausalität', relation: 'Beweisführung', causeEffect: 'Erst der Nachweis tiefer Carbonatisierung beweist, dass Betonabplatzungen auf mangelnde Betondeckung und nicht auf Frostschock zurückgehen.' },
      { from: 'Kausalität', to: 'Bewertung', relation: 'Handlungsanweisung', causeEffect: 'Ruhende Risse können kraftschlüssig verpresst werden; lebendige Risse erfordern Dehnfugen oder Baugrundinjektionen.' }
    ],
    practicalInsight: {
      title: 'Die Rissmonitor-Pflicht',
      desc: 'Vor jeder Risssanierung muss geprüft werden, ob der Riss ruht oder atmet. Ein mit Kunstharz starr verpresster Dehnungsriss bricht bei der nächsten Wintersaison 5 cm daneben wieder auf!'
    }
  },

  instandsetzung: {
    title: 'Schutz & Instandsetzung von Beton',
    tagline: 'DIN EN 1504, Instandsetzungsprinzipien, Untergrundvorbereitung und Oberflächenschutz',
    leitfrage: 'Wie stellt man Tragfähigkeit, Dichtigkeit und Korrosionsschutz geschädigter Betonbauteile dauerhaft wieder her?',
    corePrinciples: [
      {
        title: 'Die Instandsetzungsprinzipien nach DIN EN 1504',
        description: 'DIN EN 1504 und die DAfStb-Richtlinie (SIB) definieren exakte Prinzipien: Schutz vor Eindringen (PI), Feuchteregulierung (MC), Betonersatz/Reprofilierung (CR), Tragwerksverstärkung (SS), Physikalischer Widerstand (PR), Chemischer Widerstand (RC), Erhalt der Passivität (RP) und Kathodischer Schutz (CP).',
        takeaway: 'Keine Reparatur ohne Festlegung des normativen Instandsetzungsprinzips.'
      },
      {
        title: 'Untergrundvorbereitung ist 80 % des Erfolgs',
        description: 'Jeder Instandsetzungsmörtel hält nur so gut wie der Altbeton. Schadstellen müssen bis zum ungeschädigten Kern freigestemmt, Bewehrung entrostet (Sa 2½) und die Betonoberfläche aufgeraut werden (Hochdruckwasserstrahlen HDW mit 1000–2500 bar). Mindesthaftzugfestigkeit ≥ 1,5 N/mm².',
        takeaway: 'Schlechte Untergrundvorbereitung führt unweigerlich zu Hohlstellen und Abplatzungen.'
      },
      {
        title: 'Schichtenverbund & Oberflächenschutzsysteme (OS)',
        description: 'Nach der Reprofilierung schützen abgestimmte Oberflächenschutzsysteme (OS 1 bis OS 11) vor erneutem Chlorid- und CO2-Eintrag. Für rissgefährdete Flächen (z. B. Parkhäuser) sind rissüberbrückende Systeme (OS 8 / OS 11) zwingend.',
        takeaway: 'Reprofilieren heilt alte Schäden – das OS-System verhindert künftige.'
      }
    ],
    systemicExplanation: 'Schutz und Instandsetzung ist die Ingenieurschule zur Lebensdauerverlängerung. Das Modul vermittelt Untergrundvorbereitung, Korrosionsschutzanstriche der Bewehrung, polymermodifizierte Zementmörtel (PCC/SPCC), Spritzbeton, Rissinjektionen mit Epoxid- und Polyurethanharzen sowie Oberflächenschutzsysteme OS 1–11.',
    zusammenhaengeText: 'Das Modul greift die Diagnoseergebnisse aus "Mängel & Schäden" auf, wendet die Grenzwerte der "Dauerhaftigkeit" an und macht Bauwerke wieder fit für weitere 30 bis 50 Jahre Nutzungsdauer.',
    graphicalPipelineTitle: 'Der 5-Stufen-Instandsetzungsablauf nach DIN EN 1504',
    graphicalPipelineDesc: 'Vom Freilegen des korrodierten Stahls über den Schichtenaufbau zum dauerhaften Schutz:',
    steps: [
      {
        step: '1',
        title: 'Untergrund',
        subtitle: 'Abtragen & Entrosten',
        desc: 'Entfernen von carbonatisiertem Beton, Freilegen der Bewehrung um min. 15 mm, HDW-Strahlen.',
        iconName: 'Wrench',
        keyFacts: ['HDW bis 2500 bar', 'Entrostung Sa 2½', 'Haftzug f_ctm ≥ 1,5 MPa'],
        normOrFormula: 'DIN EN 1504-10',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '2',
        title: 'Korrosionsschutz',
        subtitle: 'Bewehrungsbeschichtung',
        desc: 'Zweifacher Auftrag mineralischer oder epoxidharzbasierter Korrosionsschutzbeschichtung.',
        iconName: 'ShieldCheck',
        keyFacts: ['Passivierungsschutz', 'Lückenlose Deckung', 'PCC-Schutzanstrich'],
        normOrFormula: 'Prinzip 11 (CP/RP)',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '3',
        title: 'Haftbrücke',
        subtitle: 'Verbundschicht',
        desc: 'Frisch-in-Frisch-Auftrag einer mineralischen Haftbrücke zur Vermeidung von Trennlagen.',
        iconName: 'Layers',
        keyFacts: ['Kein Antrocknen!', 'Kapillares Einmassieren', 'Schubfester Verbund'],
        normOrFormula: 'PCC-Haftbrücke',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '4',
        title: 'Reprofilierung',
        subtitle: 'Betonersatz Mörtel',
        desc: 'Auftrag von PCC/SPCC-Mörtel in Schichtdicken von 10–50 mm, hohlraumfreie Verdichtung.',
        iconName: 'Box',
        keyFacts: ['E-Modul-Kompatibilität', 'Schwindarmer Mörtel', 'Nachbehandlung feucht'],
        normOrFormula: 'DIN EN 1504-3 Klasse R3/R4',
        color: 'from-purple-600 to-purple-700'
      },
      {
        step: '5',
        title: 'Oberflächenschutz',
        subtitle: 'OS-System 1 bis 11',
        desc: 'Applikation von Imprägnierung (OS 1/2), Beschichtung (OS 4/5) oder rissüberbrückender Parkhausbeschichtung (OS 8/11).',
        iconName: 'Award',
        keyFacts: ['Rissüberbrückung dynamisch', 'Chlorsperre', 'Rutschhemmung R11/R12'],
        normOrFormula: 'DAfStb SIB / DIN EN 1504-2',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'Untergrund', to: 'Haftbrücke', relation: 'Verbundbasis', causeEffect: 'Ein feuchter, aber mattfeuchter Untergrund verhindert das vorzeitige Aufsaugen des Anmachwassers der Haftbrücke.' },
      { from: 'Haftbrücke', to: 'Reprofilierung', relation: 'Verbundübertragung', causeEffect: 'Wird die Haftbrücke trocken ("überbrannt"), wirkt sie als Trennschicht und der Mörtel fällt im ersten Winter ab.' },
      { from: 'Reprofilierung', to: 'Oberflächenschutz', relation: 'Schutzmantel', causeEffect: 'Das OS-System verhindert die erneute Wasseraufnahme des Reprofiliermörtels und sichert Frostbeständigkeit.' }
    ],
    practicalInsight: {
      title: 'Die "Frisch-in-Frisch"-Regel',
      desc: 'Das häufigste Versagen bei Betoninstandsetzungen: Die Haftbrücke wird aufgetragen und trocknet während der Mittagspause an. Wird der Mörtel auf die getrocknete Haftbrücke geschmiert, entsteht eine glatte Trennebene. Haftbrücke und Mörtel müssen zwingend frisch in frisch appliziert werden!'
    }
  },

  praxiswissen: {
    title: 'Praxiswissen, Bauleitung & VOB',
    tagline: 'Baustellenmanagement, VOB-Vertragsrecht, Bautagebuch und Qualitätsüberwachung',
    leitfrage: 'Wie steuert man die Baustelle rechtlich belastbar, termin- und qualitätskonform zwischen Entwurf, Bauleiter und Subunternehmern?',
    corePrinciples: [
      {
        title: 'Die VOB als Spielregel des Bauens',
        description: 'VOB/A regelt die Vergabe, VOB/B das Bauvertragsrecht und VOB/C die Allgemeinen Technischen Vertragsbedingungen (ATV). Bedenkenanmeldungen (§ 4 Abs. 3 VOB/B), Behinderungsanzeigen (§ 6 VOB/B) und Abnahme (§ 12 VOB/B) entscheiden über Millionenrisiken.',
        takeaway: 'Wer als Bauleiter Fristen versäumt oder Bedenken nicht schriftlich anmeldet, haftet persönlich.'
      },
      {
        title: 'Das Bautagebuch als beweissichere Urkunde',
        description: 'Tägliche lückenlose Dokumentation von Wetter (Temperatur, Niederschlag), Personalstärke je Gewerk, Geräteeinsatz, angelieferten Materialien (inkl. Lieferscheinnummern) und Baubehinderungen.',
        takeaway: 'Was nicht im Bautagebuch steht, hat juristisch auf der Baustelle nie stattgefunden.'
      },
      {
        title: 'Schnittstellenkoordination vor Ort',
        description: 'Bauschäden entstehen fast nie innerhalb eines Gewerks, sondern immer an den Schnittstellen: Rohbauer zu Fensterbauer (Kompriband/Dichtigkeit), Estrichleger zu Fliesenleger (Belegreife/CM-Messung).',
        takeaway: 'Qualitätsüberwachung bedeutet Schnittstellenüberwachung.'
      }
    ],
    systemicExplanation: 'Dieses Modul verbindet akademische Theorie mit der rauen Wirklichkeit der Baustelle. Es schult Bauleiter in VOB-Mängelrügen, Abnahmeprozessen, Lieferscheinprüfung bei Betonagen, Bewehrungsabnahmen vor dem Betonieren und digitaler Mängeldokumentation.',
    zusammenhaengeText: 'Praxiswissen ist der operative Realitätscheck aller Ingenieurmodule: Es setzt statische Pläne, betontechnologische Vorgaben und bauphysikalische Details in gebaute Realität um.',
    graphicalPipelineTitle: 'Der baubegleitende Qualitäts- und Rechtszyklus',
    graphicalPipelineDesc: 'Von der Arbeitsvorbereitung über Baustellenkontrollen zur rechtlich belastbaren VOB-Abnahme:',
    steps: [
      {
        step: '1',
        title: 'Vorbereitung',
        subtitle: 'Pläne & Verträge',
        desc: 'Planprüfung auf Baubarkeit, Bedenkenanmeldung nach VOB/B, Bauzeitenplan und Baustellenlogistik.',
        iconName: 'FileText',
        keyFacts: ['Bedenkenhinweis § 4 Abs. 3', 'Bauzeitenplan', 'Sicherheits- & Gesundheitsschutzplan (SiGe)'],
        normOrFormula: 'VOB/B & VOB/C',
        color: 'from-amber-600 to-amber-700'
      },
      {
        step: '2',
        title: 'Überwachung',
        subtitle: 'Bewehrungsabnahme & Betonage',
        desc: 'Prüfung von Bewehrungseisen, Abstandhaltern, Sauberkeit vor Betonage; Abgleich mit Bewehrungsplan.',
        iconName: 'HardHat',
        keyFacts: ['Betonierfreigabe', 'Abstandhalter c_nom', 'Lieferscheinkontrolle'],
        normOrFormula: 'DIN 1045-3 / ZTV-ING',
        color: 'from-blue-600 to-blue-700'
      },
      {
        step: '3',
        title: 'Dokumentation',
        subtitle: 'Bautagebuch & Prüfungen',
        desc: 'Tägliche Erfassung von Wetter, Mängeln, Behinderungsanzeigen, Frischbetonprüfungen (Konsistenz).',
        iconName: 'Wrench',
        keyFacts: ['Wetter & Mindesttemperaturen', 'Behinderungsanzeige § 6 VOB/B', 'Fotodokumentation'],
        normOrFormula: 'VOB/B § 6 & § 14',
        color: 'from-indigo-600 to-indigo-700'
      },
      {
        step: '4',
        title: 'Abnahme',
        subtitle: 'Gefahrenübergang § 12',
        desc: 'Förmliche Abnahme nach VOB/B, Umkehr der Beweislast, Beginn der Verjährungsfrist für Mängelansprüche.',
        iconName: 'CheckCircle2',
        keyFacts: ['Abnahmeprotokoll', 'Beweislastumkehr', '4–5 Jahre Gewährleistung'],
        normOrFormula: 'VOB/B § 12 & § 13',
        color: 'from-emerald-600 to-emerald-700'
      }
    ],
    interconnections: [
      { from: 'Vorbereitung', to: 'Überwachung', relation: 'Planfreigabe', causeEffect: 'Ein rechtzeitiger Bedenkenhinweis entlastet den Bauleiter von der Haftung für Planungsfehler des Architekten.' },
      { from: 'Überwachung', to: 'Dokumentation', relation: 'Beweissicherung', causeEffect: 'Fehlende Abstandhalter müssen vor dem Betonieren fotodokumentiert und korrigiert werden; im Festbeton ist der Fehler irreversibel.' },
      { from: 'Dokumentation', to: 'Abnahme', relation: 'Mängelausschluss', causeEffect: 'Lückenlose Bautagebücher schützen vor unberechtigten Vertragsstrafen bei witterungsbedingtem Bauverzug.' }
    ],
    practicalInsight: {
      title: 'Die Beweislast-Wende der Abnahme',
      desc: 'Vor der förmlichen Abnahme muss der Unternehmer beweisen, dass sein Werk mangelfrei ist. Nach der Abnahme dreht sich die Beweislast um 180 Grad: Nun muss der Bauherr beweisen, dass ein Mangel vorliegt! Daher niemals voreilig abnehmen.'
    }
  }
};
