import React, { useState } from 'react';
import { 
  Palette, 
  Eye, 
  Sun, 
  Clock, 
  Sparkles, 
  Layers, 
  Building2, 
  Compass, 
  Search, 
  Volume2, 
  Info,
  CheckCircle2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ARCHITEKTUR_MATERIALITAET, MaterialitaetInfo } from '@/src/data/architekturMaterialitaet';
import { useTabContext } from '@/src/contexts/TabContext';

interface MaterialVisualSpec {
  id: string;
  name: string;
  category: 'Mineralisch' | 'Metallisch' | 'Organisch' | 'Synthetisch & Verbund';
  swatchBg: string;
  accentBorder: string;
  tactileScale: 'sehr glatt' | 'glatt' | 'samtig-fein' | 'körnig-rau' | 'grob-reliefiert';
  thermalPerception: 'warm' | 'temperiert' | 'kühl' | 'kalt';
  reflectionType: 'Hochglanz (spiegelnd)' | 'Seidenglanz' | 'Halbmatt' | 'Diffus matt' | 'Lichtschluckend';
  iconicWork: string;
  famousArchitect: string;
  keyDetail: string;
}

const MATERIAL_CATALOG: MaterialVisualSpec[] = [
  {
    id: 'beton',
    name: 'Sichtbeton & Architekturbeton',
    category: 'Mineralisch',
    swatchBg: 'bg-slate-300 text-slate-800',
    accentBorder: 'border-slate-400',
    tactileScale: 'samtig-fein',
    thermalPerception: 'kühl',
    reflectionType: 'Halbmatt',
    iconicWork: 'Kirche des Lichts (Osaka) & Bruder-Klaus-Feldkapelle (Wachendorf)',
    famousArchitect: 'Tadao Ando / Peter Zumthor',
    keyDetail: 'Abdrücke von Holzschalungshaut, Ankerloch-Konusmuster und Faseleisten als Fassadenrhythmus.'
  },
  {
    id: 'mauerziegel',
    name: 'Mauerziegel & Klinker',
    category: 'Mineralisch',
    swatchBg: 'bg-amber-800 text-amber-100',
    accentBorder: 'border-amber-900',
    tactileScale: 'körnig-rau',
    thermalPerception: 'temperiert',
    reflectionType: 'Diffus matt',
    iconicWork: 'Chilehaus (Hamburg) & Bauakademie (Berlin)',
    famousArchitect: 'Fritz Höger / Karl Friedrich Schinkel',
    keyDetail: 'Plastische Schattenspiele durch zurückliegende Lagerfugen und Zierverbände (Kreuz- & Gotischer Verband).'
  },
  {
    id: 'gesteine',
    name: 'Naturstein (Gneis, Granit, Kalkstein)',
    category: 'Mineralisch',
    swatchBg: 'bg-stone-400 text-stone-900',
    accentBorder: 'border-stone-500',
    tactileScale: 'grob-reliefiert',
    thermalPerception: 'kalt',
    reflectionType: 'Halbmatt',
    iconicWork: 'Therme Vals (Graubünden) & Therme Vals (Graubünden) & Neue Nationalgalerie (Berlin, Granitterrasse)',
    famousArchitect: 'Peter Zumthor / David Chipperfield',
    keyDetail: 'Gespaltener Andeerer Gneis in feiner Schichtfuge, der Lichtreflexion des Thermalwassers aufnimmt.'
  },
  {
    id: 'kalk',
    name: 'Baukalk, Sumpfkalk & Tadelakt',
    category: 'Mineralisch',
    swatchBg: 'bg-amber-50 text-amber-900',
    accentBorder: 'border-amber-200',
    tactileScale: 'samtig-fein',
    thermalPerception: 'temperiert',
    reflectionType: 'Halbmatt',
    iconicWork: 'Venezianische Palazzi & Römische Bauten',
    famousArchitect: 'Andrea Palladio / Carlo Scarpa',
    keyDetail: 'Transparenter Tiefenglanz durch Calcit-Kristallisation (Fresko- und Marmorino-Technik).'
  },
  {
    id: 'lehmbau',
    name: 'Stampflehm & Lehmputze',
    category: 'Mineralisch',
    swatchBg: 'bg-amber-700/80 text-white',
    accentBorder: 'border-amber-800',
    tactileScale: 'körnig-rau',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: 'Kapelle der Versöhnung (Berlin) & Alnatura Campus (Darmstadt)',
    famousArchitect: 'Martin Rauch / Anna Heringer',
    keyDetail: 'Schichtweise gestampfte Sedimentstreifen mit natürlichem Farbübergang und offener Porigkeit.'
  },
  {
    id: 'glas',
    name: 'Architekturglas & Glashüllen',
    category: 'Mineralisch',
    swatchBg: 'bg-cyan-100 text-cyan-900',
    accentBorder: 'border-cyan-300',
    tactileScale: 'sehr glatt',
    thermalPerception: 'kalt',
    reflectionType: 'Hochglanz (spiegelnd)',
    iconicWork: 'Bauhaus Dessau & Louvre-Pyramide (Paris)',
    famousArchitect: 'Walter Gropius / I. M. Pei',
    keyDetail: 'Entmaterialisierung der Wand; Wechselwirkung zwischen Innenbeleuchtung bei Nacht und Spiegelung bei Tag.'
  },
  {
    id: 'stahl',
    name: 'Baustahl & Cortenstahl (Wetterfest)',
    category: 'Metallisch',
    swatchBg: 'bg-amber-900 text-amber-200',
    accentBorder: 'border-amber-950',
    tactileScale: 'körnig-rau',
    thermalPerception: 'kühl',
    reflectionType: 'Diffus matt',
    iconicWork: 'Neue Nationalgalerie (Berlin) & Torre Cajasol (Sevilla)',
    famousArchitect: 'Mies van der Rohe / César Pelli',
    keyDetail: 'Konstruktive Ehrlichkeit: Sichtbare Schweißnähte, I-Träger-Schlankheit oder samtige Rostpatina.'
  },
  {
    id: 'aluminium',
    name: 'Aluminium (Eloxiert & Pulverbeschichtet)',
    category: 'Metallisch',
    swatchBg: 'bg-slate-200 text-slate-700',
    accentBorder: 'border-slate-300',
    tactileScale: 'glatt',
    thermalPerception: 'kühl',
    reflectionType: 'Seidenglanz',
    iconicWork: 'Hong Kong and Shanghai Bank (Hongkong) & Willis Tower',
    famousArchitect: 'Norman Foster / SOM',
    keyDetail: 'Schlanke Pfosten-Riegel-Raster, aerodynamische Lamellenprofile mit reflexionsarmer Eloxalfärbung.'
  },
  {
    id: 'kupfer',
    name: 'Kupfer & Titanzink',
    category: 'Metallisch',
    swatchBg: 'bg-emerald-700 text-emerald-100',
    accentBorder: 'border-emerald-800',
    tactileScale: 'samtig-fein',
    thermalPerception: 'temperiert',
    reflectionType: 'Halbmatt',
    iconicWork: 'Jüdisches Museum (Berlin) & Stellwerk Basel',
    famousArchitect: 'Daniel Libeskind / Herzog & de Meuron',
    keyDetail: 'Metamorphe Alterung von metallischem Glanz über Dunkelbraun bis zur charakteristischen Grün-Patina.'
  },
  {
    id: 'holz',
    name: 'Massivholz & Brettsperrholz (CLT)',
    category: 'Organisch',
    swatchBg: 'bg-amber-100 text-amber-900',
    accentBorder: 'border-amber-300',
    tactileScale: 'samtig-fein',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: 'Mjøstårnet (Norwegen), Roots (Hamburg) & Tamedia (Zürich)',
    famousArchitect: 'Shigeru Ban / Voll Arkitekter',
    keyDetail: 'Sichtbare Jahrringe, Astbilder und natürliche Witterungsvergrauung als bewusster Entwurfsbestandteil.'
  },
  {
    id: 'holzwerkstoffe',
    name: 'Holzwerkstoffe (OSB, Furnierschichtholz, BSH)',
    category: 'Organisch',
    swatchBg: 'bg-amber-200/70 text-amber-900',
    accentBorder: 'border-amber-400',
    tactileScale: 'glatt',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: 'Centre Pompidou-Metz & Golfclub Haesley Nine Bridges',
    famousArchitect: 'Shigeru Ban / Frei Otto',
    keyDetail: 'Geometrisch präzise Holzgitter und filigrane Freiformschalen mit industrieller Holztextur.'
  },
  {
    id: 'kunststoffe',
    name: 'Membranen (ETFE, PTFE) & Polymere',
    category: 'Synthetisch & Verbund',
    swatchBg: 'bg-sky-100 text-sky-800',
    accentBorder: 'border-sky-300',
    tactileScale: 'sehr glatt',
    thermalPerception: 'temperiert',
    reflectionType: 'Hochglanz (spiegelnd)',
    iconicWork: 'Allianz Arena (München) & Eden Project (Cornwall)',
    famousArchitect: 'Herzog & de Meuron / Nicholas Grimshaw',
    keyDetail: 'Pneumatisch aufgeblasene Luftkissenkuben mit variierbarer Lichtdurchlässigkeit und Farbillumination.'
  }
];

export default function MaterialitaetArchitektur() {
  const { setActiveTab } = useTabContext();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('beton');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightModePreview, setLightModePreview] = useState<'sonne' | 'diffus' | 'nacht'>('sonne');

  const filteredMaterials = MATERIAL_CATALOG.filter(m => {
    const matchesCat = selectedCategory === 'Alle' || m.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.famousArchitect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.iconicWork.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeSpec = MATERIAL_CATALOG.find(m => m.id === selectedMaterialId) || MATERIAL_CATALOG[0];
  const activeDetail = ARCHITEKTUR_MATERIALITAET[activeSpec.id] || {
    optikTextur: "Texturierte Oberflächenbeschaffenheit mit charakteristischem Relief.",
    haptikOberflaeche: "Taktile Wahrnehmung je nach handwerklicher oder industrieller Vorbehandlung.",
    lichtReflexion: "Spezifisches Streu- und Reflexionsverhalten unter natürlichem Tageslicht.",
    alterungPatina: "Entwicklung von materialspezifischen Altersspuren und Oberflächenschutzschichten.",
    architekturBezug: "Zahlreiche Meilensteine moderner und historischer Baukunst."
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-shiraz/10 text-shiraz border border-shiraz/20">
                Architektur &amp; Entwurf
              </span>
              <span className="text-xs text-text-main/50 font-mono">Fachbereich II</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center gap-3">
              <Palette className="text-shiraz" size={28} /> Materialität &amp; Architektonische Ästhetik
            </h2>
            <p className="text-sm text-text-main/80 mt-1 max-w-3xl leading-relaxed">
              Die sinnliche Dimension der Baustoffe: Haptik, Lichtwirkung, Oberflächentextur, Schalungsstrukturen, Fugenrhythmen und die würdevolle Alterung (Patina) im architektonischen Entwurf.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sichtbeton')}
            className="px-4 py-2 rounded-xl bg-shiraz text-white hover:bg-shiraz/90 font-medium text-xs flex items-center gap-2 shadow-sm transition-all self-start md:self-center shrink-0 cursor-pointer"
          >
            <Building2 size={15} /> Zu Sichtbeton-Klassen (SB 1–4)
          </button>
        </div>

        {/* 4 Dimensionen der Materialität Info-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Eye size={15} className="text-shiraz" /> 1. Optik &amp; Textur
            </div>
            <p className="text-text-main/70 leading-normal">
              Korngefüge, Fugenmuster, Farbnuancen, Porigkeit und Schalungsabdrücke.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Sliders size={15} className="text-amber-700" /> 2. Taktilität &amp; Haptik
            </div>
            <p className="text-text-main/70 leading-normal">
              Wärmeeindringzahl (warm vs. kühl), Rauheit, Schärfe, Samtigkeit und Griffgefühl.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Sun size={15} className="text-amber-500" /> 3. Licht &amp; Reflexion
            </div>
            <p className="text-text-main/70 leading-normal">
              Spiegelung, diffuse Streuung, Transluzenz, Streiflicht-Schattentiefe im Tagesverlauf.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Clock size={15} className="text-emerald-700" /> 4. Würde des Alterns
            </div>
            <p className="text-text-main/70 leading-normal">
              Patina, Auswitterung, Vergrauung, Verharzung und konstruktiver Witterungsschutz.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-home-grau/30 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Alle', 'Mineralisch', 'Metallisch', 'Organisch', 'Synthetisch & Verbund'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-off-white text-text-main/75 hover:text-text-main hover:bg-home-grau/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Baustoff, Architekt, Bauwerk suchen..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-off-white border border-home-grau/30 focus:outline-none focus:ring-2 focus:ring-shiraz/40"
          />
        </div>
      </div>

      {/* Material Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Material Selector Grid */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredMaterials.map((mat) => {
            const isSelected = mat.id === selectedMaterialId;
            return (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterialId(mat.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-shiraz shadow-md ring-2 ring-shiraz/20'
                    : 'bg-white hover:bg-off-white/70 border-home-grau/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs border ${mat.swatchBg} ${mat.accentBorder}`}>
                    {mat.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-text-main truncate">{mat.name}</h4>
                      <span className="text-[10px] text-text-main/60 bg-off-white px-1.5 py-0.5 rounded border border-home-grau/20">
                        {mat.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-main/60 truncate mt-0.5">
                      {mat.iconicWork}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold text-shiraz block">
                    {mat.tactileScale}
                  </span>
                  <span className="text-[10px] text-text-main/50">
                    {mat.thermalPerception}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Rich Interactive Materiality Inspector */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
            
            {/* Header of selected material */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-shiraz">Materialitäts-Analyse</span>
                <h3 className="text-xl font-bold text-text-main">{activeSpec.name}</h3>
                <p className="text-xs text-text-main/70 mt-0.5">
                  Kategorie: <strong>{activeSpec.category}</strong> | Typische Haptik: <strong>{activeSpec.tactileScale}</strong>
                </p>
              </div>

              {/* Light simulation switcher */}
              <div className="flex items-center gap-1 bg-off-white p-1 rounded-lg border border-home-grau/20 self-start sm:self-center">
                <button
                  onClick={() => setLightModePreview('sonne')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'sonne' ? 'bg-white shadow-xs text-amber-600 font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title="Streiflicht / Direkte Sonne simulieren"
                >
                  <Sun size={13} /> Sonne
                </button>
                <button
                  onClick={() => setLightModePreview('diffus')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'diffus' ? 'bg-white shadow-xs text-slate-700 font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title="Diffuses Himmelslicht"
                >
                  <Eye size={13} /> Diffus
                </button>
                <button
                  onClick={() => setLightModePreview('nacht')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'nacht' ? 'bg-slate-900 text-amber-300 shadow-xs font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title="Kunstlicht / Nachtbeleuchtung"
                >
                  <Sparkles size={13} /> Nacht
                </button>
              </div>
            </div>

            {/* Simulated Architectural Surface Plate */}
            <div className={`p-6 rounded-xl border relative overflow-hidden transition-all duration-300 ${
              lightModePreview === 'sonne' 
                ? 'bg-gradient-to-br from-amber-50/70 via-stone-50 to-amber-100/40 border-amber-200/80 shadow-inner'
                : lightModePreview === 'diffus'
                ? 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 border-slate-300'
                : 'bg-slate-950 text-slate-100 border-slate-800 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${lightModePreview === 'nacht' ? 'text-amber-400' : 'text-shiraz'}`}>
                    Sinnliche Oberflächenwirkung ({lightModePreview.toUpperCase()}-BELEUCHTUNG)
                  </span>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${activeSpec.swatchBg} border ${activeSpec.accentBorder}`} />
                    {activeSpec.name} – {activeSpec.reflectionType}
                  </div>
                  <p className={`text-xs mt-1 max-w-md ${lightModePreview === 'nacht' ? 'text-slate-300' : 'text-text-main/80'}`}>
                    {activeSpec.keyDetail}
                  </p>
                </div>

                <div className={`p-3 rounded-lg border text-right shrink-0 text-xs ${
                  lightModePreview === 'nacht' ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white/90 border-home-grau/20 text-text-main'
                }`}>
                  <div className="font-semibold text-shiraz">Reflexionsverhalten:</div>
                  <div className="font-mono text-[11px]">{activeSpec.reflectionType}</div>
                  <div className="text-[10px] text-text-main/60 mt-1">Thermischer Kontakt: <strong>{activeSpec.thermalPerception}</strong></div>
                </div>
              </div>
            </div>

            {/* 4 Detail Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Eye size={15} className="text-shiraz" /> Optik, Textur &amp; Fügung
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.optikTextur}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Sliders size={15} className="text-amber-700" /> Taktilität, Haptik &amp; Berührung
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.haptikOberflaeche}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Sun size={15} className="text-amber-500" /> Lichtwirkung &amp; Schattenzeichnung
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.lichtReflexion}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Clock size={15} className="text-emerald-700" /> Alterung, Patina &amp; Verwitterung
                </div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.alterungPatina}
                </p>
              </div>
            </div>

            {/* Architectural reference box */}
            <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/20 flex items-start gap-3 text-xs">
              <Building2 size={20} className="text-shiraz shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-shiraz mb-1">Architekturikonen &amp; Baukunst-Referenzen:</h5>
                <p className="text-text-main/80 leading-relaxed mb-2">
                  {activeDetail.architekturBezug}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-main/70">
                  <span className="bg-white px-2 py-0.5 rounded border border-shiraz/20 font-medium">
                    Architekt/in: <strong>{activeSpec.famousArchitect}</strong>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-shiraz/20 font-medium">
                    Referenzbau: <strong>{activeSpec.iconicWork}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-home-grau/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-text-main/60">
                Detailliertes Steckbrief-Profil aufrufen:
              </span>
              <button
                onClick={() => {
                  // Direct navigation to specific module if exists
                  const targetMap: Record<string, any> = {
                    beton: 'beton_a_z',
                    mauerziegel: 'mauerwerk',
                    gesteine: 'gesteine',
                    kalk: 'kalk',
                    lehmbau: 'lehm',
                    glas: 'glas',
                    stahl: 'stahl',
                    aluminium: 'metalle',
                    kupfer: 'metalle',
                    holz: 'holz',
                    holzwerkstoffe: 'holzwerkstoffe',
                    kunststoffe: 'kunststoffe'
                  };
                  setActiveTab(targetMap[activeSpec.id] || 'baustoffe_info');
                }}
                className="px-3 py-1.5 bg-off-white hover:bg-white text-text-main font-semibold border border-home-grau/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Zum Fachmodul "{activeSpec.name.split(' ')[0]}"</span>
                <Compass size={14} className="text-shiraz" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Materialität (Architektur)', url: 'https://de.wikipedia.org/wiki/Materialit%C3%A4t' },
          { title: 'Sichtbeton', url: 'https://de.wikipedia.org/wiki/Sichtbeton' },
          { title: 'Patina', url: 'https://de.wikipedia.org/wiki/Patina' },
          { title: 'Klinker', url: 'https://de.wikipedia.org/wiki/Klinker' }
        ]}
        literatur={[
          'Zumthor, Peter (2006): Atmosphären. Birkhäuser Verlag, Basel.',
          'Pallasmaa, Juhani (2012): Die Augen der Haut. Architektur und die Sinne. Edition Detail, München.',
          'Hegger, M.; Auch-Schwelk, V.; Fuchs, M.; Rosenkranz, T. (2005): Baustoff Atlas. Edition Detail / Birkhäuser.',
          'Deplazes, Andrea (Hrsg.) (2018): Architektur konstruieren: Vom Rohmaterial zum Bauwerk. Birkhäuser Verlag.'
        ]}
        regelwerke={[
          { title: 'DBV/VDZ-Merkblatt Sichtbeton (Fassung Juni 2015)', url: 'https://www.beton.org/' },
          { title: 'DIN EN 13914-1/-2 mit DIN 18550-1/-2 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13914-1' },
          { title: 'DIN 18330 (VOB/C: Mauerarbeiten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18330' }
        ]}
        formeln={[
          {
            formel: 'b = \\sqrt{\\lambda \\cdot \\rho \\cdot c} \\quad [\\text{J} / (\\text{m}^2 \\text{K} \\sqrt{\\text{s}})]',
            erklaerung: 'Wärmeeindringkoeffizient b des Baustoffs: Bestimmt die taktile Temperaturwahrnehmung bei Berührung. Niedriges b (z. B. Holz b ≈ 400) fühlt sich sofort handwarm an; hohes b (z. B. Stahl b ≈ 14.000 oder Beton b ≈ 2.000) entzieht der Haut rasch Wärme und fühlt sich kühl/kalt an.',
            quelle: 'Bauphysik & Thermodynamik'
          },
          {
            formel: '\\rho_d + \\rho_s = 1 - \\alpha',
            erklaerung: 'Optische Strahlungsbilanz der Baustoffoberfläche: Summe aus diffuser Reflexion ρ_d und gerichteter Spiegelung ρ_s entspricht der nicht absorbierten Strahlung (1 - α).',
            quelle: 'Lichttechnik & Optik'
          }
        ]}
      />
    </div>
  );
}
