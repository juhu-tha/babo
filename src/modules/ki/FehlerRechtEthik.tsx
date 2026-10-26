import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Scale, 
  ShieldAlert, 
  FileWarning, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Cpu, 
  FileText, 
  Flame, 
  Leaf, 
  ShieldCheck,
  Sliders,
  GraduationCap
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import KiDeklarationGuide from '@/src/modules/ki/KiDeklarationGuide';
import inhalt from '@/content/ki/FehlerRechtEthik.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface LimitationCase {
  id: string;
  category: 'norm' | 'rechnung' | 'geometrie' | 'kontext';
  title: string;
  problemDescription: string;
  kiClaim: string;
  realityCheck: string;
  normReference: string;
  preventionGuideline: string;
}

const LIMITATION_CASES: LimitationCase[] = [
  {
    id: 'case_ec2_safety',
    category: 'norm',
    title: inhalt.werte.erfundeneTeilsicherheitsbeiwerteImBetonb,
    problemDescription: inhalt.werte.llmsNeigenDazuSicherheitsbeiwerte,
    kiClaim: inhalt.werte.fürDieBemessungIm,
    realityCheck: inhalt.werte.falschUndLebensgefährlichNach,
    normReference: inhalt.werte.dinEn19921,
    preventionGuideline: inhalt.werte.niemalsZahlenwerteVonSicherheitsbeiwerte
  },
  {
    id: 'case_unit_drift',
    category: 'rechnung',
    title: inhalt.werte.einheitenKonfusionsfalleNMm,
    problemDescription: inhalt.werte.großeSprachmodelleBerechnenNicht,
    kiClaim: inhalt.werte.beiEinerNormalspannungVon,
    realityCheck: inhalt.werte.fatalerRechenfehler25N,
    normReference: inhalt.werte.mechanischeGrundgleichungNA,
    preventionGuideline: inhalt.werte.physikalischeBerechnungenZwingendÜber
  },
  {
    id: 'case_norm_obsolete',
    category: 'norm',
    title: inhalt.werte.zitierenVeralteterZurückgezogenerNormen,
    problemDescription: inhalt.werte.trainingsdatensätzeEnthaltenHistorischeB,
    kiClaim: inhalt.werte.dieAbdichtungErdberührterBauteile,
    realityCheck: inhalt.werte.veraltetDieDin18195,
    normReference: inhalt.werte.din1853312026,
    preventionGuideline: inhalt.werte.jedeZitierteNormIn
  },
  {
    id: 'case_context_blindness',
    category: 'kontext',
    title: inhalt.werte.lostInTheMiddle,
    problemDescription: inhalt.werte.wirdEinKomplettesBaugrund,
    kiClaim: inhalt.werte.dasBaugrundgutachtenBescheinigtDurchgehe,
    realityCheck: inhalt.werte.gefährlicheAuslassungAufSeite,
    normReference: inhalt.werte.din4020DinEn,
    preventionGuideline: inhalt.werte.dokumenteInLogischeAbschnitte
  }
];

export default function FehlerRechtEthik() {
  const [activeSubTab, setActiveSubTab] = useState<'grenzen' | 'haftung' | 'datenschutz' | 'ethik' | 'simulator' | 'deklaration'>('grenzen');
  const [selectedCase, setSelectedCase] = useState<string>('case_ec2_safety');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Risk Calculator State
  const [useCaseType, setUseCaseType] = useState<'vorbemessung' | 'ausfuehrung' | 'text' | 'recherche'>('ausfuehrung');
  const [dataConfidentiality, setDataConfidentiality] = useState<'oeffentlich' | 'intern' | 'geheim'>('geheim');
  const [humanReviewLevel, setHumanReviewLevel] = useState<'keine' | 'stichprobe' | 'vollpruefung'>('stichprobe');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2500);
  };

  const getRiskScore = () => {
    let score = 0;
    if (useCaseType === 'ausfuehrung') score += 40;
    if (useCaseType === 'vorbemessung') score += 25;
    if (useCaseType === 'recherche') score += 10;
    if (useCaseType === 'text') score += 5;

    if (dataConfidentiality === 'geheim') score += 35;
    if (dataConfidentiality === 'intern') score += 20;
    if (dataConfidentiality === 'oeffentlich') score += 0;

    if (humanReviewLevel === 'keine') score += 35;
    if (humanReviewLevel === 'stichprobe') score += 15;
    if (humanReviewLevel === 'vollpruefung') score -= 20;

    return Math.max(5, Math.min(100, score));
  };

  const riskScore = getRiskScore();
  const currentCase = LIMITATION_CASES.find(c => c.id === selectedCase) || LIMITATION_CASES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ShieldAlert className="text-shiraz" /><MdText text={inhalt.texte.fehlerAnwendungsgrenzenRechtEthik} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.verantwortungsvolleIngenieurpraxisVermei} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xxs font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-red-600" /><MdText text={inhalt.texte.kritischeSicherheitszone} /></span>
        </div>

        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 pt-5 border-b border-home-grau/20 mt-2">
          <button aria-pressed={activeSubTab === 'grenzen'}
            onClick={() => setActiveSubTab('grenzen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'grenzen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <FileWarning size={14} /><MdText text={inhalt.texte.t1TechnischeGrenzenHalluzinationen} /></button>
          <button aria-pressed={activeSubTab === 'haftung'}
            onClick={() => setActiveSubTab('haftung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'haftung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Scale size={14} /><MdText text={inhalt.texte.t2BgbHaftungEu} /></button>
          <button aria-pressed={activeSubTab === 'datenschutz'}
            onClick={() => setActiveSubTab('datenschutz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'datenschutz'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Lock size={14} /><MdText text={inhalt.texte.t3DatenschutzGeschäftsgeheimnis} /></button>
          <button aria-pressed={activeSubTab === 'ethik'}
            onClick={() => setActiveSubTab('ethik')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'ethik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Leaf size={14} /><MdText text={inhalt.texte.t4EthikÖkologieBias} /></button>
          <button aria-pressed={activeSubTab === 'simulator'}
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Sliders size={14} /><MdText text={inhalt.texte.t5InteraktiverRisikoCheck} /></button>
          <button aria-pressed={activeSubTab === 'deklaration'}
            onClick={() => setActiveSubTab('deklaration')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'deklaration'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <GraduationCap size={14} /><MdText text={inhalt.texte.t6KiDeklarationThesen} /></button>
        </div>
      </div>

      {/* TAB 1: FEHLER & ANWENDUNGSGRENZEN */}
      {activeSubTab === 'grenzen' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-700 w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-amber-900 leading-relaxed">
                <h4 className="font-bold text-sm text-amber-950"><MdText text={inhalt.texte.dieGrundfalleStatistischeWahrscheinlichk} /></h4>
                <p><MdText text={inhalt.texte.großeSprachmodelleLlmsWie} /></p>
              </div>
            </div>
          </div>

          {/* INTERAKTIVER FALLVERGLEICH */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileWarning className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.realitätsCheckKonkreteBauingenieur} /></h4>
              <span className="text-xxs text-text-main/60"><MdText text={inhalt.texte.wählenSieEinenPraxisfall} /></span>
            </div>

            {/* Fall-Auswahl */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {LIMITATION_CASES.map((c) => (
                <button aria-pressed={selectedCase === c.id}
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    selectedCase === c.id
                      ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold shadow-xs'
                      : 'bg-off-white text-text-main/80 border-home-grau/20 hover:border-shiraz/40'
                  }`}
                >
                  <div className="text-xxs uppercase tracking-wider text-text-main/50 mb-1">
                    {c.category === 'norm' && 'Normungs-Falle'}
                    {c.category === 'rechnung' && 'Einheiten-Falle'}
                    {c.category === 'kontext' && 'Kontext-Falle'}
                    {c.category === 'geometrie' && 'Geometrie-Falle'}
                  </div>
                  <div className="line-clamp-2 leading-snug">{c.title}</div>
                </button>
              ))}
            </div>

            {/* Fall-Detailansicht */}
            <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-4">
              <div>
                <h5 className="font-bold text-sm text-text-main">{currentCase.title}</h5>
                <p className="text-xs text-text-main/70 mt-1">{currentCase.problemDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KI Behauptung */}
                <div className="p-4 bg-red-50/70 rounded-xl border border-red-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs uppercase tracking-wider">
                    <XCircle size={14} className="text-red-600" /><MdText text={inhalt.texte.wasDieKiBehauptete} /></div>
                  <div className="text-xs text-red-950 font-mono bg-white/80 p-3 rounded-lg border border-red-200 leading-relaxed italic">
                    {currentCase.kiClaim}
                  </div>
                </div>

                {/* Realitäts-Check */}
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-emerald-600" /><MdText text={inhalt.texte.wasDieNormPhysik} /></div>
                  <div className="text-xs text-emerald-950 bg-white/80 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                    {currentCase.realityCheck}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-text-main block mb-0.5"><MdText text={inhalt.texte.fundstelleNormenbezug} /></span>
                  <span className="text-text-main/70 font-mono text-xxs">{currentCase.normReference}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-0.5">Präventions-Regel:</span>
                  <span className="text-text-main/80 text-xxs">{currentCase.preventionGuideline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ÜBERSICHT DER 5 FATALEN ANWENDUNGSGRENZEN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.keineRechensicherheitBeiGleitkommazahlen} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.sprachmodelleVerwechselnPotenzenUnd} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.keinRäumliches3dVorstellungsvermögen} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.llmsKönnenBewehrungsführungenVerankerung} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.stichtagsBlindheitCutOff} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.modelleKennenBaurechtlicheNovellierungen} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.bestätigungsVerzerrungSycophancy} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.fragtEinIngenieurReicht} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.pseudowissenschaftlicheQuellenangaben} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.sprachmodelleErfindenBeiBedarf} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                06
              </div>
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.keineIntuitionFürVersagensmechanismen} /></h5>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.einErfahrenerTragwerksplanerSieht} /></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BGB-HAFTUNG & EU AI ACT */}
      {activeSubTab === 'haftung' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BGB & HOAI HAFTUNG */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Scale className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.bgbWerkvertragsrechtHoaiSorgfaltspflicht} /></h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.imDeutschenZivilrechtGilt} /></p>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t1KeineExkulpationDurch} /></h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.derBundesgerichtshofBghHat} /></p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t2VerstoßGegenDie} /></h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.wirdEinBauwerkBasierend} /></p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t3BerufshaftpflichtversicherungInGefahr} /></h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.übernimmtEinIngenieurUngeprüft} /></p>
                </div>
              </div>
            </div>

            {/* EU AI ACT IM BAUWESEN */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <ShieldCheck className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.derEuAiAct} /></h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.dieAm1August} /></p>

                <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-900"><MdText text={inhalt.texte.hochrisikoKiSystemeHigh} /></span>
                    <span className="text-xxs px-2 py-0.5 bg-red-200 text-red-800 rounded-md font-bold">Anhang III</span>
                  </div>
                  <p className="text-xxs text-red-950/80 leading-relaxed"><MdText text={inhalt.texte.nachAnhangIiiNr} /></p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900"><MdText text={inhalt.texte.transparenzpflichtenArt50} /></span>
                    <span className="text-xxs px-2 py-0.5 bg-amber-200 text-amber-800 rounded-md font-bold">Verbindlich</span>
                  </div>
                  <p className="text-xxs text-amber-950/80 leading-relaxed"><MdText text={inhalt.texte.ab02082026} /></p>
                </div>

                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.menschlicheAufsichtHumanIn} /></span>
                    <span className="text-xxs px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md font-bold">Art. 14</span>
                  </div>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.art14VerlangtFür} /></p>
                </div>
              </div>
            </div>

          </div>

          {/* VORLAGE: HAFTUNGS-AUSSCHLUSS IN GUTACHTEN */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-home-grau/20">
              <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
                <FileText className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.musterklauselTransparenzhinweisFürPlanun} /></h5>
              <button
                onClick={() => handleCopy(inhalt.werte.hinweisZumEinsatzComputergestützter, 'klausel')}
                className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedTextId === 'klausel'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                }`}
              >
                {copiedTextId === 'klausel' ? (
                  <>
                    <CheckCircle2 size={13} className="text-white" /> Kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={13} /><MdText text={inhalt.texte.klauselKopieren} /></>
                )}
              </button>
            </div>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-xxs text-text-main/80 font-serif italic leading-relaxed"><MdText text={inhalt.texte.dieInDiesemBericht} /></div>
          </div>
        </div>
      )}

      {/* TAB 3: DATENSCHUTZ & GESCHÄFTSGEHEIMNIS */}
      {activeSubTab === 'datenschutz' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t1DsgvoPersonenbezogeneDaten} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.bauherrennamenAdressenGrundbuchauszügeOd} /></p>
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-150 text-xxs text-red-900 leading-snug"><MdText text={inhalt.texte.verstoßWerPläneMit} /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t2Betriebsgeheimnisse2Geschgehg} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.eigeneUhpcMischungsrezepturenGeheime} /></p>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-150 text-xxs text-amber-900 leading-snug"><MdText text={inhalt.texte.gefahrJeNachTarif} /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t3UrheberrechtAnKi} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.nachDeutschemUrheberrecht2} /></p>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-150 text-xxs text-blue-900 leading-snug"><MdText text={inhalt.texte.rechtsfolgeReinVonEiner} /></div>
            </div>

          </div>

          {/* DATENSCHUTZ-CHECKLISTE FÜR INGENIEURBÜROS */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldCheck className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.datenschutzChecklisteFürDen} /></h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.trainingOptOutAktivieren} /></strong>
                  <span className="text-text-main/70 text-xxs"><MdText text={inhalt.texte.inDenEinstellungenVon} /></span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.anonymisierungVorUpload} /></strong>
                  <span className="text-text-main/70 text-xxs"><MdText text={inhalt.texte.inLeistungsverzeichnissenUndBaugrundberi} /></span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.enterpriseOderTeamVerträge} /></strong>
                  <span className="text-text-main/70 text-xxs"><MdText text={inhalt.texte.niemalsKostenfreiePrivatAccounts} /></span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.lokaleLlmsAlsGoldstandard} /></strong>
                  <span className="text-text-main/70 text-xxs"><MdText text={inhalt.texte.fürStrengVertraulicheGroßprojekte} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ETHIK, ÖKOLOGIE & BIAS */}
      {activeSubTab === 'ethik' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ÖKOLOGISCHER FUSSABDRUCK */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Leaf className="text-emerald-700 w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.ökobilanzVonKiVs} /></h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.imZeitalterDesNachhaltigen} /></p>

                <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-150 space-y-1">
                  <div className="font-bold text-xs text-red-950 flex items-center gap-1.5">
                    <Flame size={14} className="text-red-600" /><MdText text={inhalt.texte.ressourcenverbrauchVonCloudLlms} /></div>
                  <p className="text-xxs text-red-900/80 leading-relaxed"><MdText text={inhalt.texte.eineEinzigeKomplexeFrontier} /></p>
                </div>

                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-150 space-y-1">
                  <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <Leaf size={14} className="text-emerald-600" /><MdText text={inhalt.texte.derPositiveHebelKi} /></div>
                  <p className="text-xxs text-emerald-900/80 leading-relaxed"><MdText text={inhalt.texte.wennKiEingesetztWird} /></p>
                </div>
              </div>
            </div>

            {/* KULTURELLER & NORMATIVER BIAS */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Cpu className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.normativerBiasAngloAmerikanische} /></h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.fastAlleFührendenFrontier} /></p>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t1AciAstmStatt} /></strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.modelleSchlagenStandardmäßigUs} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t2VerantwortungsdiffusionAufDer} /></strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieKiHatGesagt} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t3UrheberrechtlicheAusbeutungVon} /></strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.trainingsdatenKönnenUrheberrechtlichGesc} /></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: INTERAKTIVER RISIKO-RECHNER */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Sliders className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.interaktiverHaftungsRisikoCheck} /></h4>
              <p className="text-xxs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.konfigurierenSieIhrGeplantes} /></p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xxs text-text-main/60">Risiko-Index:</span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                riskScore > 65
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : riskScore > 35
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {formatDeWert(riskScore)} / 100 ({riskScore > 65 ? 'HOCH' : riskScore > 35 ? 'MITTEL' : 'GERING'})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Faktor 1: Anwendungsart */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t1AnwendungsbereichImBauprojekt} /></label>
              <div className="space-y-1.5">
                {inhalt.daten.FehlerRechtEthik.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setUseCaseType(item.id as typeof useCaseType)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      useCaseType === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={useCaseType === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faktor 2: Datenvertraulichkeit */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t2VertraulichkeitDerEingabedaten} /></label>
              <div className="space-y-1.5">
                {inhalt.daten.FehlerRechtEthik_2.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDataConfidentiality(item.id as typeof dataConfidentiality)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      dataConfidentiality === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={dataConfidentiality === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faktor 3: Menschliche Kontrolle */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t3IngenieurmäßigePrüfungHuman} /></label>
              <div className="space-y-1.5">
                {inhalt.daten.FehlerRechtEthik_3.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHumanReviewLevel(item.id as typeof humanReviewLevel)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      humanReviewLevel === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={humanReviewLevel === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ERGEBNIS-EMPFOHLENE MASSNAHMEN */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            riskScore > 65
              ? 'bg-red-50/80 border-red-200 text-red-950'
              : riskScore > 35
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}>
            <h5 className="font-bold text-xs mb-1 flex items-center gap-1.5">
              {riskScore > 65 ? (
                <>
                  <XCircle className="text-red-600" size={16} /><MdText text={inhalt.texte.akutesHaftungsUndCompliance} /></>
              ) : riskScore > 35 ? (
                <>
                  <AlertTriangle className="text-amber-600" size={16} /><MdText text={inhalt.texte.erhöhteAufmerksamkeitPrüfpflichtErforder} /></>
              ) : (
                <>
                  <CheckCircle2 className="text-emerald-600" size={16} /><MdText text={inhalt.texte.unkritischerKonformerEinsatzbereich} /></>
              )}
            </h5>
            <p className="text-xxs">
              {riskScore > 65 && inhalt.werte.derEinsatzVonCloud}
              {riskScore > 35 && riskScore <= 65 && inhalt.werte.dieserEinsatzIstZulässig}
              {riskScore <= 35 && inhalt.werte.sehrGutesRisikoprofilDer}
            </p>
          </div>

        </div>
      )}

      {/* TAB 6: KI-DEKLARATION & LEHRVERANSTALTUNGEN */}
      {activeSubTab === 'deklaration' && (
        <div className="space-y-6">
          <KiDeklarationGuide />
        </div>
      )}

    </div>
  );
}
