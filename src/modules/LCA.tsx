import React, { useState, useMemo } from 'react';
import { Leaf, Activity, Recycle, FileText, ShieldCheck, Scale, Award, Info, Search, GraduationCap, Calculator, HelpCircle, Milestone } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import IngenieurbauLCA from './lca/IngenieurbauLCA';
import BezugseinheitKasten from './lca/BezugseinheitKasten';
import { GWP_LEHRWERTE, type GwpLehrwertSchluessel } from '@/src/data/gwpLehrwerte';
import inhalt from '@/content/lca/LCA.json';
import { einzelbaustoffA1A4 } from '@/src/calc/lca';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

// Comprehensive EPD Reference Database representing realistic German ÖKOBAUDAT entries for students
// Beton und BSH aus der gemeinsamen Lehrwerttabelle (Konsistenz 29.10.2026, F-4); Dämmstoffe EPS und Mineralwolle je kg
// zentral, je m³ über die Rohdichte des Datensatzes (Umsetzung 30.10.2026, DSB-LC-10); übrige Datensätze aus dem Inhalt
const AUS_LEHRWERTTABELLE: Partial<Record<string, GwpLehrwertSchluessel>> = {
  'beton-cem1': 'betonC2530CemI', 'beton-rc': 'betonRcC2530', 'bsh-softwood': 'bsh', 'mineralwolle-glass': 'mineralwolle', 'eps-polystyrol': 'eps',
};
const REFERENZEN_EPD = inhalt.daten.REFERENZEN_EPD.map(e => {
  const s = AUS_LEHRWERTTABELLE[e.id];
  if (!s) return e;
  const w = GWP_LEHRWERTE[s];
  if (w.einheit === 't') {
    const g = Math.round((w.gwp / 1000) * e.density);
    return { ...e, gwp_total: g, gwp_biogenic: 0, gwp_fossil: g };
  }
  return { ...e, gwp_total: w.gwp, gwp_biogenic: w.biogen, gwp_fossil: w.gwp - w.biogen };
});

export default function LCA() {
  const [activeTab, setActiveTab] = useState<'normen' | 'phasen' | 'indikatoren' | 'epd-db' | 'ingenieurbau' | 'student-guide'>('normen');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedEpdId, setSelectedEpdId] = useState<string>('beton-cem1');

  // Student guide specific state
  const [guideTopic, setGuideTopic] = useState<'produkt' | 'gebaeude' | 'ingenieurbau'>('produkt');
  
  // Interactive student calculator state
  const [calcMaterialId, setCalcMaterialId] = useState<string>('beton-cem1');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [calcDistance, setCalcDistance] = useState<number>(150);
  const [calcTransportType, setCalcTransportType] = useState<'lkw-heavy' | 'lkw-light' | 'strom-lkw' | 'h2-lkw' | 'zug'>('lkw-heavy');

  // Compute LCA student calculator results
  const calcResults = useMemo(() => {
    const selectedMat = REFERENZEN_EPD.find(m => m.id === calcMaterialId) || REFERENZEN_EPD[0];
    
    const isVolumeBased = selectedMat.einheit.includes('m³');
    const materialQuantityText = isVolumeBased ? `${formatDeWert(calcQuantity)} m³` : `${formatDeWert(calcQuantity)} t`;
    // Rechenkern src/calc/lca.ts: A1–A3 = GWP · Menge, A4 = Masse · Distanz · Transportfaktor (Lehrwerte je t·km)
    const r = einzelbaustoffA1A4({ menge: calcQuantity, volumenbezogen: isVolumeBased, rohdichte: selectedMat.density, gwpA1A3: selectedMat.gwp_total, penrt: selectedMat.penrt, distanz: calcDistance, transport: calcTransportType });

    return {
      materialName: selectedMat.name,
      materialQuantityText,
      deklarierteEinheit: selectedMat.einheit,
      weightInTonnes: r.masse,
      gwpA1A3: r.gwpA1A3,
      gwpA4: r.gwpA4,
      anteilA1A3: r.anteilA1A3,
      anteilA4: r.anteilA4,
      totalGwp: r.gesamt,
      penrtTotal: r.penrt,
      hinweise: r.hinweise,
      isWood: selectedMat.category === 'Holz' || selectedMat.id.includes('holz')
    };
  }, [calcMaterialId, calcQuantity, calcDistance, calcTransportType]);

  // Filter EPDs
  const filteredEpds = REFERENZEN_EPD.filter(epd => {
    const matchesSearch = epd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          epd.beschreibung.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || epd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedEpdItem = REFERENZEN_EPD.find(e => e.id === selectedEpdId) || REFERENZEN_EPD[0];

  const lcaReiter = [
    { id: 'normen' as const, label: inhalt.werte.zertifizierungDeklarationen, icon: Award },
    { id: 'phasen' as const, label: inhalt.werte.lebenszyklusphasenAD, icon: Recycle },
    { id: 'indikatoren' as const, label: 'Umweltindikatoren', icon: Activity },
    { id: 'epd-db' as const, label: 'EPD-Musterdatenbank', icon: FileText },
    { id: 'ingenieurbau' as const, label: inhalt.werte.dinEn17472Ingenieurbau, icon: Milestone },
    { id: 'student-guide' as const, label: 'Studierenden-Leitfaden', icon: GraduationCap }
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.ökobilanzierungLcaImBauwesen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieÖkobilanzierungLifeCycle} /></p>
        </div>
      </div>

      {/* Reiterleiste (gemeinsame Reiter-Komponente, ARIA-Tabs; Gutachten 27.10.2026) */}
      <ModuleTabs label="Bereiche der Ökobilanzierung" tabs={lcaReiter} aktiv={activeTab} onWechsel={setActiveTab} variante="kachel"
        className="flex flex-col gap-6 [&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-rose-100">
      {/* Tab 1: Normen */}
      {activeTab === 'normen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-350">
          
          {/* ISO Rules Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 font-normal">
            <h3 className="font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.t1DerGlobaleRahmen} /></h3>
            <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.dieRahmennormenDinEn} /></p>
            <div className="space-y-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.phaseIGoalAnd} /></strong><MdText text={inhalt.texte.zentraleDefinitionDerRechenregeln} /></div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.phaseIiLifeCycle} /></strong><MdText text={inhalt.texte.reinesMathematischesMengenSoll} /></div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.phaseIiiLifeCycle} /></strong><MdText text={inhalt.texte.dieMathematischeKonvertierungVon} /></div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.phaseIvInterpretationAuswertung} /></strong><MdText text={inhalt.texte.schlussfolgerungDefinitionHerrschenderHo} /></div>
            </div>
          </div>

          {/* Construction specific norms */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 font-normal">
            <h3 className="font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Award size={18} className="text-shiraz" /><MdText text={inhalt.texte.t2BauspezifischeRegelwerkeEn} /></h3>
            <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.weilBauwerkeExtremLanglebig} /></p>

            <div className="space-y-4 pt-1">
              <div className="border-l-4 border-shiraz pl-3 text-xs">
                <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.dinEn15804Bauprodukt} /></strong>
                <span className="text-slate-700 leading-relaxed block mt-1"><MdText text={inhalt.texte.en15804A2Ist} /></span>
              </div>

              <div className="border-l-4 border-home-grau/30 pl-3 text-xs">
                <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.dinEn15978Gebäude} /></strong>
                <span className="text-slate-700 leading-relaxed block mt-1"><MdText text={inhalt.texte.beschreibtDieRechenmethodeZur} /></span>
              </div>

              <div className="border-l-4 border-amber-600 pl-3 text-xs bg-amber-50/40 p-2.5 rounded-r-lg">
                <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                  <Milestone size={13} className="text-amber-700" /><MdText text={inhalt.texte.dinEn174722024} /></strong>
                <span className="text-slate-700 leading-relaxed block mt-1"><MdText text={inhalt.texte.europäischesPendantZuEn} /></span>
              </div>

              <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200 mt-2 text-xs font-normal">
                <strong className="text-emerald-900 block font-bold mb-1"><MdText text={inhalt.texte.qualitätssiegelNachhaltigesGebäudeQng} /></strong><MdText text={inhalt.texte.zentralesStaatlichesGütesiegelDes} /><ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><MdText text={inhalt.texte.wohngebäudeWg23Ab01} /></li>
                  <li><MdText text={inhalt.texte.nichtwohngebäudeNw23ProjektspezifischerA} /></li>
                  <li><MdText text={inhalt.texte.wichtigGutschriftenAusModul} /></li>
                </ul>
              </div>

              {/* CPR Novelle 2024/3110 Box */}
              <div className="bg-blue-50 text-blue-950 p-4 rounded-xl border border-blue-200 text-xs font-normal space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <FileText size={14} className="text-blue-700" />
                  <span><MdText text={inhalt.texte.euBauproduktenverordnungCprNovelle} /></span>
                </div>
                <p className="leading-relaxed text-blue-900/90"><MdText text={inhalt.texte.seit20252026Novellierter} /></p>
                <ul className="list-disc pl-5 space-y-1 text-blue-900/90">
                  <li><MdText text={inhalt.texte.digitalerProduktpassDppMaschinenlesbare} /></li>
                  <li><MdText text={inhalt.texte.kombinierteDopcDeclarationOf} /></li>
                  <li><MdText text={inhalt.texte.avcpSystem3Einführung} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Funktionelle und deklarierte Einheit (Auftrag 28.10.2026) */}
          <BezugseinheitKasten />
        </div>
      )}

      {/* Tab 2: Lebenszyklusphasen */}
      {activeTab === 'phasen' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-350 font-normal">
          <div className="border-b border-home-grau/30 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Recycle className="text-shiraz" /><MdText text={inhalt.texte.lebenszyklusmoduleEinesGebäudesNach} /></h3>
            <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.dieÖkobilanzTrenntZeitbasierte} /></p>
          </div>

          {/* Matrix Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">A1 - A3</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Herstellungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><MdText text={inhalt.texte.a1RohstoffgewinnungZB} /></li>
                  <li><MdText text={inhalt.texte.a2TransportZumHerstellerwerk} /></li>
                  <li><MdText text={inhalt.texte.a3ProduktionImWerk} /></li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none"><MdText text={inhalt.texte.cradleToGateWerkstor} /></span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">A4 - A5</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Errichtungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><MdText text={inhalt.texte.a4TransportDesFertigen} /></li>
                  <li><MdText text={inhalt.texte.a5EinbauvorgangKräneMörteln} /></li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none"><MdText text={inhalt.texte.einbauImObjekt} /></span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">B1 - B7</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Nutzungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><MdText text={inhalt.texte.b1B5NutzungAm} /></li>
                  <li><MdText text={inhalt.texte.b6BetriebsenergiebedarfHeizenKühlen} /></li>
                  <li><MdText text={inhalt.texte.b7BetriebswassereinsatzTrinkwasser} /></li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none"><MdText text={inhalt.texte.nutzungOft50Jahre} /></span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">C1 - C4</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Entsorgungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><MdText text={inhalt.texte.c1RückbauUndKontrollierter} /></li>
                  <li><MdText text={inhalt.texte.c2TransportZurRecyclinganlage} /></li>
                  <li><MdText text={inhalt.texte.c3AbfallaufbereitungBrecheranlagen} /></li>
                  <li><MdText text={inhalt.texte.c4BeseitigungDeponierung} /></li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none"><MdText text={inhalt.texte.endOfLifeLebensende} /></span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">Modul D</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Nutzungspotenziale</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><MdText text={inhalt.texte.recyclinggutschriftenSubstitutionsgutsch} /></li>
                  <li><MdText text={inhalt.texte.energetischeGutschriftenVerwertungsgutsc} /></li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none"><MdText text={inhalt.texte.außerhalbDerSystemgrenze} /></span>
            </div>

          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-xs text-slate-700 space-y-3 leading-relaxed">
            <h4 className="font-bold text-shiraz"><MdText text={inhalt.texte.kritischeWissenschaftlicheSchnittstellen} /></h4>
            <p><MdText text={inhalt.texte.einWiederkehrenderStreitpunktIn} /></p>
            <p className="border-l-2 border-shiraz pl-3"><MdText text={inhalt.texte.dieFallstrickeAmLebensende} /></p>
          </div>
        </div>
      )}

      {/* Tab 3: Indikatoren */}
      {activeTab === 'indikatoren' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-350">
          <div className="border-b border-home-grau/30 pb-2">
            <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.dieNormiertenUmweltindikatorenNach} /></h3>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.eineÖkobilanzBetrachtetWeit} /></p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-home-grau/30 shadow-sm">
            <table className="w-full text-left border-collapse text-xs font-normal">
              <thead>
                <tr className="bg-slate-50 text-slate-900 border-b border-home-grau/30 font-bold">
                  <th className="p-3 font-bold">Code</th>
                  <th className="p-3 font-bold"><MdText text={inhalt.texte.akronymName} /></th>
                  <th className="p-3 font-bold"><MdText text={inhalt.texte.phänomenologischeErklärungUmweltschadens} /></th>
                  <th className="p-3 font-bold">Einheit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-slate-700 leading-relaxed font-normal">
                <tr className="bg-shiraz/5">
                  <td className="p-3 font-mono font-bold text-shiraz">GWP-total</td>
                  <td className="p-3 font-bold"><MdText text={inhalt.texte.globalWarmingPotentialTreibhauspotenzial} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.globalerAnthropogenerTreibhauseffektSumm} /></td>
                  <td className="p-3 font-mono font-bold text-shiraz">kg CO₂-eq</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">ODP</td>
                  <td className="p-3 font-bold"><MdText text={inhalt.texte.ozoneDepletionPotentialOzonabbaupotenzia} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.zerstörungsrateDerStratosphärischenOzons} /></td>
                  <td className="p-3 font-mono"><MdText text={inhalt.texte.kgCfc11Eq} /></td>
                </tr>
                <tr className="bg-amber-50/20">
                  <td className="p-3 font-mono font-bold text-amber-900">AP</td>
                  <td className="p-3 font-bold text-amber-950"><MdText text={inhalt.texte.acidificationPotentialVersauerungspotenz} /></td>
                  <td className="p-3 text-amber-950"><MdText text={inhalt.texte.erhöhungDerWasserstoffionenKonzentration} /></td>
                  <td className="p-3 font-mono text-amber-900">mol H⁺-eq</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">EP-freshwater</td>
                  <td className="p-3 font-bold"><MdText text={inhalt.texte.eutrophicationPotentialÜberdüngungSüßwas} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.eintragVonLimitierendenPhosphat} /></td>
                  <td className="p-3 font-mono">kg PO₄-eq</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-mono font-style">POCP</td>
                  <td className="p-3 font-bold"><MdText text={inhalt.texte.photochemicalOzoneCreationPotential} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.bildungKorrosiverPhotooxidantienBodennah} /></td>
                  <td className="p-3 font-mono">kg NMVOC-eq</td>
                </tr>
                <tr className="bg-indigo-50/10">
                  <td className="p-3 font-mono font-bold text-indigo-900">PENRT</td>
                  <td className="p-3 font-bold text-indigo-950"><MdText text={inhalt.texte.primaryEnergyNonRenewable} /></td>
                  <td className="p-3 text-indigo-950"><MdText text={inhalt.texte.gesamterFossilerUndNuklearer} /></td>
                  <td className="p-3 font-mono text-indigo-900">MJ</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">PERE</td>
                  <td className="p-3 font-bold"><MdText text={inhalt.texte.primaryEnergyRenewable} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.verbrauchVonPrimärenergieträgernAus} /></td>
                  <td className="p-3 font-mono">MJ</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mathematical Section */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 mt-4 font-normal">
            <h4 className="font-bold text-slate-900 text-sm mb-2"><MdText text={inhalt.texte.mathematischerRechenalgorithmusEinesGebä} /></h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-4"><MdText text={inhalt.texte.fürEinKomplettesBauwerk} /></p>
            <div className="flex justify-center my-4">
              <BlockMath math="I_{Ges} = \sum_{i=1}^{n} \left( m_i \cdot e_{i, \text{Herstellung}} \right) + I_{\text{Ersatz}} + I_{\text{Betrieb}} + I_{\text{Rückbau}} + I_{\text{Modul D}}" />
            </div>
            <div className="text-[11px] text-slate-500 leading-normal space-y-1 mt-2">
              <div><MdText text={inhalt.texte.mIEingebauteWerkstoffmasse} /></div>
              <div><MdText text={inhalt.texte.eITextHerstellung} /></div>
              <div><MdText text={inhalt.texte.iTextErsatzAufsummierter} /></div>
              <div><MdText text={inhalt.texte.iTextBetriebRechnungsenergie} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: EPD Database Inspector */}
      {activeTab === 'epd-db' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-350 font-normal">
          
          {/* List and search bar (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Referenz-Materialdatenbank</h4>
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={inhalt.werte.materialSuchen}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-home-grau/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-shiraz bg-white"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-1">
                {['Alle', 'Mineralisch', 'Holz', 'Dämmstoffe', 'Metalle'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-slate-50 text-slate-500 border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <AuswahlGruppe label="EPD" className="bg-white rounded-xl border border-home-grau/30 shadow-sm max-h-[450px] overflow-y-auto divide-y divide-home-grau/15">
              {filteredEpds.length > 0 ? (
                filteredEpds.map((epd) => (
                  <button {...alsOption(selectedEpdId === epd.id)}
                    key={epd.id}
                    onClick={() => setSelectedEpdId(epd.id)}
                    className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                      selectedEpdId === epd.id ? 'bg-shiraz/5 border-l-4 border-shiraz' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 leading-tight">{epd.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">{epd.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-normal">
                      <span><MdText text={inhalt.texte.deklEinheit} /><strong>{epd.einheit}</strong></span>
                      <span className="font-mono text-shiraz font-bold">GWP: {formatDeWert(epd.gwp_total)} kg CO₂-eq</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500"><MdText text={inhalt.texte.keineMaterialienGefunden} /></div>
              )}
            </AuswahlGruppe>
          </div>

          {/* EPD Factsheet display (7-cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 h-full flex flex-col justify-between">
              
              <div>
                <div className="border-b border-home-grau/30 pb-3 mb-4 flex justify-between items-start">
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{selectedEpdItem.name}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Typenklasse: {selectedEpdItem.category}
          </p>
        </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck size={12} /><MdText text={inhalt.texte.verifiziertPcr} /></span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-6 bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                  {selectedEpdItem.beschreibung}
                </p>

                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                  <Activity size={12} className="text-shiraz" /><MdText text={inhalt.texte.ökobilanzKernindikatorenModulA1} /></h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">GWP Gesamt</span>
                    <strong className="text-xs font-mono font-bold text-shiraz mt-1 block">{formatDeWert(selectedEpdItem.gwp_total)}</strong>
                    <span className="text-[9px] text-slate-400 block">kg CO₂-eq / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider"><MdText text={inhalt.texte.fossilesGwp} /></span>
                    <strong className="text-xs font-mono font-bold text-slate-900 mt-1 block">{formatDeWert(selectedEpdItem.gwp_fossil)}</strong>
                    <span className="text-[9px] text-slate-400 block">kg CO₂-eq / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Primärenergie</span>
                    <strong className="text-xs font-mono font-bold text-indigo-700 mt-1 block">{formatDeWert(selectedEpdItem.penrt)}</strong>
                    <span className="text-[9px] text-slate-400 block">MJ / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Versauerung</span>
                    <strong className="text-xs font-mono font-bold text-slate-900 mt-1 block">{formatDeZahl(selectedEpdItem.ap, 3)}</strong>
                    <span className="text-[9px] text-slate-400 block">mol H⁺-eq / {selectedEpdItem.einheit}</span>
                  </div>

                </div>

                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                  <Info size={12} className="text-shiraz" /><MdText text={inhalt.texte.metadatenBauphysikalischeDeklaration} /></h4>

                <div className="space-y-2 text-xs font-normal">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500"><MdText text={inhalt.texte.anwendbarePcrZulassungsregel} /></span>
                    <span className="font-mono font-semibold">{selectedEpdItem.pcr}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500"><MdText text={inhalt.texte.amtlicheDatenquelle} /></span>
                    <span className="font-mono font-semibold">{selectedEpdItem.quelle}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500"><MdText text={inhalt.texte.spezifischeRohdichte} /></span>
                    <span className="font-mono font-semibold">{formatDeWert(selectedEpdItem.density)} kg/m³</span>
                  </div>
                  <div className="flex justify-between pb-1.5">
                    <span className="text-slate-500"><MdText text={inhalt.texte.wärmeleitfähigkeitWärmeleitzahl} /></span>
                    <span className="font-mono font-semibold text-shiraz font-bold">{formatDeZahl(selectedEpdItem.lambda, 3)} W/(m·K)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-3 border-t border-home-grau/30 bg-slate-50 p-3 rounded-lg border text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
                <Info size={14} className="text-shiraz shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.anwendungstippFürBerechnungenWill} /></span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 5: DIN EN 17472 (Ingenieurbauwerke & Infrastruktur) */}
      {activeTab === 'ingenieurbau' && (
        <div className="animate-in fade-in duration-300">
          <IngenieurbauLCA />
        </div>
      )}

      {/* Tab 6: Student Guide Component */}
      {activeTab === 'student-guide' && (
        <div className="space-y-6 animate-in fade-in duration-350">
          
          {/* Main Info Banner */}
          <div className="bg-white border border-home-grau/30 p-6 rounded-2xl flex flex-col gap-3 shadow-sm">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <GraduationCap className="text-shiraz" size={24} /><MdText text={inhalt.texte.akademischerLeitfadenZurÖkobilanzierung} /></h3>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.einStrukturierterBegleiterFür} /></p>
            </div>
          </div>

          {/* Guide Subtabs Selectors */}
          <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-3 font-mono"><MdText text={inhalt.texte.untersuchungsgegenstandWählen} /></span>
            <ReiterLeiste label="Untersuchungsgegenstand" className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'produkt' as const, title: inhalt.werte.lcaFürBauprodukte, desc: inhalt.werte.dinEn15804A2, color: 'border-l-indigo-500' },
                { id: 'gebaeude' as const, title: inhalt.werte.lcaFürGebäude, desc: inhalt.werte.dinEn15978Qng, color: 'border-l-emerald-500' },
                { id: 'ingenieurbau' as const, title: inhalt.werte.lcaFürIngenieurbauwerke, desc: inhalt.werte.t100JahreNutzungsdauerBrücken, color: 'border-l-amber-500' }
              ].map((topic) => (
                <button {...alsReiter(guideTopic === topic.id, 'lca-leitfaden', topic.id)}
                  key={topic.id}
                  onClick={() => setGuideTopic(topic.id)}
                  className={`text-left p-3.5 rounded-xl border border-l-4 transition-all hover:bg-slate-50 relative ${topic.color} ${
                    guideTopic === topic.id 
                    ? 'bg-slate-50/70 text-slate-950 font-bold border-home-grau/30 shadow-sm' 
                    : 'bg-white border-home-grau/30 text-slate-600'
                  }`}
                >
                  <strong className="text-xs block text-slate-900 font-bold">{topic.title}</strong>
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5 leading-tight">{topic.desc}</span>
                </button>
              ))}
            </ReiterLeiste>
          </div>

          {/* Guide Main Flow Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Steps Flow (8-cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {guideTopic === 'produkt' && (
                <div {...reiterPanel('lca-leitfaden', guideTopic)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider font-mono"><MdText text={inhalt.texte.modul1Bauprodukte} /></span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans"><MdText text={inhalt.texte.erstellungEinerUmweltproduktdeklarationE} /></h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.festlegungDerFunktionellenDeklarierten} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.bevorDatenErhobenWerden} /></p>
                        <ul className="text-[11px] list-disc pl-4 text-slate-500 space-y-1 my-1">
                          <li><MdText text={inhalt.texte.deklarierteEinheitReinerStoffbezug} /></li>
                          <li><MdText text={inhalt.texte.funktionelleEinheitBeziehtSich} /></li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.deklarationDerSystemgrenzenModul} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.sollDieEpdNur} /></p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-sans my-2"><MdText text={inhalt.texte.mitzuführendePflichtmoduleHerstellungA1} /></div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.sachbilanzLciLifeCycle} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.zelluläreDatenanalyseAllerInputs} /></p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.wirkungsabschätzungLciaPcrVerifizierung} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dieDatenströmeWerdenÜber} /></p>
                        <div className="flex justify-center my-2">
                          <BlockMath math="\text{Umweltwirkung (z.B. GWP)} = \sum \left( \text{Stoffmenge} \times \text{Charakterisierungsfaktor} \right)" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.dieBerechnungErfolgtÜber} /></p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {guideTopic === 'gebaeude' && (
                <div {...reiterPanel('lca-leitfaden', guideTopic)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-mono"><MdText text={inhalt.texte.modul2GebäudeLca} /></span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans"><MdText text={inhalt.texte.ökobilanzierungKompletterHochbautenNach} /></h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.gebäudedatenBezugshorizontFestlegenNrf} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.derBezugsmaßstabFürHochbauten} /></p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.massenermittlungUndBauteilgliederungBim} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.gewinnungAllerPhysikalischenBauteildaten} /></p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.zuweisungDerBbsrNutzungsdauern} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.nichtAlleBauteileHalten} /></p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-mono my-2 space-y-1">
                          <div><MdText text={inhalt.texte.tragendesStahlbetonskelett50Jahre} /></div>
                          <div><MdText text={inhalt.texte.außenfensterHolzAlu25} /></div>
                          <div><MdText text={inhalt.texte.elastischeFlachdachabdichtung20Jahre} /></div>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.datenverknüpfungMitDerÖkobaudat} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.jederBauteilmasseWirdIhr} /></p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">5</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.bilanzierungDerBetriebsenergieModul} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.ausweisungDesPrognostiziertenJährlichen} /></p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">6</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.syntheseAbgleichMitDen} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dieAufsummiertenLebenszyklusEmissionen} /></p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {guideTopic === 'ingenieurbau' && (
                <div {...reiterPanel('lca-leitfaden', guideTopic)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider font-mono"><MdText text={inhalt.texte.modul3Ingenieurbauwerke} /></span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans"><MdText text={inhalt.texte.ökobilanzierungVonBrückenTunneln} /></h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.festlegungDesRegulativenBezugsmaßstabs} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.imGegensatzZumHochbau} /></p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.fokusAufPrimärsubstanzDominanz} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.imIngenieurbauDominierenMassive} /></p>
                        <ul className="text-[11px] list-disc pl-4 text-slate-500 space-y-1 my-1">
                          <li><MdText text={inhalt.texte.unterbautenPfahlgründungenMassivePfeiler} /></li>
                          <li><MdText text={inhalt.texte.überbautenSpannbetonhohlkastenVerbundträ} /></li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.erfassungBautechnischerProzesseModul} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.währendDerBaustellenprozessIm} /></p>
                        <div className="bg-slate-50 p-2.5 rounded border text-[11px] text-slate-600 leading-normal my-1"><MdText text={inhalt.texte.erfassungDesTreibstoffbedarfsSchwerer} /></div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold"><MdText text={inhalt.texte.instandhaltungsszenarienUndBauwerkserneu} /></strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.aufgrundDerHartenWitterungsbelastung} /></p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-mono my-2 space-y-1">
                          <div><MdText text={inhalt.texte.fahrbahnbelagAsphaltAustauschAlle} /></div>
                          <div><MdText text={inhalt.texte.brückenkappenUndAbdichtungenErneuerung} /></div>
                          <div><MdText text={inhalt.texte.brückenlagerUndFahrbahnübergängeAustausc} /></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Student Deliverables checklist (4-cols) */}
            <div className="lg:col-span-4 bg-white border border-home-grau/30 p-5 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.checklisteFürStudienarbeiten} /></h4>
              <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.folgendeLeistungsbestandteileMüssenSie} /></p>

              <div className="space-y-2.5 text-xs">
                {inhalt.daten.LCA.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-home-grau/30">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-shiraz/5 border border-shiraz/10 p-3.5 rounded-xl text-[10.5px] text-slate-700 leading-relaxed">
                <h5 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.korrekteZitierweise} /></h5>
                <span><MdText text={inhalt.texte.sämtlicheÖkobilanzwerteGwpPenrt} /></span>
              </div>
            </div>

          </div>

          {/* Dynamic Interactive Student Calculator Section */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
            <div className="border-b pb-3 mb-5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
                <Calculator className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiverÖkobilanzÜbungsrechnerPhasen} /></h4>
              <p className="text-xs text-slate-500 mt-1 font-sans"><MdText text={inhalt.texte.modellierenSieSpielerischDen} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Inputs Box (5-cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-home-grau/30 rounded-xl p-4 md:p-5 space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Simulations-Steuerung</span>

                {/* Input 1: Material selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-slate-700"><MdText text={inhalt.texte.t1BaustoffDatensatzEpd} /></label>
                  <select aria-label={inhalt.werte.t1BaustoffDatensatzEpd}
                    value={calcMaterialId}
                    onChange={(e) => setCalcMaterialId(e.target.value)}
                    className="w-full text-xs p-2 border border-home-grau/30 bg-white rounded-lg focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    {REFERENZEN_EPD.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} ({mat.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input 2: Quantity slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700">
                    <label>2. Menge:</label>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">
                      {formatDeWert(calcQuantity)} {REFERENZEN_EPD.find(m => m.id === calcMaterialId)?.einheit.split(' ')[1] || 'Einheiten'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>1</span>
                    <span>150</span>
                  </div>
                </div>

                {/* Input 3: Transport slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700">
                    <label><MdText text={inhalt.texte.t3DistanzZurBaustelle} /></label>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">{formatDeWert(calcDistance)} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>10 km</span>
                    <span>1000 km</span>
                  </div>
                </div>

                {/* Input 4: Transport Medium */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-slate-700"><MdText text={inhalt.texte.t4TransportmittelA4} /></label>
                  <AuswahlGruppe label="Transportmittel" className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-[9.5px]">
                    {[
                      { id: 'lkw-heavy' as const, label: inhalt.werte.dieselLkw40t, detail: inhalt.werte.euro60020 },
                      { id: 'lkw-light' as const, label: inhalt.werte.dieselLkw75t, detail: inhalt.werte.nahverkehr0080Kg },
                      { id: 'strom-lkw' as const, label: inhalt.werte.elektroLkwEtruck, detail: inhalt.werte.ökostromLaden0004 },
                      { id: 'h2-lkw' as const, label: 'Wasserstoff-LKW', detail: inhalt.werte.h2Brennstoffzelle0003 },
                      { id: 'zug' as const, label: inhalt.werte.güterzugBahn, detail: inhalt.werte.eSchienengüter0005 }
                    ].map((trans) => (
                      <button {...alsOption(calcTransportType === trans.id)}
                        key={trans.id}
                        type="button"
                        onClick={() => setCalcTransportType(trans.id)}
                        className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-center ${
                          calcTransportType === trans.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                          : 'bg-white border-home-grau/30 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-bold leading-tight">{trans.label}</span>
                        <span className="text-[7.5px] text-slate-400 leading-none mt-0.5">{trans.detail}</span>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

              </div>

              {/* Outputs Box (7-cols) */}
              <div className="lg:col-span-7 bg-white border border-home-grau/30 rounded-xl p-5 md:p-6 space-y-6 flex flex-col justify-between">
                
                {/* Result header cards */}
                <div>
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono"><MdText text={inhalt.texte.berechneteTreibhausgasbilanz} /></span>
                      <h5 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                        Objekt: {calcResults.materialQuantityText} x {calcResults.materialName}
                      </h5>
                    </div>
                    <div className="bg-slate-100 rounded px-2.5 py-1 text-center font-mono">
                      <span className="text-[9px] text-slate-400 block leading-none font-bold">BRUTTOGEWICHT</span>
                      <strong className="text-xs text-slate-700 font-bold block mt-0.5">{formatDeZahl(calcResults.weightInTonnes, 2)} t</strong>
                    </div>
                  </div>

                  <EingabeHinweise hinweise={calcResults.hinweise} />
                  <ErgebnisAnsage text={kurzzeile(`${calcResults.materialQuantityText} ${calcResults.materialName}`, ansageWert('GWP A1–A3', calcResults.gwpA1A3, 1, 'kg CO₂-Äquivalent'), ansageWert('A4', calcResults.gwpA4, 1, 'kg'), ansageWert('gesamt', calcResults.totalGwp, 1, 'kg CO₂-Äquivalent'))} />

                  {/* Bezugsgröße des Ergebnisses: deklarierte Einheit der EPD (Auftrag 28.10.2026) */}
                  <p className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-[11px] text-slate-800 leading-relaxed" data-testid="bezug-einzelbaustoff">
                    <MdText text={inhalt.texte.bezugEinzelBezogen} /><strong>{calcResults.deklarierteEinheit}</strong><MdText text={inhalt.texte.bezugEinzelRechnung} />
                    <span className="font-mono">{formatDeWert(calcQuantity)} × {calcResults.deklarierteEinheit}</span>. <MdText text={inhalt.texte.bezugEinzelKeineFe} />
                  </p>

                  {/* Impact split */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center">
                    
                    <div className="bg-slate-50 border border-home-grau/30 p-3 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block"><MdText text={inhalt.texte.a1A3Herstellung} /></span>
                      <strong className={`text-sm font-mono font-bold mt-1 ${calcResults.gwpA1A3 < 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {formatDeZahl(calcResults.gwpA1A3, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                    <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block"><MdText text={inhalt.texte.a4Transportdistanz} /></span>
                      <strong className="text-sm font-mono font-bold text-amber-700 mt-1">
                        {formatDeZahl(calcResults.gwpA4, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                    <div className="bg-shiraz/5 border border-shiraz/10 p-3 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-shiraz tracking-wider block"><MdText text={inhalt.texte.gesamtGwpA1A4} /></span>
                      <strong className={`text-base font-mono font-black mt-0.5 ${calcResults.totalGwp < 0 ? 'text-emerald-700' : 'text-shiraz'}`}>
                        {formatDeZahl(calcResults.totalGwp, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                  </div>

                  {/* Visualization of GWP breakdown (Stacked Bar) */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-home-grau/30">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block"><MdText text={inhalt.texte.emissionenAnteilVerteilungGwp} /></span>
                    
                    {calcResults.totalGwp > 0 ? (
                      <div>
                        {/* Relative width breakdown */}
                        <div className="h-5 rounded-md overflow-hidden flex w-full my-1.5 relative border border-home-grau/30">
                          {/* A1-A3 Bar (min clamped) */}
                          <div 
                            className="bg-slate-400 text-[9px] text-white font-mono font-bold flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer"
                            style={{ width: `${Math.max(10, calcResults.anteilA1A3)}%` }}
                            title={`A1-A3: ${formatDeZahl(calcResults.gwpA1A3, 1)} kg`}
                          >
                            {calcResults.anteilA1A3 > 15 ? 'A1-A3' : ''}
                          </div>
                          {/* A4 Bar (transport) */}
                          <div 
                            className="bg-amber-500 text-[9px] text-white font-mono font-bold flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer"
                            style={{ width: `${Math.max(10, calcResults.anteilA4)}%` }}
                            title={`A4: ${formatDeZahl(calcResults.gwpA4, 1)} kg`}
                          >
                            {calcResults.anteilA4 > 15 ? 'A4' : ''}
                          </div>
                        </div>
                        <div className="flex gap-4 justify-between text-[9px] text-slate-400 font-mono">
                          <span className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded bg-slate-400 inline-block" /> Herstellung: {formatDeWert(Math.round(calcResults.anteilA1A3))}%
                          </span>
                          <span className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> Transport: {formatDeWert(Math.round(calcResults.anteilA4))}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10.5px] leading-relaxed text-emerald-800 p-2 bg-emerald-50 rounded border border-emerald-100 font-sans"><MdText text={inhalt.texte.kohlenstoffspeicherSzenarioAufgrundDes} /></div>
                    )}
                  </div>
                </div>

                {/* dynamic tutor response advice */}
                <div className="mt-4 p-4 bg-indigo-50/40 border border-indigo-150 rounded-xl flex gap-3 items-start text-xs text-slate-700">
                  <HelpCircle size={16} className="text-indigo-650 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.tutorOptimierungsberatung} /></strong>
                    {calcResults.isWood ? (
                      <p className="leading-relaxed"><MdText text={inhalt.texte.sehrGuteHolzwahlDurch} />{formatDeWert(calcDistance)}<MdText text={inhalt.texte.kmMitKleintransporternDer} /></p>
                    ) : (
                      <div>
                        {/* Hinweisschwelle des Tutors: A4 über 30 % von A1–A3 (Darstellungsgröße, kein Kennwert) */}
                        {calcResults.gwpA4 > (calcResults.gwpA1A3 * 0.3) ? (
                          <p className="leading-relaxed"><MdText text={inhalt.texte.achtungDieTransportEmissionen} />{formatDeWert(calcDistance)}<MdText text={inhalt.texte.kmIstEinUmstieg} /></p>
                        ) : (
                          <p className="leading-relaxed"><MdText text={inhalt.texte.dieTransportfrachtIstGut} /></p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
              
            </div>

            {/* Methodical Warning / Equivalent Performance Tip */}
            <div className="mt-6 p-4.5 bg-amber-50/40 border border-amber-200/50 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center text-xs shadow-sm">
              <div className="bg-amber-100/50 text-amber-800 p-2.5 rounded-lg border border-amber-200/40 shrink-0">
                <Scale size={20} />
              </div>
              <div className="space-y-1">
                <strong className="text-amber-950 font-bold block text-[11.5px] font-sans"><MdText text={inhalt.texte.methodischerGrundsatzDeklarierteEinheit} /></strong>
                <p className="text-slate-600 leading-relaxed text-[11px] font-sans"><MdText text={inhalt.texte.wichtigerHinweisZumBaustoffvergleich} /></p>
              </div>
            </div>

            {/* Praxis-Download Callout: Transportbeton Excel Arbeitsmappe */}
            <div className="mt-6 p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 shrink-0">
                  <Calculator size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2"><MdText text={inhalt.texte.excelArbeitsmappeXlsxÖkobilanzierung} /></h4>
                  <p className="text-emerald-800/80 text-xxs mt-0.5 max-w-xl"><MdText text={inhalt.texte.interaktiveBerechnungsdateiFürStudierend} /></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  import('@/src/modules/lca/TransportbetonExcelExport').then(m => m.generateTransportbetonExcel());
                }}
                className="shrink-0 px-4 py-2.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FileText size={15} />
                <span><MdText text={inhalt.texte.excelÜbungHerunterladen} /></span>
              </button>
            </div>

          </div>

        </div>
      )}
      </ModuleTabs>

      {/* Fußzeile: nur die modulweite in OekobilanzLCA.tsx (Nachprüfung 29.10.2026, doppelte Fußzeile entfernt) */}
    </div>
  );
}
