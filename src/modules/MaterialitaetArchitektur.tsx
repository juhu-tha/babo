import type { TabId } from '@/src/contexts/TabContext';
import React, { useState } from 'react';
import { 
  Palette, 
  Eye, 
  Sun, 
  Clock, 
  Sparkles, 
  Building2, 
  Compass, 
  Search,
  Sliders
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ARCHITEKTUR_MATERIALITAET } from '@/src/data/architekturMaterialitaet';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/materialitaetarchitektur/MaterialitaetArchitektur.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

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
    name: inhalt.werte.sichtbetonArchitekturbeton,
    category: 'Mineralisch',
    swatchBg: 'bg-slate-300 text-slate-800',
    accentBorder: 'border-slate-400',
    tactileScale: 'samtig-fein',
    thermalPerception: 'kühl',
    reflectionType: 'Halbmatt',
    iconicWork: inhalt.werte.kircheDesLichtsOsaka,
    famousArchitect: inhalt.werte.tadaoAndoPeterZumthor,
    keyDetail: inhalt.werte.abdrückeVonHolzschalungshautAnkerloch
  },
  {
    id: 'mauerziegel',
    name: inhalt.werte.mauerziegelKlinker,
    category: 'Mineralisch',
    swatchBg: 'bg-amber-800 text-amber-100',
    accentBorder: 'border-amber-900',
    tactileScale: 'körnig-rau',
    thermalPerception: 'temperiert',
    reflectionType: 'Diffus matt',
    iconicWork: inhalt.werte.chilehausHamburgBauakademieBerlin,
    famousArchitect: inhalt.werte.fritzHögerKarlFriedrich,
    keyDetail: inhalt.werte.plastischeSchattenspieleDurchZurückliege
  },
  {
    id: 'gesteine',
    name: inhalt.werte.natursteinGneisGranitKalkstein,
    category: 'Mineralisch',
    swatchBg: 'bg-stone-400 text-stone-900',
    accentBorder: 'border-stone-500',
    tactileScale: 'grob-reliefiert',
    thermalPerception: 'kalt',
    reflectionType: 'Halbmatt',
    iconicWork: inhalt.werte.thermeValsGraubündenNeue,
    famousArchitect: inhalt.werte.peterZumthorDavidChipperfield,
    keyDetail: inhalt.werte.geschichtetePlattenAusValser
  },
  {
    id: 'kalk',
    name: inhalt.werte.baukalkSumpfkalkTadelakt,
    category: 'Mineralisch',
    swatchBg: 'bg-amber-50 text-amber-900',
    accentBorder: 'border-amber-200',
    tactileScale: 'samtig-fein',
    thermalPerception: 'temperiert',
    reflectionType: 'Halbmatt',
    iconicWork: inhalt.werte.venezianischePalazziRömischeBauten,
    famousArchitect: inhalt.werte.andreaPalladioCarloScarpa,
    keyDetail: inhalt.werte.transparenterTiefenglanzDurchCalcit
  },
  {
    id: 'lehmbau',
    name: inhalt.werte.stampflehmLehmputze,
    category: 'Mineralisch',
    swatchBg: 'bg-amber-700/80 text-white',
    accentBorder: 'border-amber-800',
    tactileScale: 'körnig-rau',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: inhalt.werte.kapelleDerVersöhnungBerlin,
    famousArchitect: inhalt.werte.martinRauchAnnaHeringer,
    keyDetail: inhalt.werte.schichtweiseGestampfteSedimentstreifenMi
  },
  {
    id: 'glas',
    name: inhalt.werte.architekturglasGlashüllen,
    category: 'Mineralisch',
    swatchBg: 'bg-cyan-100 text-cyan-900',
    accentBorder: 'border-cyan-300',
    tactileScale: 'sehr glatt',
    thermalPerception: 'kalt',
    reflectionType: 'Hochglanz (spiegelnd)',
    iconicWork: inhalt.werte.bauhausDessauLouvrePyramide,
    famousArchitect: inhalt.werte.walterGropiusIM,
    keyDetail: inhalt.werte.entmaterialisierungDerWandWechselwirkung
  },
  {
    id: 'stahl',
    name: inhalt.werte.baustahlCortenstahlWetterfest,
    category: 'Metallisch',
    swatchBg: 'bg-amber-900 text-amber-200',
    accentBorder: 'border-amber-950',
    tactileScale: 'körnig-rau',
    thermalPerception: 'kühl',
    reflectionType: 'Diffus matt',
    iconicWork: inhalt.werte.neueNationalgalerieBerlinJohn,
    famousArchitect: inhalt.werte.miesVanDerRohe,
    keyDetail: inhalt.werte.konstruktiveEhrlichkeitSichtbareSchweißn
  },
  {
    id: 'aluminium',
    name: inhalt.werte.aluminiumEloxiertPulverbeschichtet,
    category: 'Metallisch',
    swatchBg: 'bg-slate-200 text-slate-700',
    accentBorder: 'border-slate-300',
    tactileScale: 'glatt',
    thermalPerception: 'kühl',
    reflectionType: 'Seidenglanz',
    iconicWork: inhalt.werte.hongKongAndShanghai,
    famousArchitect: inhalt.werte.normanFosterSom,
    keyDetail: inhalt.werte.schlankePfostenRiegelRaster
  },
  {
    id: 'kupfer',
    name: inhalt.werte.kupferTitanzink,
    category: 'Metallisch',
    swatchBg: 'bg-emerald-700 text-emerald-100',
    accentBorder: 'border-emerald-800',
    tactileScale: 'samtig-fein',
    thermalPerception: 'temperiert',
    reflectionType: 'Halbmatt',
    iconicWork: inhalt.werte.jüdischesMuseumBerlinStellwerk,
    famousArchitect: inhalt.werte.danielLibeskindHerzogDe,
    keyDetail: inhalt.werte.alterungKupferVonMetallischem
  },
  {
    id: 'holz',
    name: inhalt.werte.massivholzBrettsperrholzClt,
    category: 'Organisch',
    swatchBg: 'bg-amber-100 text-amber-900',
    accentBorder: 'border-amber-300',
    tactileScale: 'samtig-fein',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: inhalt.werte.mjStRnetNorwegen,
    famousArchitect: inhalt.werte.shigeruBanVollArkitekter,
    keyDetail: inhalt.werte.sichtbareJahrringeAstbilderUnd
  },
  {
    id: 'holzwerkstoffe',
    name: inhalt.werte.holzwerkstoffeOsbFurnierschichtholzBsh,
    category: 'Organisch',
    swatchBg: 'bg-amber-200/70 text-amber-900',
    accentBorder: 'border-amber-400',
    tactileScale: 'glatt',
    thermalPerception: 'warm',
    reflectionType: 'Diffus matt',
    iconicWork: inhalt.werte.centrePompidouMetzGolfclub,
    famousArchitect: inhalt.werte.shigeruBanFreiOtto,
    keyDetail: inhalt.werte.geometrischPräziseHolzgitterUnd
  },
  {
    id: 'kunststoffe',
    name: inhalt.werte.membranenEtfePtfePolymere,
    category: 'Synthetisch & Verbund',
    swatchBg: 'bg-sky-100 text-sky-800',
    accentBorder: 'border-sky-300',
    tactileScale: 'sehr glatt',
    thermalPerception: 'temperiert',
    reflectionType: 'Hochglanz (spiegelnd)',
    iconicWork: inhalt.werte.allianzArenaMünchenEden,
    famousArchitect: inhalt.werte.herzogDeMeuronNicholas,
    keyDetail: inhalt.werte.pneumatischAufgeblaseneLuftkissenkubenMi
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
  const activeDetail = ARCHITEKTUR_MATERIALITAET[activeSpec.id] || inhalt.daten.MaterialitaetArchitektur;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-shiraz/10 text-shiraz border border-shiraz/20"><MdText text={inhalt.texte.architekturEntwurf} /></span>
              <span className="text-xs text-text-main/50 font-mono"><MdText text={inhalt.texte.fachbereichIi} /></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center gap-3">
              <Palette className="text-shiraz" size={28} /><MdText text={inhalt.texte.materialitätArchitektonischeÄsthetik} /></h2>
            <p className="text-sm text-text-main/80 mt-1 max-w-3xl leading-relaxed"><MdText text={inhalt.texte.dieSinnlicheDimensionDer} /></p>
          </div>

          <button
            onClick={() => setActiveTab('sichtbeton')}
            className="px-4 py-2 rounded-xl bg-shiraz text-white hover:bg-shiraz/90 font-medium text-xs flex items-center gap-2 shadow-sm transition-all self-start md:self-center shrink-0 cursor-pointer"
          >
            <Building2 size={15} /><MdText text={inhalt.texte.zuSichtbetonKlassenSb} /></button>
        </div>

        {/* 4 Dimensionen der Materialität Info-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Eye size={15} className="text-shiraz" /><MdText text={inhalt.texte.t1OptikTextur} /></div>
            <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.korngefügeFugenmusterFarbnuancenPorigkei} /></p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Sliders size={15} className="text-amber-700" /><MdText text={inhalt.texte.t2TaktilitätHaptik} /></div>
            <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.wärmeeindringzahlWarmVsKühl} /></p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Sun size={15} className="text-amber-500" /><MdText text={inhalt.texte.t3LichtReflexion} /></div>
            <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.spiegelungDiffuseStreuungTransluzenz} /></p>
          </div>

          <div className="p-3.5 rounded-xl bg-off-white/80 border border-home-grau/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <Clock size={15} className="text-emerald-700" /><MdText text={inhalt.texte.t4WürdeDesAlterns} /></div>
            <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.patinaAuswitterungVergrauungVerharzung} /></p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-home-grau/30 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Alle', 'Mineralisch', 'Metallisch', 'Organisch', inhalt.werte.synthetischVerbund].map(cat => (
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
            placeholder={inhalt.werte.baustoffArchitektBauwerkSuchen}
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
                  Kategorie: <strong>{activeSpec.category}</strong><MdText text={inhalt.texte.typischeHaptik} /><strong>{activeSpec.tactileScale}</strong>
                </p>
              </div>

              {/* Light simulation switcher */}
              <AuswahlGruppe label="Lichtsituation" className="flex items-center gap-1 bg-off-white p-1 rounded-lg border border-home-grau/20 self-start sm:self-center">
                <button {...alsOption(lightModePreview === 'sonne')}
                  onClick={() => setLightModePreview('sonne')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'sonne' ? 'bg-white shadow-xs text-amber-600 font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title={inhalt.werte.streiflichtDirekteSonneSimulieren}
                >
                  <Sun size={13} /> Sonne
                </button>
                <button {...alsOption(lightModePreview === 'diffus')}
                  onClick={() => setLightModePreview('diffus')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'diffus' ? 'bg-white shadow-xs text-slate-700 font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title={inhalt.werte.diffusesHimmelslicht}
                >
                  <Eye size={13} /> Diffus
                </button>
                <button {...alsOption(lightModePreview === 'nacht')}
                  onClick={() => setLightModePreview('nacht')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    lightModePreview === 'nacht' ? 'bg-slate-900 text-amber-300 shadow-xs font-bold' : 'text-text-main/60 hover:text-text-main'
                  }`}
                  title={inhalt.werte.kunstlichtNachtbeleuchtung}
                >
                  <Sparkles size={13} /> Nacht
                </button>
              </AuswahlGruppe>
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
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${lightModePreview === 'nacht' ? 'text-amber-400' : 'text-shiraz'}`}><MdText text={inhalt.texte.sinnlicheOberflächenwirkung} />{lightModePreview.toUpperCase()}-BELEUCHTUNG)
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
                  <div className="text-[10px] text-text-main/60 mt-1"><MdText text={inhalt.texte.thermischerKontakt} /><strong>{activeSpec.thermalPerception}</strong></div>
                </div>
              </div>
            </div>

            {/* 4 Detail Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Eye size={15} className="text-shiraz" /><MdText text={inhalt.texte.optikTexturFügung} /></div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.optikTextur}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Sliders size={15} className="text-amber-700" /><MdText text={inhalt.texte.taktilitätHaptikBerührung} /></div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.haptikOberflaeche}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Sun size={15} className="text-amber-500" /><MdText text={inhalt.texte.lichtwirkungSchattenzeichnung} /></div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.lichtReflexion}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white/70 border border-home-grau/20 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Clock size={15} className="text-emerald-700" /><MdText text={inhalt.texte.alterungPatinaVerwitterung} /></div>
                <p className="text-text-main/80 leading-relaxed">
                  {activeDetail.alterungPatina}
                </p>
              </div>
            </div>

            {/* Architectural reference box */}
            <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/20 flex items-start gap-3 text-xs">
              <Building2 size={20} className="text-shiraz shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.architekturikonenBaukunstReferenzen} /></h5>
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
              <span className="text-text-main/60"><MdText text={inhalt.texte.detailliertesSteckbriefProfilAufrufen} /></span>
              <button
                onClick={() => {
                  // Direct navigation to specific module if exists
                  const targetMap: Record<string, TabId> = {
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
                <span><MdText text={inhalt.texte.zumFachmodul} />{activeSpec.name.split(' ')[0]}"</span>
                <Compass size={14} className="text-shiraz" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWarumFühltSich}
          zielGleichung="\vartheta_K = \frac{b_H \cdot \vartheta_H + b_M \cdot \vartheta_M}{b_H + b_M}, \quad b = \sqrt{\lambda \rho c}"
          normQuelle={inhalt.werte.kontakttemperaturZweierHalbunendlicherKö}
          schritte={inhalt.daten["MaterialitaetArchitektur.schritte"]}
          ergebnisHinweis={inhalt.werte.beiGleicherRaumtemperaturFühlt}
        />
      </div>

      <ModulTest moduleId="materialitaet_architektur" />

      <ModuleFooter
        wikipedia={[
          { title: 'Sichtbeton', url: 'https://de.wikipedia.org/wiki/Sichtbeton' },
          { title: 'Patina', url: 'https://de.wikipedia.org/wiki/Patina' },
          { title: 'Klinker', url: 'https://de.wikipedia.org/wiki/Klinker' }
        ]}
        literatur={inhalt.daten["MaterialitaetArchitektur.literatur"]}
        regelwerke={inhalt.daten["MaterialitaetArchitektur.regelwerke"]}
        formeln={inhalt.daten["MaterialitaetArchitektur.formeln"]}
      />
    </div>
  );
}
