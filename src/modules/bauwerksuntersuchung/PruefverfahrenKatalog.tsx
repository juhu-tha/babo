import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import { PRUEFVERFAHREN_LIST } from './pruefverfahrenData';
import { PruefverfahrenSimulator } from './PruefverfahrenSimulatoren';
import { Search, Info, Check, ShieldCheck, AlertTriangle, Layers, Activity, Sliders, ExternalLink, Scale, Wrench, Lightbulb } from 'lucide-react';
import { METHOD_DIAGNOSE_DETAILS } from './diagnoseData';
import inhalt from '@/content/bauwerksuntersuchung/PruefverfahrenKatalog.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export default function PruefverfahrenKatalog() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'zfp' | 'minimalinvasiv' | 'zerstoerend'>('all');
  const [selectedId, setSelectedId] = useState<string>('bohrwiderstand');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMethods = PRUEFVERFAHREN_LIST.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeMethod = PRUEFVERFAHREN_LIST.find((m) => m.id === selectedId) || PRUEFVERFAHREN_LIST[0];
  const diagnoseDetail = METHOD_DIAGNOSE_DETAILS[activeMethod.id];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Layers className="text-shiraz" /><MdText text={inhalt.texte.interaktiverPrüfverfahrenKatalogDer} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.alle14AnerkanntenVor} /></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz font-bold text-xs rounded-full border border-shiraz/20"><MdText text={inhalt.texte.t14PrüfverfahrenKomplett} /></span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-home-grau/20">
          <AuswahlGruppe label="Filter Kategorie" className="flex flex-wrap gap-1.5">
            <button {...alsOption(selectedCategory === 'all')}
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Alle ({PRUEFVERFAHREN_LIST.length})
            </button>
            <button {...alsOption(selectedCategory === 'zfp')}
              type="button"
              onClick={() => setSelectedCategory('zfp')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === 'zfp'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.zerstörungsfreiZfp6} /></button>
            <button {...alsOption(selectedCategory === 'minimalinvasiv')}
              type="button"
              onClick={() => setSelectedCategory('minimalinvasiv')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === 'minimalinvasiv'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.minimalinvasiv4} /></button>
            <button {...alsOption(selectedCategory === 'zerstoerend')}
              type="button"
              onClick={() => setSelectedCategory('zerstoerend')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === 'zerstoerend'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.zerstörendLabor4} /></button>
          </AuswahlGruppe>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder={inhalt.werte.prüfverfahrenSuchen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Grid of Methods selector buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {filteredMethods.map((m) => {
          const isSelected = m.id === activeMethod.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                isSelected
                  ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/20'
                  : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-75 truncate block">
                {m.badge}
              </span>
              <span className="text-xs font-bold leading-tight line-clamp-2">
                {m.shortName}
              </span>
              <span className={`text-[8.5px] truncate font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                {m.category === 'zfp' ? 'Zerstörungsfrei' : m.category === 'minimalinvasiv' ? 'Minimalinvasiv' : 'Zerstörend'}
              </span>
            </button>
          );
        })}
      </div>

      {/* DETAILED EXPERTISE CARD: GOLD STANDARD (IDENTISCH MIT BOHRWIDERSTAND) */}
      <div className="bg-white rounded-2xl border border-home-grau/30 p-6 space-y-6 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/25 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 bg-shiraz/10 text-shiraz rounded-full">
                {activeMethod.categoryLabel}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                {activeMethod.badge}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity size={20} className="text-shiraz" />
              {activeMethod.name}
            </h2>
          </div>
          <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1.5 self-start md:self-center shadow-3xs max-w-md">
            <span className="font-bold text-shiraz shrink-0"><MdText text={inhalt.texte.normenPrüfregeln} /></span>
            <span className="font-mono text-[11px] text-slate-600 truncate">{activeMethod.standard}</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Block: Principle & Steps */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Aufsichtsbehördliches & Physikalisches Messprinzip */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 wie-h4">
                <Info size={14} className="text-shiraz" /><MdText text={inhalt.texte.aufsichtsbehördlichesPhysikalischesMessp} /></h3>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {activeMethod.principle}
              </p>
            </div>

            {/* 2. Prozessschritte der Durchführung in der Baupraxis */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 wie-h4">
                <span className="w-1.5 h-3 bg-shiraz rounded-xs" /><MdText text={inhalt.texte.prozessschritteDerDurchführungBaupraxis} /></h3>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {activeMethod.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-3xs hover:border-slate-200 transition-all">
                    <span className="w-5 h-5 flex items-center justify-center bg-shiraz text-white text-[10px] font-bold rounded-full shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-700 leading-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Interaktiver Simulator / Rechner für das ausgewählte Verfahren */}
            <div className="pt-2">
              <PruefverfahrenSimulator method={activeMethod} />
            </div>
          </div>

          {/* Right Block: Math Model, Pros & Cons, Reference Values */}
          <div className="lg:col-span-5 space-y-5">
            {/* Mathematisch-physikalisches Modell */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-home-grau/25 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider wie-h4"><MdText text={inhalt.texte.mathematischPhysikalischesModell} /></h3>
              <div className="py-3 px-4 bg-white rounded-xl border border-slate-200 shadow-3xs flex items-center justify-center text-center overflow-x-auto">
                <BlockMath math={activeMethod.formula} />
              </div>
              <p className="text-[11px] text-slate-600 leading-normal bg-white p-3 rounded-lg border border-slate-100">
                {activeMethod.formulaExplanation}
              </p>
            </div>

            {/* Verfahrensbeurteilung: Vorteile vs Grenzen */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider wie-h4"><MdText text={inhalt.texte.verfahrensbeurteilungImIngenieurbau} /></h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-xs text-emerald-800 flex items-center gap-1.5 wie-h5">
                    <Check size={14} className="text-emerald-700" /><MdText text={inhalt.texte.unerlässlicheVorteile} /></h4>
                  <ul className="space-y-1 text-[11px] text-emerald-800 list-disc list-inside leading-snug">
                    {activeMethod.pros.map((pro, i) => (
                      <li key={i} className="align-top">{pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1.5">
                  <h4 className="font-bold text-xs text-rose-800 flex items-center gap-1.5 wie-h5">
                    <AlertTriangle size={14} className="text-rose-700" /><MdText text={inhalt.texte.echteSystemgrenzenFehlerquellen} /></h4>
                  <ul className="space-y-1 text-[11px] text-rose-800 list-disc list-inside leading-snug">
                    {activeMethod.cons.map((con, i) => (
                      <li key={i} className="align-top">{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Richtwerte & Beurteilungskriterien */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 wie-h4">
                <Info size={14} className="text-amber-700" /><MdText text={inhalt.texte.normativeRichtwerteBeurteilungskriterien} /></h3>
              <p className="text-[11px] text-amber-900/90 leading-relaxed text-justify">
                {activeMethod.referenceValues}
              </p>
            </div>
          </div>
        </div>

        {/* NEUE EXPANDIERTE FACHDIMENSIONEN NACH PRÜFQUALITÄT & GEMINI_MD */}
        {diagnoseDetail && (
          <div className="pt-6 border-t border-home-grau/25 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2 wie-h4">
                <ShieldCheck className="text-shiraz" size={18} /><MdText text={inhalt.texte.prüfungsnormativeVorgabenIngenieurpraxis} />{activeMethod.shortName}
              </h3>
              <span className="text-[11px] font-mono text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full font-bold"><MdText text={inhalt.texte.dinEnWtaDbv} /></span>
            </div>

            {/* 1. NOTWENDIGE ANZAHL PRÜFUNGEN / PRÜFPUNKTE & ENTNAHMESTELLEN */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 wie-h5">
                  <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t1NotwendigeAnzahlPrüfungen} /></h4>
                <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {diagnoseDetail.samplingPoints.normVorgabe}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.normativerMindestumfang} /></span>
                  <p className="text-slate-800 font-semibold text-xs leading-snug">
                    {diagnoseDetail.samplingPoints.mindestAnzahl}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.prüfrasterGeometrie} /></span>
                  <p className="text-slate-800 font-semibold text-xs leading-snug">
                    {diagnoseDetail.samplingPoints.rasterMass}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.statistischeAbsicherung} /></span>
                  <p className="text-slate-650 text-[11px] leading-snug">
                    {diagnoseDetail.samplingPoints.statistischeBegruendung}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.kriterienZurVerteilungDer} /></span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 list-disc list-inside">
                  {diagnoseDetail.samplingPoints.auswahlKriterien.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. PROBEN- UND PRÜFSTELLENKONDITIONIERUNG */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 wie-h5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t2ProbenUndPrüfstellenkonditionierung} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-800 block text-xs"><MdText text={inhalt.texte.oberflächenBauteilvorbereitungVorOrt} /></strong>
                    <p className="text-slate-650 text-[11px] leading-relaxed">
                      {diagnoseDetail.conditioning.oberflaeche}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-800 block text-xs"><MdText text={inhalt.texte.feuchteTemperaturrandbedingungen} /></strong>
                    <p className="text-slate-650 text-[11px] leading-relaxed">
                      {diagnoseDetail.conditioning.klimaUndFeuchte}
                    </p>
                  </div>
                  {diagnoseDetail.conditioning.vorbereitungLabor && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <strong className="text-slate-800 block text-xs"><MdText text={inhalt.texte.laboraufbereitungKalibrierung} /></strong>
                      <p className="text-slate-650 text-[11px] leading-relaxed">
                        {diagnoseDetail.conditioning.vorbereitungLabor}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                  <strong className="text-rose-900 block text-xs flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-rose-700" /><MdText text={inhalt.texte.kritischeFehlerquellenBeiDer} /></strong>
                  <ul className="space-y-1.5 text-[11px] text-rose-800 list-disc list-inside leading-snug">
                    {diagnoseDetail.conditioning.kritischeFehlerVermeidung.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. RELEVANTE NORMEN UND REGELWERKE MIT DIN MEDIA LINKS */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 wie-h5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t3RelevanteNormenRegelwerke} /></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {diagnoseDetail.standards.map((std, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-900">{std.code}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">{std.date}</span>
                      </div>
                      <h5 className="text-[11px] font-semibold text-slate-800 mt-1 leading-snug wie-h6">{std.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">{std.scope}</p>
                    </div>
                    {std.url ? (
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <a 
                          href={std.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[11px] text-shiraz hover:underline inline-flex items-center gap-1 font-bold"
                        ><MdText text={inhalt.texte.regelwerkÖffnen} /><ExternalLink size={11} />
                        </a>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] text-slate-500 font-mono">DIN-Normenbezug</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. WICHTIG: INTERPRETATION UND ANWENDUNG DER ERGEBNISSE */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border-2 border-shiraz/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5 wie-h5">
                  <span className="w-2 h-2 rounded-full bg-shiraz animate-pulse"></span><MdText text={inhalt.texte.t4WichtigInterpretationBautechnische} /></h4>
              </div>

              <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.ingenieurtechnischeKerndiagnose} />{diagnoseDetail.interpretation.kerndiagnose}
              </div>

              {/* Grenzwerte-Tabelle */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2 px-3">Parameter</th>
                      <th className="py-2 px-3">Messwertbereich</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3"><MdText text={inhalt.texte.bautechnischeBewertung} /></th>
                      <th className="py-2 px-3"><MdText text={inhalt.texte.konsequenzMaßnahme} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {diagnoseDetail.interpretation.grenzwerte.map((gw, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{gw.parameter}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{gw.wert}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            gw.status === 'ok' ? 'bg-emerald-100 text-emerald-800' :
                            gw.status === 'warn' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {gw.status === 'ok' ? 'Zulässig' : gw.status === 'warn' ? 'Achtung' : 'Kritisch'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-700">{gw.bewertung}</td>
                        <td className="py-2 px-3 text-[11px] font-medium text-shiraz">{gw.massnahme}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tragwerksauswirkung & Instandsetzungskonsequenz Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 wie-h6">
                    <Scale size={14} className="text-shiraz" /><MdText text={inhalt.texte.tragwerksauswirkungStatikStandsicherheit} /></h5>
                  <p className="text-[11.5px] text-slate-650 leading-relaxed">
                    {diagnoseDetail.interpretation.tragwerksAuswirkung}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 wie-h6">
                    <Wrench size={14} className="text-shiraz" /><MdText text={inhalt.texte.instandsetzungskonsequenzDibtTrInstandha} /></h5>
                  <p className="text-[11.5px] text-slate-650 leading-relaxed">
                    {diagnoseDetail.interpretation.instandsetzungsKonsequenz}
                  </p>
                </div>
              </div>

              {/* Praxis-Fallbeispiel */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1 text-xs">
                <strong className="text-amber-900 block flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-700" /><MdText text={inhalt.texte.realesIngenieurFallbeispielAus} /></strong>
                <p className="text-[11.5px] text-amber-900/90 leading-relaxed">
                  {diagnoseDetail.interpretation.praxisFallbeispiel}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="font-bold text-sm text-text-main flex items-center gap-2 wie-h4">
          <Sliders className="text-shiraz" size={16} /><MdText text={inhalt.texte.synopseVergleichendeBewertungsmatrixAlle} /></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-home-grau/30 text-slate-500 font-bold bg-slate-50">
                <th className="py-2.5 px-3">Prüfverfahren</th>
                <th className="py-2.5 px-3">Kategorie</th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.baustoffObjekt} /></th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.primäreMessgröße} /></th>
                <th className="py-2.5 px-3">Aussage</th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.normativeGrundlage} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRUEFVERFAHREN_LIST.map((m) => (
                <tr 
                  key={m.id} 
                  onClick={() => setSelectedId(m.id)}
                  className={`cursor-pointer transition-colors ${m.id === activeMethod.id ? 'bg-shiraz/5 font-semibold text-shiraz' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <td className="py-2 px-3 font-bold">{m.shortName}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      m.category === 'zfp' ? 'bg-sky-100 text-sky-800' :
                      m.category === 'minimalinvasiv' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {m.category === 'zfp' ? 'Zerstörungsfrei' : m.category === 'minimalinvasiv' ? 'Minimalinvasiv' : 'Zerstörend'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-600">
                    {m.id === 'bohrwiderstand' ? 'Holztragwerke' :
                     m.id === 'karsten' ? inhalt.werte.putzMauerwerkFassade :
                     m.id === 'darrmethode' ? inhalt.werte.betonEstrichMauerwerkPutz :
                     m.id === 'endoskopie' ? inhalt.werte.hohlräumeInMauerwerkDecken :
                     m.id === 'georadar' ? inhalt.werte.betonMauerwerkFahrbahnen :
                     m.id === 'ultraschall' || m.id === 'impact_echo' ? inhalt.werte.betonMauerwerkNaturstein :
                     m.id === 'haftabzug' ? inhalt.werte.betonPutzBeschichtungen :
                     inhalt.werte.stahlbetonSpannbeton}
                  </td>
                  <td className="py-2 px-3 text-[11px] font-mono">{m.badge}</td>
                  <td className="py-2 px-3 text-[11px] text-slate-600">
                    {m.id === 'bohrkern' ? inhalt.werte.referenzwertDruckfestigkeitFC :
                     m.id === 'potentialfeld' ? inhalt.werte.wahrscheinlichkeitAktiverKorrosion :
                     m.id === 'covermeter' ? inhalt.werte.sollIstAbgleichBetondeckung :
                     m.id === 'bohrmehl' ? inhalt.werte.chloridkonzentrationClProfil :
                     m.id === 'bohrwiderstand' ? inhalt.werte.dichteprofilRestquerschnitt :
                     m.id === 'haftabzug' ? inhalt.werte.abreißfestigkeitFCtVerbund :
                     m.id === 'schmidthammer' ? inhalt.werte.oberflächenhärteFestigkeitNurNach :
                     m.id === 'ultraschall' ? inhalt.werte.gefügehomogenitätFehlstellenDynE :
                     m.id === 'georadar' ? inhalt.werte.lageVonBewehrungSpanngliedern :
                     m.id === 'impact_echo' ? inhalt.werte.bauteildickeHohlstellenVerpressfehler :
                     m.id === 'karbonatisierung' ? inhalt.werte.karbonatisierungstiefeDK :
                     m.id === 'karsten' ? inhalt.werte.wasseraufnahmeDerOberflächeOrientierend :
                     m.id === 'endoskopie' ? inhalt.werte.sichtbefundInHohlräumenSchichtaufbau :
                     m.id === 'darrmethode' ? inhalt.werte.referenzwertFeuchtegehaltM :
                     inhalt.werte.zerstörungsfreieGefügeanalyse}
                  </td>
                  <td className="py-2 px-3 text-[10px] font-mono text-slate-500 truncate max-w-[200px]">{m.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
