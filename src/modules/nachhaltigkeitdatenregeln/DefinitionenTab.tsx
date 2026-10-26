import { Globe, ShieldCheck, Building2, Layers, RefreshCw, BookOpen, Library, Target, Clock } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeitdatenregeln/DefinitionenTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface DefinitionenTabProps {

}

export function DefinitionenTab({  }: DefinitionenTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Einführung & Leitbild */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-shiraz/10 text-shiraz">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.terminologischeTechnischeBegriffsbestimm} /></h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wissenschaftlicheHerleitungVölkerrechtli} /></p>
          </div>
        </div>
    
        <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 text-xs text-text-main/80 leading-relaxed mb-6">
          <p>
            Der Begriff <strong>„Nachhaltigkeit“</strong> entstammt historisch der sächsischen Forstwirtschaft (Hans Carl von Carlowitz, 1713) 
            und wurde über den <strong><MdText text={inhalt.texte.brundtlandBericht1987} /></strong> und die <strong><MdText text={inhalt.texte.rioDeklaration1992} /></strong> völkerrechtlich verankert. 
            Im Bauwesen wandelt sich die Definition von einer rein philosophisch-ethischen Leitlinie zu einem 
            <strong><MdText text={inhalt.texte.quantifizierbarenNormativGeregeltenIngen} /></strong>: Nachhaltiges Bauen umfasst die integrale Optimierung aller 
            Schutzgüter über den vollständigen Lebenszyklus (Rohstoffgewinnung bis Rezyklierung) auf Basis reproduzierbarer Messgrößen 
            (Ökobilanzierung nach DIN EN 15978, Lebenszykluskosten LCC nach ISO 15686-5 bzw. DIN EN 16627 und soziokulturelle Kriterien nach DIN EN 15643).
          </p>
        </div>
    
        {/* SEKTION 1: NACHHALTIGKEIT (ALLGEMEIN) */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Globe className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.t1NachhaltigkeitAllgemeineDefinition} /></h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold"><MdText text={inhalt.texte.generelleDefinitionSystemtheorie} /></span>
          </div>
    
          {/* Box: Wortlaut Brundtland */}
          <div className="p-4 rounded-xl border border-shiraz/20 bg-shiraz/5">
            <span className="text-[10px] uppercase font-bold text-shiraz tracking-wider block mb-1"><MdText text={inhalt.texte.völkerrechtlicheLeitdefinitionWced1987} /></span>
            <blockquote className="text-xs sm:text-sm italic font-medium text-text-main leading-relaxed"><MdText text={inhalt.texte.nachhaltigeEntwicklungIstEine} /></blockquote>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-shiraz/15 text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.quelleUnWorldCommission} /></span>
              <span className="font-mono"><MdText text={inhalt.texte.resolution42187Der} /></span>
            </div>
          </div>
    
          {/* Historie & 3-Säulen-Modell */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" /><MdText text={inhalt.texte.historischerForstwirtschaftlicherUrsprun} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.geprägtVonHansCarl} /></p>
              <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.ingenieurmäßigeÜbertragungEntnahmerateEr} /></p>
            </div>
    
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" /><MdText text={inhalt.texte.dasKlassische3Säulen} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.gleichrangigkeitVonÖkologieErhalt} /></p>
              <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.quelleEnqueteKommissionDes} /></p>
            </div>
          </div>
    
          {/* Planetare Belastungsgrenzen (Planetary Boundaries) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-off-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2">
                <Target className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.systemgrenzenKonzeptDerPlanetaren} /></strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"><MdText text={inhalt.texte.rockströmEtAl2009} /></span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.nachhaltigkeitBedeutetZwingendDas} /></p>
          </div>
    
          {/* Die drei Umsetzungsstrategien */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
            <strong className="text-xs font-bold text-text-main block mb-2"><MdText text={inhalt.texte.dieDreiOperationellenGrundstrategien} /></strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1"><MdText text={inhalt.texte.t1Effizienz} /></strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.verbesserungDesVerhältnissesVon} /></p>
              </div>
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1"><MdText text={inhalt.texte.t2Konsistenz} /></strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.einklangAnthropogenerStoffströmeMit} /></p>
              </div>
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1"><MdText text={inhalt.texte.t3Suffizienz} /></strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.hinterfragenDesBedarfsUnd} /></p>
              </div>
            </div>
          </div>
        </div>
    
        {/* SEKTION 2: NACHHALTIGES BAUEN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Building2 className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.t2NachhaltigesBauenFachspezifische} /></h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-semibold"><MdText text={inhalt.texte.normierteIngenieurdisziplin} /></span>
          </div>
    
          {/* Normative Definition nach DIN EN 15643 & BMWSB Leitfaden */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block mb-1"><MdText text={inhalt.texte.normativeBegriffsbestimmungDinEn} /></span>
            <blockquote className="text-xs sm:text-sm font-medium text-text-main leading-relaxed"><MdText text={inhalt.texte.nachhaltigesBauenIstDie} /></blockquote>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.quellenDinEn15643} /></span>
              <span className="font-mono"><MdText text={inhalt.texte.dinEnIso15392} /></span>
            </div>
          </div>
    
          {/* Die 3 Schutzziele & Bewertungsdimensionen im Bauwesen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.t1ÖkologischeQualität} /></strong>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">LCA</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.schutzDerGlobalenUnd} /></p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><MdText text={inhalt.texte.treibhauspotenzialGwpNachDin} /></li>
                  <li><MdText text={inhalt.texte.graueEnergieEmbodiedCarbon} /></li>
                  <li><MdText text={inhalt.texte.ressourceninanspruchnahmePrimärenergiePe} /></li>
                  <li><MdText text={inhalt.texte.flächeninanspruchnahmeVersiegelung} /></li>
                  <li><MdText text={inhalt.texte.zirkularitätRückbaubarkeitDesignFor} /></li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.referenzÖkobaudatEpdNach} /></div>
            </div>
    
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.t2ÖkonomischeQualität} /></strong>
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">LCC</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.optimierungDerGesamtwirtschaftlichkeitÜb} /></p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><MdText text={inhalt.texte.lebenszykluskostenLccNachIso} /></li>
                  <li><MdText text={inhalt.texte.herstellungskostenKg300400} /></li>
                  <li><MdText text={inhalt.texte.wertstabilitätDrittverwendungsfähigkeitU} /></li>
                  <li><MdText text={inhalt.texte.risikoabsicherungVermeidungVonStranded} /></li>
                  <li><MdText text={inhalt.texte.restwertVonSekundärbaustoffenGebäude} /></li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.referenzDin18960Barwertmethode} /></div>
            </div>
    
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.t3SoziokulturelleFunktionaleQualität} /></strong>
                  <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Komfort</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.sicherungVonGesundheitBehaglichkeit} /></p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><MdText text={inhalt.texte.gesundheitInnenraumhygieneVocBegrenzung} /></li>
                  <li><MdText text={inhalt.texte.thermischerKomfortSommerlicherWärmeschut} /></li>
                  <li><MdText text={inhalt.texte.visuellerKomfortTageslichtquotientDin} /></li>
                  <li><MdText text={inhalt.texte.akustischerKomfortSchallschutzDin} /></li>
                  <li><MdText text={inhalt.texte.barrierefreiheitDin180401} /></li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.referenzDinEn16309} /></div>
            </div>
          </div>
    
          {/* Querschnittsqualitäten: Technische Qualität & Prozessqualität */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.technischeQualitätQuerschnittskriterium} /></strong>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.tragsicherheitBrandschutzDin4102} /></p>
            </div>
    
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.prozessqualitätIntegralePlanung} /></strong>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.integralePlanungAllerFachdisziplinen} /></p>
            </div>
          </div>
    
          {/* Differenzierungs-Matrix: Konventionell vs. Nachhaltig */}
          <div className="overflow-x-auto rounded-xl border border-home-grau/20">
            <table className="w-full text-xs text-left">
              <thead className="bg-off-white text-text-main border-b border-home-grau/20">
                <tr>
                  <th className="p-3 font-bold">Kriterium</th>
                  <th className="p-3 font-bold text-slate-600"><MdText text={inhalt.texte.konventionellesBauen} /></th>
                  <th className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.nachhaltigesBauenStandDer} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/10 bg-white text-text-main/80">
                <tr>
                  <td className="p-3 font-semibold text-text-main">Betrachtungszeitraum</td>
                  <td className="p-3"><MdText text={inhalt.texte.errichtungÜbergabeInvestitionskostenKg} /></td>
                  <td className="p-3 font-medium text-text-main"><MdText text={inhalt.texte.gesamterLebenszyklus50100} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Klimabilanz</td>
                  <td className="p-3"><MdText text={inhalt.texte.fokusNurAufBetriebsenergie} /></td>
                  <td className="p-3 font-medium text-text-main"><MdText text={inhalt.texte.ganzheitlicheÖkobilanzEmbodiedCarbon} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Baustoffauswahl</td>
                  <td className="p-3"><MdText text={inhalt.texte.preisEinfacheVerarbeitbarkeitLineare} /></td>
                  <td className="p-3 font-medium text-text-main"><MdText text={inhalt.texte.zirkularitätSchadstofffreiheitAgbbEpd} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Gebäudebestand</td>
                  <td className="p-3"><MdText text={inhalt.texte.abrissUndNeubauAls} /></td>
                  <td className="p-3 font-medium text-text-main"><MdText text={inhalt.texte.bestandserhaltAlsPrimärstrategieErhalt} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Lebenszyklusende</td>
                  <td className="p-3"><MdText text={inhalt.texte.deponierungOderDowncyclingIm} /></td>
                  <td className="p-3 font-medium text-text-main"><MdText text={inhalt.texte.urbanMiningSelektiverRückbau} /></td>
                </tr>
              </tbody>
            </table>
          </div>
    
          {/* Fundierte Quellenübersicht */}
          <div className="p-4 rounded-xl border border-slate-200 bg-off-white text-xs space-y-2">
            <strong className="text-text-main font-bold flex items-center gap-1.5">
              <Library className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.maßgeblicheWissenschaftlicheNormativeQue} /></strong>
            <ul className="text-[11px] text-text-main/70 space-y-1 list-disc list-inside">
              <li><MdText text={inhalt.texte.brundtlandBerichtWorldCommission} /></li>
              <li><MdText text={inhalt.texte.dinEn156432021} /></li>
              <li><MdText text={inhalt.texte.dinEn159782026} /></li>
              <li><MdText text={inhalt.texte.dinEnIso153922} /></li>
              <li><MdText text={inhalt.texte.bmwsbBundesministeriumFürWohnen} /></li>
              <li><MdText text={inhalt.texte.rockströmJEtAl} /></li>
              <li><MdText text={inhalt.texte.carlowitzHCV} /></li>
              <li><MdText text={inhalt.texte.dalyHEToward} /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
