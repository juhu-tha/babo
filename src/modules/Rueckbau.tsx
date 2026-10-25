import { formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Recycle, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  BookOpen, 
  Info, 
  Clock, 
  Hammer, 
  FileText,
  ShieldCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { EraData, baustoffRecyclingData } from './rueckbau/daten';
import { AktualitaetTab } from './rueckbau/AktualitaetTab';
import { RechnerTab } from './rueckbau/RechnerTab';
import { BaustoffrecyclingTab } from './rueckbau/BaustoffrecyclingTab';

export default function Rueckbau() {
  const [activeTab, setActiveTab] = useState<'lfu_leitfaden' | 'schadstoffe' | 'baustoffrecycling' | 'rechner' | 'aktualitaet' | 'praxis'>('lfu_leitfaden');
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [selectedEra, setSelectedEra] = useState<'pre1970' | 'era1970_1990' | 'post1990'>('pre1970');
  const [selectedRecyclingMaterial, setSelectedRecyclingMaterial] = useState<number>(0);
  
  // Rechner states
  const [buildingVolume, setBuildingVolume] = useState<number>(2500); // m³
  const [structureType, setStructureType] = useState<'concrete' | 'masonry' | 'timber' | 'composite'>('masonry');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);

  // LfU 5-Phase selective dismantling process definitions
  const processPhases = [
    {
      num: 1,
      title: 'Bestandsaufnahme & Historische Erkundung',
      subtitle: 'Voruntersuchung & Archivrecherche',
      description: 'Zusammentragen von Altunterlagen (Statik, Pläne, Baugenehmigungen), Baujahr-Recherche und Analyse früherer Nutzungen (z.B. Gewerbebetriebe mit Ölen, Lösungsmitteln). Erstbegehung zur Feststellung von offensichtlich schadstoffverdächtigen Bauteilen.',
      checklists: [
        'Prüfung der Bauakte (Baujahr, Umbauten, Sanierungen)',
        'Ermittlung früherer Funktionen (z.B. chemische Reinigung, Werkstatt, Zahnarzt)',
        'Erfassen sichtbarer Schadstoffe (Leuchtstoffröhren, Kondensatoren, Asbestwellplatten)',
        'Erste Abstimmung mit der Kreisverwaltungsbehörde (Landratsamt/kreisfreie Stadt)'
      ],
      lfuStandard: 'Leitfaden Kap. 2.1: Grundlage für das weitere Vorgehen ist die lückenlose Dokumentation der Nutzungsgeschichte.'
    },
    {
      num: 2,
      title: 'Schadstoffkataster & Rückbaukonzept',
      subtitle: 'Baustoff- und Schadstoffinventar',
      description: 'Systematische Beprobung aller fraglichen Materialien durch akkreditierte Gutachter. Erstellung eines Schadstoffkatasters nach VDI 6202 Blatt 1 sowie eines strukturierten Rückbau- und Entsorgungskonzepts, das Mengen, Schadstoffklassen und Ziel-Recycling-Anlagen festlegt.',
      checklists: [
        'Probenahme von Wandputzen, Fliesenklebern (Asbestverdacht) und Fugendichtungsmassen (PCB)',
        'Quantifizierung aller schadstoffhaltigen Abfälle (Einstufung nach AVV)',
        'Erstellung des Abbruch- und Rückbaukonzepts (Anzeige bei der Unteren Bauaufsichtsbehörde)',
        'Ausarbeitung von Arbeits- und Sicherheitsplänen (AaS) gem. TRGS 524 / DGUV Regel 101-004'
      ],
      lfuStandard: 'Leitfaden Kap. 2.2: Beprobungspflicht für Lacke, Estriche, Kleber und künstliche Mineralfasern (KMF) vor Vergabe von Abbruchleistungen.'
    },
    {
      num: 3,
      title: 'Schadstoffsanierung & Entfrachtung',
      subtitle: 'Ausbau schadstoffbelasteter Bauteile vor dem Abbruch',
      description: 'Sämtliche Gefahrstoffe müssen staubdicht abgereiht, unter Unterdruckbedingungen ausgebaut und separat verpackt und entsorgt werden. Erst nach erfolgreicher Freigabemessung darf der mineralische Abbruch (Rohbauabbruch) beginnen, um Kreuzkontaminationen zu verhindern.',
      checklists: [
        'Fachgerechte Sanierung von Asbest (TRGS 519) und KMF (TRGS 521) durch zertifizierte Fachbetriebe',
        'Separierte Verpackung (z.B. Asbest in BigBags, KMF in staubdichten Säcken)',
        'Ausschleusen aus dem Gebäude, Vorlegen der Entsorgungsbelege (eANV für gefährliche Abfälle)',
        'Freigabe und Staubprüfung des entfrachteten Rohbaus'
      ],
      lfuStandard: 'Leitfaden Kap. 3.1 & 4.1: Eine Kontamination unbelasteten Bauschutts durch Schadstoffe beim Abbruch ist durch strikte Trennung zu verhindern.'
    },
    {
      num: 4,
      title: 'Sortenreiner Rückbau & Demontage',
      subtitle: 'Der selektive Rohbau-Rückbau',
      description: 'Der tatsächliche mineralische Abbruch erfolgt "von oben nach unten" und "von innen nach außen". Die Getrennthaltungspflichten der Gewerbeabfallverordnung (GewAbfV) greifen hier strikt: Ziegel, Beton, Holz, Metalle und Kunststoffe werden getrennt erfasst.',
      checklists: [
        'Abbruch in koordinierten Phasen: Zuerst Dachstuhl (Holz), dann nichttragendes Mauerwerk, zuletzt Stahlbetontragwerk',
        'Strikte stoffliche Trennung unmittelbar an der Abbruchstelle (keine Mischcontainer!)',
        'Gewährleistung von Staub- und Lärmschutz (Wasserberieselung zum Binden feiner Partikel)',
        'Erhalt von recyclingfähigem, hochwertigem Bauschutt zur Aufbereitung in RC-Großanlagen'
      ],
      lfuStandard: 'Leitfaden Kap. 4.2: Demontage von Fensterrahmen, Gipskarton und Bitumenbahnen ist zwingend vor dem Betonabbruch auszuführen.'
    },
    {
      num: 5,
      title: 'Aufbereitung, Verwertung & Deponierung',
      subtitle: 'Umgang mit den Abbruchstoffen',
      description: 'Der gewonnene mineralische Bauschutt wird zu güteüberwachtem Recycling-Baustoff (RC-Baustoffe) gebrochen und gesiebt. Nicht verwertbare Reststoffe (z.B. Gipsstaub, stark kontaminierte Mineralik) werden ordnungsgemäß auf Deponien (DK 0 bis DK III) entsorgt.',
      checklists: [
        'Transport mit Entsorgungsnachweisen an zugelassene stationäre oder mobile Recyclinganlagen',
        'Prüfung der Einbaufähigkeit nach der neuen Ersatzbaustoffverordnung (EBV) 2023',
        'Deponierung unlösbarer mineralischer Verbundstoffe unter Einhaltung der Grenzwerte der DepV',
        'Abschließende Dokumentation und Einreichen des Verwertungsnachweises bei den Aufsichtsbehörden'
      ],
      lfuStandard: 'Leitfaden Kap. 5 & 6: Bevorzugung von gütegesichertem RC-Material im Straßen- und Erdbau. Letzte Instanz ist die Deponie.'
    }
  ];

  // Era-based pollutant matrix data (LfU-specific & TRGS rules)
  const eraPollutants: Record<'pre1970' | 'era1970_1990' | 'post1990', EraData> = {
    pre1970: {
      title: 'Bis 1970 (Hochrisiko-Epoche)',
      description: 'In dieser Phase gab es kaum Einschränkungen für asbesthaltige Baustoffe, Steinkohlenteer-Produkte und hochgiftige Holzschutzmittel. Viele Schadstoffe sind unsichtbar im Putz, Estrich, Bitumen oder in Fugendichtungen verbaut.',
      dominantMaterials: ['Naturwerksteine, Ziegelmauerwerk', 'Bimsbeton, Schlackenbeton als Füllstoffe', 'Gerade und genietete Stahlträger', 'Erste Generation von Stahlbetonplatten (dünne Decken)'],
      pollutants: [
        {
          name: 'Asbest (fest & schwach gebunden)',
          chemical: 'Silikatminerale (Chrysotil, Krokydolith)',
          foundIn: 'Faserzementplatten (Eternit), Spritzasbest an Trägern, Fliesenkleber, Putz, Fensterkitte.',
          probability: 'Sehr hoch',
          handling: 'Staubfreier Ausbau unter Unterdruck, Personenschleusen, Vollschutz, TRGS 519 Zertifikat zwingend.',
          rules: 'Gefahrstoffverordnung (GefStoffV), TRGS 519'
        },
        {
          name: 'Teer & Pech (PAK)',
          chemical: 'Polyzyklische Aromatische Kohlenwasserstoffe',
          foundIn: 'Estrichkleber (Asphaltkleber), Dachpappen, teerhaltiger Holzpflasterkleber, Kaltbitumen-Anstriche.',
          probability: 'Sehr hoch',
          handling: 'Fräs- und Stemmarbeiten nur unter Atemschutz. PAK-verdächtiger Bauschutt darf nicht in normale Brechanlagen (Krebsgefahr!).',
          rules: 'DGUV Regel 101-004 (ehemals BGR 128), Ruva-StB (in Bayern historisch)'
        },
        {
          name: 'Polychlorierte Biphenyle (PCB)',
          chemical: 'PCB-Gemische (Weichmacher)',
          foundIn: 'Dauerelastische Fugendichtungsmassen (Thiokolfugen), Flammschutzanstriche, Deckenplatten kleber.',
          probability: 'Mittel',
          handling: 'Herausschneiden der Fugenflanken, Unterdruck, PCB-Richtlinie: Raumluft ≤ 300 ng/m³ Zielwert (langfristig tolerierbar), 300–3000 ng/m³ Quellensuche und mittelfristige Sanierung, > 3000 ng/m³ unverzügliche Sanierung (Gefahrenwert).',
          rules: 'PCB-Richtlinie (Bayern), TRGS 524'
        },
        {
          name: 'Blei & Schwermetalle',
          chemical: 'Schwermetalloxide',
          foundIn: 'Rote Bleimennige-Anstriche (Rostschutz auf Altstahl), Bleirohre in Sanitärinstallationen.',
          probability: 'Sehr hoch',
          handling: 'Staubarmes Absaugen, kein mechanisches Schleifen ohne Absaugung der Staubklasse M/H.',
          rules: 'TRGS 505 (Blei)'
        }
      ]
    },
    era1970_1990: {
      title: '1970 - 1990 (Konsolidierungs- und Übergangsphase)',
      description: 'Zunehmende Industrialisierung des Bauens (Fertigteile, Sandwichwände). Beginnende Verbote von Spritzasbest (1979) und PCP (1989), jedoch extrem hoher Einsatz von künstlichen Mineralfasern (alte lungenvergängliche Steinwolle) und Formaldehyd-Platten.',
      dominantMaterials: ['Großtafelbauwerke (Plattenbau)', 'Standardisierte Fertigteildecken', 'Extrem viel Gipskarton und Leichtbauplatten', 'Gegossener Transportbeton (normiert)'],
      pollutants: [
        {
          name: 'Asbest (v.a. in Bauchemikalien)',
          chemical: 'Chrysotilasbest',
          foundIn: 'Putzträger, Spachtelmassen, Fliesenkleber, Dichtungsbänder, Vinyl-Asbest-Bodenplatten (Flex-Platten).',
          probability: 'Sehr hoch',
          handling: 'Bohr- und Schleifverfahren nur unter anerkannten staubarmen Schutzverfahren (BT-Verfahren gem. DGUV).',
          rules: 'TRGS 519'
        },
        {
          name: 'Künstliche Mineralfasern (KMF - alt)',
          chemical: 'Glaswolle/Steinwolle (KI < 40)',
          foundIn: 'Lose Dachbodendämmungen, Trittschalldämmungen unter Estrich, Rohrleitungsisolierungen.',
          probability: 'Sehr hoch',
          handling: 'Alte Mineralwolle gilt als krebserzeugend. Ausbau nur im Schutzanzug und mit Atemschutz (Stb-Maske P2), Staubbindung durch Benetzung.',
          rules: 'TRGS 521'
        },
        {
          name: 'Holzschutzmittel (PCP & Lindan)',
          chemical: 'Pentachlorphenol, Hexachlorcyclohexan',
          foundIn: 'Imprägnierte Holzkonstruktionen (Dachstühle, Fachwerk), Holzzäune, Holzpaneele.',
          probability: 'Hoch',
          handling: 'Belastete Hölzer müssen separiert und als gefährlicher Abfall (Altholzkategorie A IV) in Spezial-Müllverbrennungsanlagen verbrannt werden.',
          rules: 'Altholzverordnung (AltholzV), PCP-Richtlinie'
        },
        {
          name: 'Formaldehyd',
          chemical: 'Methanal (Gasförmig gelöst)',
          foundIn: 'Spanplatten (Fertighäuser, Trennwände), Spanplatten-Klebstoff (Harnstoff-Formaldehyd-Harz).',
          probability: 'Hoch',
          handling: 'Gute Durchlüftung beim Abbruch, staubarmes Schneiden zur Vermeidung freigesetzter Formaldehydstäube.',
          rules: 'Gefahrstoffverordnung, Grenzwerte für Luftbelastung'
        }
      ]
    },
    post1990: {
      title: 'Ab 1990 (Moderne Bauära mit Restrisiken)',
      description: 'Asbestverbot ab 1993 in Deutschland. Die Schadstoffbelastung sinkt drastisch, allerdings müssen neuere Verbundstoffe, Flammschutzmittel wie HBCD (in EPS) und künstliche Mineralfasern (ohne Krebspotenzial, aber lungengängig) beachtet werden.',
      dominantMaterials: ['Hochfester Stahlbeton (C50/60+), filigrane Elementdecken', 'Wärmedämmverbundsysteme (WDVS)', 'Schnittstellenmauerwerke (Porenbeton, Planziegel)', 'Verbundwerkstoffe (GFK, carbonbewehrter Beton)'],
      pollutants: [
        {
          name: 'HBCD (Dämmstoffe)',
          chemical: 'Hexabromcyclododecan (Flammschutzmittel)',
          foundIn: 'Polystyrol-Dämmplatten (EPS/XPS) in Wärmedämmverbundsystemen (WDVS) vor Baujahr 2014.',
          probability: 'Hoch',
          handling: 'Gilt als POP (Persistent Organic Pollutant). Abfallschlüssel für gefährliche Baustoffe bei HBCD-Gehalt > 1000 mg/kg. Getrennthaltungspflicht vom normalen Bauschutt!',
          rules: 'POP-Verordnung der EU, Abfallverzeichnis-Verordnung (AVV)'
        },
        {
          name: 'Fluorierte Treibgase (FCKW/HFKW)',
          chemical: 'Chlorfluorkohlenwasserstoffe',
          foundIn: 'PU-Hartschaumdämmstoffe (Ortschaum-Isolierungen, Rohrschalen, Sandwichpaneele).',
          probability: 'Mittel',
          handling: 'Geordneter Ausbau ohne Zerstückelung, um Ausgasen zu verhindern. Spezialentsorgung zur Zerstörung der Treibgase.',
          rules: 'FCKW-Halon-Verordnung / POP-V'
        },
        {
          name: 'Künstliche Mineralfasern (KMF - neu)',
          chemical: 'Glas- und Steinwolle (KI >= 40)',
          foundIn: 'Wärme- und Brandschutzdämmungen.',
          probability: 'Sehr hoch',
          handling: 'Verschärfter Staubschutz, da Fasern mechanisch reizend sind. Jedoch bio-löslich und nicht krebserzeugend nachgewiesen.',
          rules: 'TRGS 521 (Schutzstufe II)'
        }
      ]
    }
  };

  // Selective Dismantling Mass Estimator Logic
  // Density constants in t/m³ (approximate bulk/solid values used in deconstruction engineering)
  const densities = {
    concrete: { concrete: 1.5, masonry: 0.1, wood: 0.05, metals: 0.06, plastics: 0.02, gypsum: 0.04, hazardous: 0.015, mixed: 0.08 },
    masonry: { concrete: 0.4, masonry: 1.2, wood: 0.08, metals: 0.04, plastics: 0.02, gypsum: 0.06, hazardous: 0.01, mixed: 0.09 },
    timber: { concrete: 0.2, masonry: 0.1, wood: 0.5, metals: 0.03, plastics: 0.03, gypsum: 0.12, hazardous: 0.025, mixed: 0.12 },
    composite: { concrete: 0.9, masonry: 0.6, wood: 0.08, metals: 0.08, plastics: 0.04, gypsum: 0.08, hazardous: 0.02, mixed: 0.14 }
  };

  const currentDensity = densities[structureType];
  const massConcrete = Math.round(buildingVolume * currentDensity.concrete);
  const massMasonry = Math.round(buildingVolume * currentDensity.masonry);
  const massWood = Math.round(buildingVolume * currentDensity.wood);
  const massMetals = Math.round(buildingVolume * currentDensity.metals);
  const massPlastics = Math.round(buildingVolume * currentDensity.plastics);
  const massGypsum = Math.round(buildingVolume * currentDensity.gypsum);
  const massHazardous = Math.round(buildingVolume * currentDensity.hazardous);
  const massMixed = Math.round(buildingVolume * currentDensity.mixed);

  const totalMass = massConcrete + massMasonry + massWood + massMetals + massPlastics + massGypsum + massHazardous + massMixed;
  const mineralPercentage = Math.round(((massConcrete + massMasonry) / (totalMass || 1)) * 100);

  return (
    <div className="space-y-8" id="rueckbau-modul">
      {/* Module Title Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-shiraz/10 text-shiraz text-xs font-bold uppercase px-2.5 py-1 rounded">
              Zirkuläres Bauen & Kreislaufwirtschaft
            </span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Baukörper-Rückbau & Material
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Systematische Entfrachtung, selektiver Abbruch und mineralische Aufbereitung nach den Richtlinien des 
              <strong> Bayerischen Landesamtes für Umwelt (LfU)</strong>. Aktualisiert mit den strengen Vorgaben der 
              <strong> Ersatzbaustoffverordnung (EBV) 2023</strong>.
          </p>
        </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex-shrink-0">
            <ShieldCheck size={28} className="text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-emerald-800">Gesetzlicher Status</div>
              <div className="text-xs font-medium text-emerald-700">Bundesweit harmonisiert (EBV)</div>
            </div>
          </div>
        </div>
        
        {/* Module Sub-navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-home-grau/30 pt-4">
          <button aria-pressed={activeTab === 'lfu_leitfaden'}
            onClick={() => setActiveTab('lfu_leitfaden')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'lfu_leitfaden' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <BookOpen size={14} /> LfU Rückbau-Leitfaden
          </button>
          <button aria-pressed={activeTab === 'schadstoffe'}
            onClick={() => setActiveTab('schadstoffe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'schadstoffe' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <AlertTriangle size={14} /> Schadstoff-Erkundung (VDI)
          </button>
          <button aria-pressed={activeTab === 'baustoffrecycling'}
            onClick={() => setActiveTab('baustoffrecycling')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'baustoffrecycling' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /> Baustoffrecycling
          </button>
          <button aria-pressed={activeTab === 'rechner'}
            onClick={() => setActiveTab('rechner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Hammer size={14} /> Masse- & Abfallrechner
          </button>
          <button aria-pressed={activeTab === 'aktualitaet'}
            onClick={() => setActiveTab('aktualitaet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'aktualitaet' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /> Aktualitäts-Check (EBV)
          </button>
          <button aria-pressed={activeTab === 'praxis'}
            onClick={() => setActiveTab('praxis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <FileText size={14} /> Praxis-Szenarien & Behörden
          </button>
        </div>
      </div>

      {/* TAB 1: LfU Rückbau-Leitfaden */}
      {activeTab === 'lfu_leitfaden' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline navigation Left (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                <Clock size={16} className="text-shiraz" /> Phasen des selektiven Rückbaus
              </h3>
              <p className="text-xs text-text-main/70 mb-4">
                Der LfU-Leitfaden empfiehlt ein stufenweises Vorgehen, um schadstofffreien Bauschutt zu erhalten.
              </p>
              
              <div className="space-y-1">
                {processPhases.map((phase) => (
                  <button
                    key={phase.num}
                    onClick={() => setSelectedPhase(phase.num)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      selectedPhase === phase.num
                        ? 'bg-shiraz/5 border-shiraz/50 shadow-sm'
                        : 'bg-off-white border-transparent hover:bg-home-grau/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      selectedPhase === phase.num ? 'bg-shiraz text-white' : 'bg-home-grau/20 text-text-main'
                    }`}>
                      {phase.num}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${selectedPhase === phase.num ? 'text-shiraz' : 'text-text-main'}`}>
                        {phase.title}
                      </h4>
                      <p className="text-xs text-text-main/60 mt-0.5 line-clamp-1">{phase.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-amber-700" /> Getrennthaltung und Schadstoffentfrachtung vor dem Abbruch (Vermischungsverbot, § 9 Abs. 2 KrWG / GewAbfV)
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Bauschutt gilt abfallrechtlich nach dem Vermischungsverbot bereits als 
                kontaminiert, wenn er vor dem Abbruch nicht ordnungsgemäß von anhaftenden Fremd- und Schadstoffen 
                (wie asbesthaltigem Putz, PAK-Kleber oder Bitumen) entfrachtet wurde!
              </p>
            </div>
          </div>

          {/* Details Right (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-home-grau/10">
                <span className="text-3xl font-extrabold text-shiraz/70">Phase 0{formatDeWert(selectedPhase)}</span>
                <div>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                    {processPhases[selectedPhase - 1].title}
                  </h3>
                  <span className="text-xs text-text-main/60 font-medium">
                    {processPhases[selectedPhase - 1].subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-1">Beschreibung</h4>
                  <p className="text-xs text-text-main leading-relaxed bg-off-white p-3 rounded-lg border border-home-grau/10">
                    {processPhases[selectedPhase - 1].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-2">Checkliste zur Umsetzung</h4>
                  <ul className="space-y-2">
                    {processPhases[selectedPhase - 1].checklists.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-home-grau/15 bg-slate-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <Info size={13} className="text-shiraz" /> Original-Anforderung (LfU Leitfaden)
              </h4>
              <p className="text-xs italic text-slate-700 font-medium leading-relaxed">
                "{processPhases[selectedPhase - 1].lfuStandard}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Schadstoff-Detektor */}
      {activeTab === 'schadstoffe' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/15 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-main">Epochen-Schadstoff-Matrix</h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p>
                    Wählen Sie die Bauwerksepoche aus, um die baujahrtypischen Schadstoffquellen nach VDI 6202 und LfU-Kriterien zu visualisieren.
                  </p>
                </div>
              </div>
              
              {/* Era selector tabs */}
              <div className="flex rounded-lg bg-off-white p-1 border border-home-grau/30">
                <button aria-pressed={selectedEra === 'pre1970'}
                  onClick={() => setSelectedEra('pre1970')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'pre1970' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Bis 1970
                </button>
                <button aria-pressed={selectedEra === 'era1970_1990'}
                  onClick={() => setSelectedEra('era1970_1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'era1970_1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  1970 - 1990
                </button>
                <button aria-pressed={selectedEra === 'post1990'}
                  onClick={() => setSelectedEra('post1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'post1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Nach 1990
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Era summary card */}
              <div className="md:col-span-4 bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-shiraz mb-1">{eraPollutants[selectedEra].title}</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    {eraPollutants[selectedEra].description}
                  </p>
                </div>
                
                <div className="border-t border-home-grau/30 pt-3">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">Dominierende Tragwerkstypen:</h5>
                  <ul className="space-y-1">
                    {eraPollutants[selectedEra].dominantMaterials.map((mat, i) => (
                      <li key={i} className="text-xs text-text-main/70 flex items-center gap-1.5">
                        <ChevronRight size={12} className="text-shiraz" /> {mat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pollutants details view */}
              <div className="md:col-span-8 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60">Schadstoff-Katasterkarten</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eraPollutants[selectedEra].pollutants.map((pollutant, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="text-xs font-bold text-slate-800 leading-tight">{pollutant.name}</h5>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                            pollutant.probability === 'Sehr hoch' 
                              ? 'bg-red-100 text-red-800' 
                              : pollutant.probability === 'Hoch' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Präsenz: {pollutant.probability}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{pollutant.chemical}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block">Vorkommen:</span>
                            <span className="text-xs text-text-main leading-relaxed">{pollutant.foundIn}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block">Sanierung & Demontageschutz:</span>
                            <span className="text-xs text-text-main leading-relaxed italic">{pollutant.handling}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-home-grau/10 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-2 px-4 rounded-b-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase">Regelwerk:</span>
                        <span className="text-xs font-mono font-bold text-shiraz">{pollutant.rules}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* TRGS Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 block"></span> TRGS 519 (Asbest)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regelt Abbruch-, Sanierungs- und Instandhaltungsarbeiten (ASI) mit Asbest. Fachkunde nach Anlage 3 oder 4 ist zwingend erforderlich. Arbeiten müssen 7 Tage vorab beim Gewerbeaufsichtsamt angemeldet werden.
              </p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 block"></span> TRGS 521 (Mineralfasern)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regelt den Schutz bei mineralischen Dämmstoffen. Für krebserzeugendes "altes" KMF (Einbau vor 2000) gelten strikte Schutzmaßnahmen (Staubschutzstufe II: Ganzkörperanzug, Masken, Staubunterdrückung).
              </p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 block"></span> TRGS 524 / DGUV 101-004
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sicherheit und Gesundheitsschutz bei der Arbeit in kontaminierten Bereichen (z.B. PCB in dauerelastischen Fugen oder PAK-kontaminierte Böden und Untergründe). Erfordert Sachkundennachweis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Baustoffrecycling */}
      {activeTab === 'baustoffrecycling' && (
        <BaustoffrecyclingTab setSelectedRecyclingMaterial={setSelectedRecyclingMaterial} selectedRecyclingMaterial={selectedRecyclingMaterial} />
      )}

      {/* TAB 3: Masse- & Abfallrechner */}
      {activeTab === 'rechner' && (
        <RechnerTab setBuildingVolume={setBuildingVolume} setStructureType={setStructureType} buildingVolume={buildingVolume} structureType={structureType} totalMass={totalMass} mineralPercentage={mineralPercentage} massConcrete={massConcrete} massMasonry={massMasonry} massWood={massWood} massMetals={massMetals} massGypsum={massGypsum} massPlastics={massPlastics} massHazardous={massHazardous} massMixed={massMixed} setShowCalculations={setShowCalculations} showCalculations={showCalculations} currentDensity={currentDensity} />
      )}

      {/* TAB 4: Aktualitäts-Check */}
      {activeTab === 'aktualitaet' && (
        <AktualitaetTab />
      )}

      {/* TAB 5: Praxis-Szenarien & Behördenwegweiser */}
      {activeTab === 'praxis' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bavaria specific workflow map */}
          <div className="md:col-span-4 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-home-grau/10">
              <FileCheck size={16} className="text-shiraz" /> Behördenwegweiser Bayern
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Die bauordnungs- und abfallrechtliche Vorbereitung eines Rückbaus in einer bayerischen Gemeinde / Kreisstadt erfordert feste Schritte:
            </p>

            <div className="relative border-l border-shiraz pl-4 space-y-4 ml-2">
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-xs font-bold text-text-main block">Gemeinde / Bauordnungsamt</span>
                <p className="text-xs text-text-main/70">Beseitigung baulicher Anlagen nach BayBO Art. 57 Abs. 5 (verfahrensfrei, je nach Anlage mit Anzeige vorab; Fristen im Gesetzestext prüfen).
          </p>
        </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-xs font-bold text-text-main block">Untere Umweltschutzbehörde</span>
                <p className="text-xs text-text-main/70">Vorlage des Schadstoffkatasters (VDI 6202 Blatt 1) für asbestbelastete Putze oder PCB-Fugen.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-xs font-bold text-text-main block">Gewerbeaufsichtsamt (GAA)</span>
                <p className="text-xs text-text-main/70">Anzeige der Asbesttätigkeiten mindestens eine Woche vor Beginn (§ 11a GefStoffV, TRGS 519).</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span className="text-xs font-bold text-text-main block">LfU / Abfallregister (eANV)</span>
                <p className="text-xs text-text-main/70">Elektronisches Nachweisverfahren (Begleitscheine und Übernahmescheine gefährlicher Abfälle).</p>
              </div>
            </div>
          </div>

          {/* Real-world Scenarios (8 cols) */}
          <div className="md:col-span-8 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="text-sm font-bold text-text-main mb-4">Typische Rückbaufehler & Pitfalls aus der Praxis</h3>
            
            <div className="space-y-4">
              <div className="border border-red-200 bg-red-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span> Schadstoffverschleppung im Putz (Asbestfalle)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ein altes Bürogebäude (Baujahr 1978) wird maschinell abgebrochen. Der Putz enthält 
                  flächig verteilt 0,1 % Asbest (früher üblich als Haftvermittler). 
                </p>
                <div className="text-xs text-red-800 font-semibold bg-red-100/30 p-2 rounded">
                  <strong>Die LfU-Konsequenz:</strong> Ohne vorherige Entfrachtung des asbesthaltigen Putzes (durch Fräsverfahren) 
                  kontaminiert der Abbruch den gesamten Ziegel- und Betonabbruch. Tonnenweise Material muss unter extrem 
                  hohen Kosten als Sondermüll auf Deponien (DK III) entsorgt werden, anstatt hochwertig aufbereitet zu werden.
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 block"></span> Mangelhafte Dokumentation der GewAbfV
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ein Generalunternehmer mischt Altholz (A II-Fensterrahmen) und Gipskartonplatten im Bauschuttcontainer, um Transportkosten zu sparen.
                </p>
                <div className="text-xs text-orange-900 font-semibold bg-orange-100/30 p-2 rounded">
                  <strong>Die Kontrollreaktion:</strong> Der Deponiebetreiber bzw. die Aufbereitungsanlage weist die Charge zurück (Gipsstaub sulfatiert Asphaltdeckschichten). Das LfU ordnet ein empfindliches Bußgeld an und beschlagnahmt die nicht deklarierten Transportfahrzeuge.
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block"></span> Verwertung von Asphalt im Wegebau
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ausbauasphalt aus einer alten Betriebseinfahrt wird ohne Voruntersuchung (Teerfreiheit) aufbereitet und als Frostschutzschicht im Wegebau wieder eingebaut.
                </p>
                <div className="text-xs text-indigo-900 font-semibold bg-blue-100/30 p-2 rounded">
                  <strong>Die gesetzliche Hürde (EBV):</strong> Teerhaltiger Straßenaufbruch (PAK-reich) hat im Erdbau absolut nichts verloren (Gefahr der Auswaschung ins Grundwasser). Vor Einbau ist eine Bindemittelanalyse zwingend erforderlich. Belasteter Asphalt muss thermisch dekarbonisiert werden.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer references */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Massenbilanz für den Rückbau eines Bürogebäudes"
        zielGleichung="m_i = V_i \cdot \rho_i, \quad Q_{min} = \frac{\sum m_{min}}{\sum m_i}"
        schritte={[
          { titel: 'Mengen aus dem Rückbaukonzept', erklaerung: 'Beton 1 200 m³ (ρ = 2,4 t/m³), Mauerwerk 300 m³ (1,6 t/m³), Holz 60 m³ (0,5 t/m³), Metalle 40 t:', formel: 'm_B = 2\\,880\\,\\text{t}, \\; m_Z = 480\\,\\text{t}, \\; m_H = 30\\,\\text{t}, \\; m_M = 40\\,\\text{t}' },
          { titel: 'Gesamtmasse', erklaerung: 'Summe der Hauptfraktionen:', formel: '\\sum m_i = 2\\,880 + 480 + 30 + 40 = 3\\,430\\,\\text{t}' },
          { titel: 'Mineralischer Anteil', erklaerung: 'Beton und Mauerwerk:', formel: 'Q_{min} = \\frac{3\\,360}{3\\,430} = 0{,}98 = 98\\,\\%' }
        ]}
        ergebnisHinweis="Die mineralischen Fraktionen bestimmen Logistik und Verwertung. Nach § 8 GewAbfV sind Beton (17 01 01) und Ziegel (17 01 02) getrennt zu halten, soweit technisch möglich und wirtschaftlich zumutbar; ab 10 m³ Abfall ist die Getrennthaltung zu dokumentieren."
        normQuelle="GewAbfV § 8; DIN SPEC 91484:2023-09"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Kostenvergleich selektiver Rückbau gegen Gemischentsorgung"
        zielGleichung="\Delta K = m \cdot (p_{Gemisch} - p_{getrennt}) - K_{Sortierung}"
        schritte={[
          { titel: 'Ansatz', erklaerung: 'Mauerwerks- und Betonabbruch 3 360 t; Annahmepreis RC-Anlage sortenrein 12 €/t, Bauschuttgemisch mit Störstoffen 35 €/t (Lehrwerte):', formel: 'p_{Gemisch} - p_{getrennt} = 23\\,\\text{€/t}' },
          { titel: 'Mehrkosten Entkernung', erklaerung: 'Zusätzlicher Personal- und Geräteeinsatz für die Entkernung: 40 000 €.', formel: 'K_{Sortierung} = 40\\,000\\,\\text{€}' },
          { titel: 'Ergebnis', erklaerung: 'Einsparung durch selektiven Rückbau:', formel: '\\Delta K = 3\\,360 \\cdot 23 - 40\\,000 = 37\\,280\\,\\text{€}' }
        ]}
        ergebnisHinweis="Regionale Annahmepreise schwanken stark; die Rechnung zeigt das Prinzip. Bei Schadstofffunden (z. B. asbesthaltiger Putz) kann die gesamte Charge als gefährlicher Abfall gelten – deshalb Schadstofferkundung vor dem Abbruch."
        normQuelle="GewAbfV §§ 8, 9; VDI 6210 Blatt 1:2025-10"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="rueckbau" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 9 Rückbau & Schadstoffe: GewAbfV §§ 8/9, EBV §§ 19/22, GefStoffV § 5a, Normausgaben DIN 18007, VDI 6210, DIN SPEC 91484/91525 geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Rückbau (Bauwesen)', url: 'https://de.wikipedia.org/wiki/R%C3%BCckbau' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' }
        ]}
        literatur={[
          'Bayerisches Landesamt für Umwelt (LfU): Leitfaden für den umweltgerechten Rückbau von Gebäuden (Augsburg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 18007:2022-09 (Abbrucharbeiten – Begriffe, Verfahren, Anwendungsbereiche)' },
          { title: 'VDI 6210 Blatt 1:2025-10 (Abbruch von baulichen und technischen Anlagen)' },
          { title: 'DIN SPEC 91484:2023-09 (Erfassung von Bauprodukten vor Abbruch- und Renovierungsarbeiten, Pre-Demolition Audit)' },
          { title: 'DIN SPEC 91525:2026-02 (Anschlussnutzungskonzept für Bauprodukte aus Bestandsgebäuden)' },
          { title: 'VDI/GVSS 6202 Blatt 1:2013-10 (Schadstoffbelastete bauliche und technische Anlagen – Abbruch-, Sanierungs- und Instandhaltungsarbeiten)' },
          { title: 'Ersatzbaustoffverordnung (EBV)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Gewerbeabfallverordnung (GewAbfV)', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' },
          { title: 'TRGS 519 (Asbest), Fassung 2014, zuletzt geändert 28.01.2025', url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-519' }
        ]}
        formeln={[
          {
            formel: 'Q_{\\text{getrennt}} = \\frac{\\sum m_{\\text{getrennt}}}{\\sum m_{\\text{gesamt}}}',
            erklaerung: 'Getrenntsammlungsquote als Kennzahl zur Dokumentation der Getrennthaltung der zehn Fraktionen nach § 8 GewAbfV. Eine feste Mindestquote gibt es für Bauabfälle nicht; die 90-%-Quote des § 4 Abs. 3 betrifft gewerbliche Siedlungsabfälle.',
            quelle: 'GewAbfV §§ 4, 8'
          },
          {
            formel: 'C_{\\text{Eluat}} \\le C_{\\text{MEW}} \\quad [\\mu\\text{g/l bzw. mg/l}]',
            erklaerung: 'Eluat-Grenzwerteinhaltung nach Ersatzbaustoffverordnung (EBV) zur Klassifizierung mineralischer Ersatzbaustoffe (z.B. RC-1, RC-2) und Vermeidung von Grundwassereinträgen.',
            quelle: 'EBV Anlage 1 & 2'
          }
        ]}
      />
    </div>
  );
}
