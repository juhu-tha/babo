import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Sliders, 
  Scale, 
  ExternalLink, 
  Beaker, 
  Thermometer, 
  Info,
  Grid,
  FileText
} from 'lucide-react';
import { SAMPLING_PRESETS } from './diagnoseData';
import { probenahmeUmfang } from '@/src/calc/bauwerksuntersuchung';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/bauwerksuntersuchung/ProbenahmePlaner.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export default function ProbenahmePlaner() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tiefgarage');
  
  // Custom calculator state
  const [customBauteil, setCustomBauteil] = useState<'decke' | 'stuetze' | 'wand' | 'balken' | 'holz'>('decke');
  const [flaecheM2, setFlaecheM2] = useState<number>(600);
  const [bauteilAnzahl, setBauteilAnzahl] = useState<number>(12);
  const [verfahrenType, setVerfahrenType] = useState<'verfahrenA' | 'verfahrenB'>('verfahrenA');
  const [primaryGoal, setPrimaryGoal] = useState<'druckfestigkeit' | 'chlorid' | 'karbonatisierung' | 'haftzug' | 'potentialfeld'>('chlorid');

  // Active preset
  const activePreset = useMemo(() => {
    return SAMPLING_PRESETS.find(p => p.id === selectedPresetId) || SAMPLING_PRESETS[0];
  }, [selectedPresetId]);

  // Calculations for custom planner
  const calculatedScope = useMemo(() => {
    // Rechenkern (src/calc/bauwerksuntersuchung.ts): Bohrkerne nach DIN EN 13791 (Verfahren A/B), ZfP-Messpunkte,
    // Bohrmehl-Tiefenprofile, Haftzugstempel (DIN EN 1542 / ZTV-ING) – Lehransätze
    const { bohrkerne, zfpPunkte, bohrmehlStellen, haftzugStempel } = probenahmeUmfang({ ziel: primaryGoal, verfahren: verfahrenType, flaecheM2, bauteilAnzahl });
    const rasterMass = primaryGoal === 'potentialfeld' ? inhalt.werte.t1515CmBis
      : primaryGoal === 'chlorid' ? inhalt.werte.t2525CmCovermeter
      : primaryGoal === 'druckfestigkeit' ? inhalt.werte.t3030CmPrüffelder
      : '20 × 20 cm';

    return {
      bohrkerne,
      zfpPunkte,
      bohrmehlStellen,
      haftzugStempel,
      rasterMass
    };
  }, [flaecheM2, bauteilAnzahl, verfahrenType, primaryGoal]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Normative Einordnung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={20} /><MdText text={inhalt.texte.normativeStichprobenplanungKonditionieru} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.verbindlicheFestlegungVonMindestprüfpunk} /></p>
          </div>
          <span className="px-3 py-1 bg-shiraz/10 text-shiraz text-xs font-bold rounded-full border border-shiraz/20 self-start md:self-center"><MdText text={inhalt.texte.prüfdimension3Vollständigkeit} /></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-home-grau/20 text-xs">
          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Scale size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1StatistischeRepräsentanz} /></span>
            <p className="text-slate-650 leading-relaxed text-[11px]"><MdText text={inhalt.texte.einzelfundeBesitzenVorGericht} /></p>
          </div>

          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Thermometer size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2ExakteKonditionierung} /></span>
            <p className="text-slate-650 leading-relaxed text-[11px]"><MdText text={inhalt.texte.falscheFeuchteVerfälschtPrüfwerte} /></p>
          </div>

          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Grid size={14} className="text-shiraz" /><MdText text={inhalt.texte.t3RasterEntnahmeschemata} /></span>
            <p className="text-slate-650 leading-relaxed text-[11px]"><MdText text={inhalt.texte.zerstörungsfreieVorerkundungZfpRaster} /></p>
          </div>
        </div>
      </div>

      {/* 2. Interaktiver Stichproben- & Prüfumfangsrechner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div>
            <h4 className="font-bold text-base text-text-main flex items-center gap-2">
              <Sliders className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiverStichprobenrechnerFürBauwerk} /></h4>
            <p className="text-xs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.wählenSieEinTypisches} /></p>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.praxisnahePrüfszenarienPresets} /></span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {SAMPLING_PRESETS.map((p) => {
              const isSelected = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    setFlaecheM2(p.flaeche);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/20'
                      : 'bg-off-white hover:bg-slate-100 border-home-grau/30 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {p.name.split(' (')[0]}
                  </span>
                  <span className={`text-[10px] mt-2 block font-mono ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {formatDeWert(p.flaeche)} m² • {p.bauteilTyp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-off-white rounded-2xl border border-home-grau/25">
          <div className="md:col-span-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.bauteilartStruktur} /></label>
              <select aria-label={inhalt.werte.bauteilartStruktur}
                value={customBauteil}
                onChange={(e) => setCustomBauteil(e.target.value as typeof customBauteil)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz font-medium"
              >
                <option value="decke">Stahlbetondecke / Bodenplatte (m²)</option>
                <option value="stuetze">Stützen / Pfeiler (Stückzahl)</option>
                <option value="wand">Stützwand / Kelleraußenwand</option>
                <option value="balken">Spannbeton-Unterzug / Träger</option>
                <option value="holz">Holzbalkendecke / Dachstuhl</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.prüfflächeLosgröße} /><span className="text-shiraz font-mono">{formatDeZahl(flaecheM2, 0)} m²</span>
              </label>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={flaecheM2}
                onChange={(e) => setFlaecheM2(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>50 m²</span>
                <span>1500 m²</span>
                <span>3000 m²</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.primäresDiagnoseziel} /></label>
              <select aria-label={inhalt.werte.primäresDiagnoseziel}
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as typeof primaryGoal)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz font-medium"
              >
                <option value="chlorid">Chlorid-Tausalzbelastung &amp; Lochfraß (XD3)</option>
                <option value="druckfestigkeit">In-situ-Druckfestigkeit (DIN EN 13791)</option>
                <option value="potentialfeld">Elektrochemische Korrosionszustandsanalyse</option>
                <option value="karbonatisierung">Karbonatisierungstiefe &amp; Passivierung (XC4)</option>
                <option value="haftzug">Haftzugfestigkeit für Instandsetzungsmörtel</option>
              </select>
            </div>

            {primaryGoal === 'druckfestigkeit' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.verfahrenNachDinEn} /></label>
                <AuswahlGruppe label="Verfahren" className="flex gap-2">
                  <button {...alsOption(verfahrenType === 'verfahrenA')}
                    type="button"
                    onClick={() => setVerfahrenType('verfahrenA')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      verfahrenType === 'verfahrenA'
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  ><MdText text={inhalt.texte.statistischN8Kerne} /></button>
                  <button {...alsOption(verfahrenType === 'verfahrenB')}
                    type="button"
                    onClick={() => setVerfahrenType('verfahrenB')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      verfahrenType === 'verfahrenB'
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  ><MdText text={inhalt.texte.kleineStichprobe37} /></button>
                </AuswahlGruppe>
              </div>
            )}
          </div>

          {/* Results Display */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.ermittelterNormativerPrüfumfangEntnahmes} /></span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Bohrkerne</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.bohrkerne, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5"><MdText text={inhalt.texte.t100MmDinEn} /></span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">ZfP-Messpunkte</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.zfpPunkte, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Raster: {calculatedScope.rasterMass}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Bohrmehl-Profile</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.bohrmehlStellen, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5"><MdText text={inhalt.texte.je5TiefenstufenTrocken} /></span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Haftzugstempel</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.haftzugStempel, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5"><MdText text={inhalt.texte.t50MmDinEn} /></span>
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-white rounded-xl border border-home-grau/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info size={15} className="text-shiraz" />
                <span><MdText text={inhalt.texte.normativeBegründungDesStichprobenumfangs} /></span>
              </div>
              <p className="text-slate-650 leading-relaxed text-[11.5px]">
                {primaryGoal === 'druckfestigkeit' && verfahrenType === 'verfahrenA' && (
                  <><MdText text={inhalt.texte.nachDinEn13791} /></>
                )}
                {primaryGoal === 'druckfestigkeit' && verfahrenType === 'verfahrenB' && (
                  <><MdText text={inhalt.texte.beiWenigerAls8} /></>
                )}
                {primaryGoal === 'chlorid' && (
                  <><MdText text={inhalt.texte.nachDibtTrInstandhaltung} /></>
                )}
                {primaryGoal === 'potentialfeld' && (
                  <><MdText text={inhalt.texte.nachDgzfpMerkblattB} /></>
                )}
                {primaryGoal === 'karbonatisierung' && (
                  <><MdText text={inhalt.texte.nachDinEn14630} /></>
                )}
                {primaryGoal === 'haftzug' && (
                  <><MdText text={inhalt.texte.nachDinEn1542} /></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ausführlicher Leitfaden: Proben- & Prüfstellenkonditionierung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <h4 className="font-bold text-base text-text-main flex items-center gap-2">
          <Beaker className="text-shiraz" size={18} /><MdText text={inhalt.texte.verbindlicherLeitfadenProbenUnd} /></h4>
        <p className="text-xs text-text-main/70 -mt-3"><MdText text={inhalt.texte.präziseVorbereitungsLagerungsUnd} /></p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Bohrkerne */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dinEn125041} /></span>
              <h5 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.bohrkerneFürDruckprüfung} /></h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.ablängenSchlankheitsverhältnisHD} /></li>
                <li><MdText text={inhalt.texte.planparallelitätStirnflächenAufToleranz} /></li>
                <li><MdText text={inhalt.texte.feuchtelagerungMind3Tage} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerNasserBeton} /></div>
          </div>

          {/* Card 2: Potentialfeldmessung */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dgzfpB1AstmC876} /></span>
              <h5 className="font-bold text-sm text-slate-800">Potentialfeldmessung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.vorbefeuchtungOberflächeMind30} /></li>
                <li><MdText text={inhalt.texte.pfützenfreiheitFreiesWasserVor} /></li>
                <li><MdText text={inhalt.texte.bewehrungskontaktFreilegungAnGesunder} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerTrockenerBeton} /></div>
          </div>

          {/* Card 3: Bohrmehl (Chloride) */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dinEn14629Dibt} /></span>
              <h5 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.bohrmehlanalyseChloride} /></h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.trockenbohrenAusschließlichMitSchlagbohr} /></li>
                <li><MdText text={inhalt.texte.tiefenstufungBohrlochNachJeder} /></li>
                <li><MdText text={inhalt.texte.labortrocknungTrocknenBei105} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerNassbohrenLöst} /></div>
          </div>

          {/* Card 4: Phenolphthalein-Test */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dinEn14630} /></span>
              <h5 className="font-bold text-sm text-slate-800">Karbonatisierungsprüfung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.bruchflächeFrischHergestellterStemmbruch} /></li>
                <li><MdText text={inhalt.texte.entstaubenUnmittelbarVorAufsprühen} /></li>
                <li><MdText text={inhalt.texte.indikator01Phenolphthalein} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerAblesungZwingend} /></div>
          </div>

          {/* Card 5: Haftabzug */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dinEn1542Ztv} /></span>
              <h5 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.haftabzugsprüfungAbreißversuch} /></h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.ringnutKernbohrung50Mm} /></li>
                <li><MdText text={inhalt.texte.kleber2kEpoxidharzkleberAuf} /></li>
                <li><MdText text={inhalt.texte.zugrateBelastungMitKonstanter} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerSchiefzugErzeugt} /></div>
          </div>

          {/* Card 6: Gravimetrische Darr-Methode */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block"><MdText text={inhalt.texte.dinEnIso12570} /></span>
              <h5 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.gravimetrischeDarrprüfung} /></h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><MdText text={inhalt.texte.probennahmeDurchMeißelnMit} /></li>
                <li><MdText text={inhalt.texte.trocknungBetonZementBei} /></li>
                <li><MdText text={inhalt.texte.gewichtskonstanzTrocknenBisDifferenz} /></li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800"><MdText text={inhalt.texte.kritischerFehlerGipsBei} /></div>
          </div>
        </div>
      </div>

      {/* 4. Normen- & Regelwerk-Synopse mit DIN Media Links */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
            <FileText className="text-shiraz" size={16} /><MdText text={inhalt.texte.relevanteNormenRegelwerkeDer} /></h4>
          <span className="text-[11px] font-mono text-slate-400"><MdText text={inhalt.texte.ausgabe2026Harmonisiert} /></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-home-grau/30 text-slate-500 font-bold bg-slate-50">
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.normRegelwerk} /></th>
                <th className="py-2.5 px-3">Ausgabe</th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.gegenstandPrüfbereich} /></th>
                <th className="py-2.5 px-3"><MdText text={inhalt.texte.stichprobenKonditionierungskern} /></th>
                <th className="py-2.5 px-3 text-right">Referenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dinEn13791} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-02</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.inSituDruckfestigkeitVon} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.n8KerneF} /></td>
                <td className="py-2 px-3 text-right">
                  <span className="text-slate-500 font-mono text-xs">DIN-Norm</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dinEn1250412} /></td>
                <td className="py-2 px-3 font-mono text-slate-600"><MdText text={inhalt.texte.t2019Bis2021} /></td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.prüfungVonBetonIn} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.konditionierungHDPlanparallelität} /></td>
                <td className="py-2 px-3 text-right">
                  <span className="text-slate-500 font-mono text-xs">DIN-Norm</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dinEn14629} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2007-06</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.bestimmungDesChloridgehaltsIm} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.trockenbohrmehlTiefenstufung5Mm} /></td>
                <td className="py-2 px-3 text-right">
                  <span className="text-slate-500 font-mono text-xs">DIN-Norm</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dinEn146302} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2007-01</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.karbonatisierungstiefeMitPhenolphthalein} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.bruchfrischeSpaltfläche01} /></td>
                <td className="py-2 px-3 text-right">
                  <span className="text-slate-500 font-mono text-xs">DIN-Norm</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 1542</td>
                <td className="py-2 px-3 font-mono text-slate-600">1999-07</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.haftfestigkeitImAbreißversuch} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.t50MmKernbohrung15} /></td>
                <td className="py-2 px-3 text-right">
                  <span className="text-slate-500 font-mono text-xs">DIN-Norm</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dgzfpMerkblattB03} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2018-06</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.elektrochemischePotenzialmessungStahlbet} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.rastermaß1520Cm} /></td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dgzfp.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DGZfP <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dbvMerkblattBetondeckung} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2015-12</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.betondeckungUndBewehrungIm} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.mind2030Messwerte} /></td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.betonverein.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DBV <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900"><MdText text={inhalt.texte.dibtTrInstandhaltung} /></td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-05</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.technischeRegelInstandhaltungVon} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.korrosionsauslösenderChloridgehaltObjekt} /></td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dibt.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIBt <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN 68800-4</td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-12</td>
                <td className="py-2 px-3 font-medium"><MdText text={inhalt.texte.holzschutzBekämpfendeMaßnahmenBohrwiders} /></td>
                <td className="py-2 px-3 text-slate-650"><MdText text={inhalt.texte.t23BohrungenJe} /></td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.wta-international.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    WTA <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
