import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Scale,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  ChevronRight
} from 'lucide-react';
import inhalt from '@/content/spannbeton/BeiwerteKatalog.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface BeiwerterDetail {
  id: string;
  symbol: string;
  latexSymbol: string;
  name: string;
  category: 'kriechen' | 'schwinden' | 'relaxation' | 'elastisch' | 'mechanisch' | 'sicherheit';
  kategorieLabel: string;
  einheit: string;
  schaetzwert: string;
  schaetzwertKurz: string;
  rechenwertNorm: string;
  normBezug: string;
  bedeutungUndEinfluss: string;
  praxisWarnung?: string;
  einflussparameter: string[];
}

export const BEIWERTE_KATALOG: BeiwerterDetail[] = [
  // 1. KRIECHEN
  {
    id: 'phi',
    symbol: 'φ(∞, t0)',
    latexSymbol: '\\varphi(\\infty, t_0)',
    name: inhalt.werte.endkriechzahlDesBetons,
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.t1530,
    schaetzwert: inhalt.werte.typischerVordimensionierungswert20,
    rechenwertNorm: '\\varphi(\\infty, t_0) = \\varphi_0 \\cdot \\beta_c(\\infty, t_0) \\quad \\text{mit } \\varphi_0 = \\phi_{RH} \\cdot \\beta(f_{cm}) \\cdot \\beta(t_0)',
    normBezug: inhalt.werte.dinEn19921,
    bedeutungUndEinfluss: inhalt.werte.beschreibtDasVerhältnisDer,
    praxisWarnung: inhalt.werte.giltNurFürLineare,
    einflussparameter: [
      inhalt.werte.betonfestigkeitsklasseFCmHöhere,
      inhalt.werte.belastungsalterTFrühesBelasten,
      inhalt.werte.relativeLuftfeuchteRhInnenraum,
      inhalt.werte.wirksameBauteildickeH2
    ]
  },
  {
    id: 'phi_rh',
    symbol: 'φ_RH',
    latexSymbol: '\\varphi_{RH}',
    name: inhalt.werte.feuchtebeiwertDerKriechzahl,
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.innenraum182,
    schaetzwert: inhalt.werte.fürTrockeneRäumeRh,
    rechenwertNorm: '\\varphi_{RH} = 1 + \\frac{1 - RH/100}{0.1 \\cdot \\sqrt[3]{h_0}} \\quad (\\text{für } f_{cm} \\le 35\\text{ MPa})',
    normBezug: inhalt.werte.ec2GlB3a,
    bedeutungUndEinfluss: inhalt.werte.erfasstDasZusammenwirkenAus,
    einflussparameter: [inhalt.werte.relativeLuftfeuchtigkeitRhIn, inhalt.werte.wirksameBauteildickeHIn]
  },
  {
    id: 'beta_t0',
    symbol: 'β(t₀)',
    latexSymbol: '\\beta(t_0)',
    name: inhalt.werte.einflussbeiwertDesBetonBelastungsalters,
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.t3D0,
    schaetzwert: inhalt.werte.beiRegelausschalungBzwVorspannung,
    rechenwertNorm: '\\beta(t_0) = \\frac{1}{0.1 + (t_0)^{0.20}} \\quad (\\text{mit modifiziertem } t_{0,T} \\text{ bei Temperaturabweichung})',
    normBezug: inhalt.werte.ec2GlB5,
    bedeutungUndEinfluss: inhalt.werte.jeJüngerDerZementstein,
    praxisWarnung: inhalt.werte.einVorspannenNachBereits,
    einflussparameter: [inhalt.werte.effektivesBetonalterTBei, inhalt.werte.zementartRNS]
  },
  {
    id: 'beta_fcm',
    symbol: 'β(f_cm)',
    latexSymbol: '\\beta(f_{cm})',
    name: inhalt.werte.festigkeitsbeiwertDesKrieches,
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.c253030,
    schaetzwert: inhalt.werte.nimmtMonotonMitSteigender,
    rechenwertNorm: '\\beta(f_{cm}) = \\frac{16.8}{\\sqrt{f_{cm}}} \\quad [f_{cm} \\text{ in MPa}]',
    normBezug: inhalt.werte.ec2GlB4,
    bedeutungUndEinfluss: inhalt.werte.höherfesterBetonBesitztEinen,
    einflussparameter: [inhalt.werte.mittlereDruckfestigkeitFCm]
  },

  // 2. SCHWINDEN
  {
    id: 'eps_cs',
    symbol: 'ε_cs(∞)',
    latexSymbol: '\\varepsilon_{cs}(\\infty)',
    name: inhalt.werte.gesamtschwindmaßDesBetons,
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: inhalt.werte.stauchungBzwMmM,
    schaetzwertKurz: inhalt.werte.t030Bis0,
    schaetzwert: inhalt.werte.fürVordimensionierungImHochbau,
    rechenwertNorm: '\\varepsilon_{cs}(\\infty) = \\varepsilon_{cd}(\\infty) + \\varepsilon_{ca}(\\infty) \\quad (\\text{Trocknungs- + Autogenschwinden})',
    normBezug: inhalt.werte.dinEn199212,
    bedeutungUndEinfluss: inhalt.werte.volumenkontraktionOhneÄußereLast,
    praxisWarnung: inhalt.werte.autogenesSchwindenSetztSofort,
    einflussparameter: [
      inhalt.werte.betongüteFCkSteuert,
      inhalt.werte.relativeLuftfeuchteRhSteuert,
      inhalt.werte.wirksameBauteildickeHVerzögert,
      inhalt.werte.zementklasseRNS
    ]
  },
  {
    id: 'eps_ca',
    symbol: 'ε_ca(∞)',
    latexSymbol: '\\varepsilon_{ca}(\\infty)',
    name: inhalt.werte.autogenesSchwindmaßChemischeKontraktion,
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: inhalt.werte.stauchungBzwMmM2,
    schaetzwertKurz: inhalt.werte.t003Bis0,
    schaetzwert: inhalt.werte.beiNormalbetonenC3037,
    rechenwertNorm: '\\varepsilon_{ca}(\\infty) = 2.5 \\cdot (f_{ck} - 10) \\cdot 10^{-6} \\quad [\\text{für } f_{ck} \\ge 10\\text{ MPa}]',
    normBezug: inhalt.werte.ec2Gl312,
    bedeutungUndEinfluss: inhalt.werte.entstehtDurchSelbstaustrocknungChemische,
    einflussparameter: [inhalt.werte.charakteristischeZylinderdruckfestigkeit, inhalt.werte.wasserzementwertWZ]
  },
  {
    id: 'eps_cd0',
    symbol: 'ε_cd,0',
    latexSymbol: '\\varepsilon_{cd,0}',
    name: inhalt.werte.grundwertDesTrocknungsschwindens,
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: inhalt.werte.stauchung,
    schaetzwertKurz: inhalt.werte.zementklasseN045,
    schaetzwert: inhalt.werte.fürStandardzementeCemI,
    rechenwertNorm: '\\varepsilon_{cd,0} = 0.85 \\cdot \\left[ (220 + 110 \\alpha_{ds1}) \\cdot \\exp\\left(-\\alpha_{ds2} \\frac{f_{cm}}{f_{cmo}}\\right) \\right] \\cdot 10^{-6} \\cdot \\beta_{RH}',
    normBezug: inhalt.werte.ec2AnhangB2,
    bedeutungUndEinfluss: inhalt.werte.referenzSchwindmaßFürUnendlich,
    einflussparameter: [inhalt.werte.zementartAlphaDs1Ds2, inhalt.werte.druckfestigkeitFCm, inhalt.werte.feuchtebeiwertBetaRh]
  },
  {
    id: 'kh',
    symbol: 'k_h',
    latexSymbol: 'k_h',
    name: inhalt.werte.geometrieBeiwertDesTrocknungsschwindens,
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.h100Mm1,
    schaetzwert: inhalt.werte.dünneBauteileH100,
    rechenwertNorm: 'k_h = 1.00 \\,(h_0 \\le 100) \\dots 0.70 \\,(h_0 \\ge 500\\text{ mm}) \\quad [\\text{Interpolation nach EC2 Tab. 3.3}]',
    normBezug: inhalt.werte.ec2Tabelle33,
    bedeutungUndEinfluss: inhalt.werte.wasserDiffundiertExtremLangsam,
    einflussparameter: [inhalt.werte.wirksameBauteildickeH22]
  },

  // 3. STAHLRELAXATION
  {
    id: 'rho_1000',
    symbol: 'ρ₁₀₀₀',
    latexSymbol: '\\rho_{1000}',
    name: inhalt.werte.t1000StundenRelaxationsverlustDes,
    category: 'relaxation',
    kategorieLabel: 'Relaxation',
    einheit: 'Prozent [%]',
    schaetzwertKurz: inhalt.werte.klasse2Niedrig2,
    schaetzwert: inhalt.werte.inModernenTragwerkenWird,
    rechenwertNorm: '\\rho_{1000} = 2.5\\,\\% \\quad (\\text{Klasse 2, Normwert nach EC2 Abs. 3.3.2 (4)})',
    normBezug: inhalt.werte.dinEn199213,
    bedeutungUndEinfluss: inhalt.werte.gibtDenSpannungsabfallIm,
    praxisWarnung: inhalt.werte.erwärmungImBauzustandZ,
    einflussparameter: [inhalt.werte.spannstahlklasseKlasse12, inhalt.werte.prüftemperaturReferenz20C, inhalt.werte.gefügebehandlungStabilisierenThermoMecha]
  },
  {
    id: 'delta_sigma_pr_inf',
    symbol: 'Δσ_pr(∞)',
    latexSymbol: '\\Delta\\sigma_{pr}(\\infty)',
    name: inhalt.werte.endwertDesRelaxationsverlustsBei,
    category: 'relaxation',
    kategorieLabel: 'Relaxation',
    einheit: inhalt.werte.mpaBzwNMm,
    schaetzwertKurz: inhalt.werte.ca25Bis,
    schaetzwert: inhalt.werte.fürTypischeVorspannungP0,
    rechenwertNorm: '\\frac{\\Delta\\sigma_{pr}}{\\sigma_{pi}} = 0.66 \\cdot \\rho_{1000} \\cdot e^{9.1 \\mu} \\cdot \\left(\\frac{t}{1000}\\right)^{0.75 (1-\\mu)} \\cdot 10^{-5} \\quad \\text{mit } \\mu = \\frac{\\sigma_{pi}}{f_{pk}}',
    normBezug: inhalt.werte.ec2Gl329,
    bedeutungUndEinfluss: inhalt.werte.zeitabhängigerAbbauElastischerAtomgitter,
    praxisWarnung: inhalt.werte.dieFormelReagiertExponentiell,
    einflussparameter: [inhalt.werte.ausnutzungsgradPiFPk, inhalt.werte.zeitdauerTNormEndwert, inhalt.werte.relaxationsklasseDesStahls]
  },

  // 4. KOPPLUNG & ZEITABHÄNGIGKEIT (C+S+R)
  {
    id: 'delta_p_csr',
    symbol: 'ΔP_c+s+r(∞)',
    latexSymbol: '\\Delta P_{c+s+r}(\\infty)',
    name: inhalt.werte.gekoppelterLangzeitSpannkraftverlust,
    category: 'sicherheit',
    kategorieLabel: inhalt.werte.gekoppelteLangzeitverluste,
    einheit: inhalt.werte.prozentVonP,
    schaetzwertKurz: inhalt.werte.hochbau1218Brückenbau,
    schaetzwert: inhalt.werte.typischeÜberschlagsgröße15Für,
    rechenwertNorm: '\\Delta\\sigma_{p,c+s+r} = \\frac{\\varepsilon_{cs} E_p + \\Delta\\sigma_{pr} + \\alpha_{\\varphi} \\varphi(t,t_0) \\sigma_{c,QP}}{1 + \\alpha_e \\frac{A_p}{A_c} \\left(1 + \\frac{A_c z_{cp}^2}{I_c}\\right) \\left(1 + 0.8 \\varphi(t,t_0)\\right)}',
    normBezug: inhalt.werte.dinEn199214,
    bedeutungUndEinfluss: inhalt.werte.dieDreiMechanismenTreten,
    einflussparameter: [inhalt.werte.spannstahlEModulEp, inhalt.werte.kriechzahlTT0, inhalt.werte.schwindmaßCs, inhalt.werte.betonspannungCQpAuf]
  },
  {
    id: 'alpha_e',
    symbol: 'α_e',
    latexSymbol: '\\alpha_e = E_p / E_{cm}',
    name: inhalt.werte.elastizitätsmodulVerhältnisStahlBeton,
    category: 'elastisch',
    kategorieLabel: 'Elastizität',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.t55Bis6,
    schaetzwert: inhalt.werte.wirdOftPauschalMit,
    rechenwertNorm: '\\alpha_e = \\frac{E_p}{E_{cm}} = \\frac{195.000\\text{ MPa}}{E_{cm}}',
    normBezug: inhalt.werte.ec2Abs510,
    bedeutungUndEinfluss: inhalt.werte.maßFürDieSteifigkeitskompatibilität,
    einflussparameter: [inhalt.werte.spannstahlartLitzen195Gpa, inhalt.werte.betongüteC3037Bis]
  },

  // 5. REIBUNG & KEILSCHLUPF
  {
    id: 'mu_reibung',
    symbol: 'μ',
    latexSymbol: '\\mu',
    name: inhalt.werte.reibungsbeiwertImHüllrohr,
    category: 'mechanisch',
    kategorieLabel: inhalt.werte.reibungMechanik,
    einheit: inhalt.werte.dimensionslos,
    schaetzwertKurz: inhalt.werte.stahlHüllrohr019,
    schaetzwert: inhalt.werte.normativerStandardRechenwertFür,
    rechenwertNorm: 'P(x) = P_0 \\cdot e^{-\\mu (\\theta + k \\cdot x)}',
    normBezug: inhalt.werte.dinEn199215,
    bedeutungUndEinfluss: inhalt.werte.beschreibtDenReibungswiderstandDes,
    praxisWarnung: inhalt.werte.ungeschmierteOderKorrodierteHüllrohre,
    einflussparameter: [inhalt.werte.hüllrohrmaterialVerzinktesStahlbandVs, inhalt.werte.spannstahlOberflächeGlattProfiliert, inhalt.werte.zustandDerRohreTrocken]
  },
  {
    id: 'k_ungewollt',
    symbol: 'k bzw. β',
    latexSymbol: 'k \\text{ bzw. } \\beta',
    name: inhalt.werte.ungewollterUmlenkwinkelWobbleBeiwert,
    category: 'mechanisch',
    kategorieLabel: inhalt.werte.reibungMechanik2,
    einheit: inhalt.werte.radMBzwM,
    schaetzwertKurz: inhalt.werte.t0005Bis0,
    schaetzwert: inhalt.werte.wirdInStatischenBerechnungen,
    rechenwertNorm: 'k = 0.005 \\dots 0.010\\text{ rad/m} \\quad (\\text{nach Zulassung des Spannverfahrens})',
    normBezug: inhalt.werte.ec2Abs5102,
    bedeutungUndEinfluss: inhalt.werte.erfasstUnvermeidlicheGeometrischeVerlege,
    einflussparameter: [inhalt.werte.unterstützungsabstandDerHüllrohreTyp, inhalt.werte.steifigkeitDesRohres, inhalt.werte.sorgfaltDerBaustellenVerlegung]
  },
  {
    id: 'delta_l_schlupf',
    symbol: 'Δl_s / w',
    latexSymbol: '\\Delta l_s \\text{ bzw. } w',
    name: inhalt.werte.keilschlupfBeimVerankernSetzmaß,
    category: 'mechanisch',
    kategorieLabel: inhalt.werte.reibungMechanik3,
    einheit: inhalt.werte.millimeterMm,
    schaetzwertKurz: inhalt.werte.t48MmTyp,
    schaetzwert: inhalt.werte.typischesSetzmaßBei3,
    rechenwertNorm: 'l_{set} = \\sqrt{\\frac{w \\cdot E_p \\cdot A_p}{p}}, \\quad \\Delta P_{Anker} = 2 \\cdot p \\cdot l_{set}',
    normBezug: inhalt.werte.dinEn199216,
    bedeutungUndEinfluss: inhalt.werte.beimLösenDerSpannpresse,
    praxisWarnung: inhalt.werte.beiKurzenSpanngliedernL,
    einflussparameter: [inhalt.werte.verankerungsbauartKeilMutterFlachanker, inhalt.werte.vorspannverfahrenEtaZulassungskennwert]
  },

  // 6. TEILSICHERHEITSBEIWERTE
  {
    id: 'gamma_p',
    symbol: inhalt.werte.pFavPUnfav,
    latexSymbol: '\\gamma_{P,fav} \\; / \\; \\gamma_{P,unfav}',
    name: inhalt.werte.teilsicherheitsbeiwerteDerVorspannungIm,
    category: 'sicherheit',
    kategorieLabel: inhalt.werte.sicherheitsbeiwerteNormgrenzen,
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.günstig100Oder,
    schaetzwert: inhalt.werte.imRegelfallLinearerSchnittgrößenermittlu,
    rechenwertNorm: '\\gamma_{P,fav} = 1.00 \\quad (\\text{bzw. } 0.90 \\text{ bei Stabilitätsnachweisen}) \\\\ \\gamma_{P,unfav} = 1.00 \\quad (\\text{bzw. } 1.20 \\text{ bei Verankerungsausreißnachweis})',
    normBezug: inhalt.werte.dinEn199217,
    bedeutungUndEinfluss: inhalt.werte.sicherheitsfaktorAufDieVorspannwirkung,
    einflussparameter: [inhalt.werte.verankerungsgrundNachweisartBiegebemessu, inhalt.werte.internerVsExternerVerbund]
  },
  {
    id: 'r_sup_inf',
    symbol: inhalt.werte.rSupRInf,
    latexSymbol: inhalt.werte.rSupRInf2,
    name: inhalt.werte.streubeizahlenDerVorspannkraftIm,
    category: 'sicherheit',
    kategorieLabel: inhalt.werte.sicherheitsbeiwerteNormgrenzen2,
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: inhalt.werte.rSup105,
    schaetzwert: inhalt.werte.nachEc2510,
    rechenwertNorm: 'P_{k,sup} = r_{sup} \\cdot P_m(t) \\quad \\text{und} \\quad P_{k,inf} = r_{inf} \\cdot P_m(t)',
    normBezug: inhalt.werte.dinEn199218,
    bedeutungUndEinfluss: inhalt.werte.erfasstDieStochastischeStreuung,
    praxisWarnung: inhalt.werte.dekompressionUndRissfreiheitMüssen,
    einflussparameter: [inhalt.werte.spanngliedtypSofortigerVerbundVs]
  }
];

export default function BeiwerteKatalog() {
  const [selectedFilter, setSelectedFilter] = useState<'alle' | 'kriechen' | 'schwinden' | 'relaxation' | 'mechanisch' | 'sicherheit'>('alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('phi');

  const filteredBeiwerte = BEIWERTE_KATALOG.filter((item) => {
    const matchesFilter = selectedFilter === 'alle' || item.category === selectedFilter;
    const matchesSearch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bedeutungUndEinfluss.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.normBezug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
        <div>
          <h4 className="text-base font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.normativeBeiwertePhänomeneSchätzwerte} /></h4>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.systematischeGegenüberstellungVonVordime} /></p>
        </div>
        <span className="self-start md:self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"><MdText text={inhalt.texte.dinEn19921} /></span>
      </div>

      {/* Didaktischer Erklärungskasten Schätzwert vs. Rechenwert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-700" /><MdText text={inhalt.texte.wasZeichnetSchätzwerteVordimensionierung} /></div>
          <p className="text-amber-950/80 leading-relaxed"><MdText text={inhalt.texte.inDerEntwurfsphaseLiegen} /></p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-2">
          <div className="font-bold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-700" /><MdText text={inhalt.texte.wasVerlangtDerNormative} /></div>
          <p className="text-blue-950/80 leading-relaxed"><MdText text={inhalt.texte.fürDiePrüffähigeStatik} /></p>
        </div>
      </div>

      {/* Filterleiste */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <button aria-pressed={selectedFilter === 'alle'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'alle'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('alle')}
          ><MdText text={inhalt.texte.alleBeiwerte} />{BEIWERTE_KATALOG.length})
          </button>
          <button aria-pressed={selectedFilter === 'kriechen'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'kriechen'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('kriechen')}
          ><MdText text={inhalt.texte.kriechen} /></button>
          <button aria-pressed={selectedFilter === 'schwinden'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'schwinden'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('schwinden')}
          ><MdText text={inhalt.texte.schwindenCs} /></button>
          <button aria-pressed={selectedFilter === 'relaxation'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'relaxation'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('relaxation')}
          ><MdText text={inhalt.texte.stahlrelaxationPr} /></button>
          <button aria-pressed={selectedFilter === 'mechanisch'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'mechanisch'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('mechanisch')}
          ><MdText text={inhalt.texte.reibungSchlupfKW} /></button>
          <button aria-pressed={selectedFilter === 'sicherheit'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'sicherheit'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('sicherheit')}
          ><MdText text={inhalt.texte.sicherheitsbeiwertePR} /></button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder={inhalt.werte.suchenNachSymbolName}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-home-grau/30 bg-white focus:outline-none focus:ring-1 focus:ring-shiraz"
          />
        </div>
      </div>

      {/* Übersichtstabelle aller Beiwerte */}
      <div className="overflow-x-auto rounded-xl border border-home-grau/30 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-off-white text-text-main border-b border-home-grau/30 font-bold">
              <th className="p-3 w-28"><MdText text={inhalt.texte.symbolName} /></th>
              <th className="p-3 w-28">Kategorie</th>
              <th className="p-3 w-52 bg-amber-50/50 text-amber-900 border-x border-home-grau/20"><MdText text={inhalt.texte.praxisSchätzwertGrößenordnung} /></th>
              <th className="p-3 w-64 bg-blue-50/50 text-blue-900 border-r border-home-grau/20"><MdText text={inhalt.texte.normativerRechenwertEc2Formel} /></th>
              <th className="p-3"><MdText text={inhalt.texte.wirkungPhysikalischerEinfluss} /></th>
              <th className="p-3 w-16 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/20">
            {filteredBeiwerte.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`hover:bg-off-white/80 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-shiraz/5' : ''
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <td className="p-3 font-semibold text-text-main">
                      <div className="font-mono text-sm font-bold text-shiraz flex items-center gap-1.5">
                        <InlineMath math={item.latexSymbol} />
                      </div>
                      <div className="text-[11px] text-text-main/70 leading-tight mt-0.5">
                        {item.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-home-grau/15 text-text-main/80">
                        {item.kategorieLabel}
                      </span>
                      <div className="text-[10px] text-text-main/60 mt-1 font-mono">
                        {item.einheit}
                      </div>
                    </td>
                    <td className="p-3 bg-amber-50/30 font-semibold text-amber-950 border-x border-home-grau/20">
                      <div className="bg-amber-100/60 px-2 py-1 rounded text-amber-900 font-mono text-[11px] font-bold inline-block mb-1">
                        {item.schaetzwertKurz}
                      </div>
                      <div className="text-[11px] font-normal text-amber-900/80 leading-snug">
                        {item.schaetzwert.slice(0, 110)}...
                      </div>
                    </td>
                    <td className="p-3 bg-blue-50/30 text-blue-950 border-r border-home-grau/20">
                      <div className="bg-white/90 p-1.5 rounded border border-blue-200/60 font-mono text-[11px] text-blue-900 overflow-x-auto mb-1">
                        <InlineMath math={item.rechenwertNorm} />
                      </div>
                      <div className="text-[10px] text-blue-800/80 font-medium">
                        {item.normBezug}
                      </div>
                    </td>
                    <td className="p-3 text-text-main/80 leading-relaxed text-[11px]">
                      {item.bedeutungUndEinfluss.slice(0, 130)}...
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        aria-label={inhalt.werte.detailsAufklappen}
                        className="p-1 rounded hover:bg-home-grau/20 text-shiraz font-bold"
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Aufgeklappte Detailansicht */}
                  {isExpanded && (
                    <tr className="bg-[#fcfbf9] border-y border-shiraz/20">
                      <td colSpan={6} className="p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
                          {/* Linke Spalte: Schätzwert vs. Rechenwert ausführlich */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 space-y-2">
                              <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                                <Clock className="h-4 w-4 text-amber-700" /><MdText text={inhalt.texte.praxisSchätzwertVordimensionierung} /></h5>
                              <p className="text-xs text-amber-900/90 leading-relaxed">
                                {item.schaetzwert}
                              </p>
                              <div className="text-[11px] font-mono font-bold text-amber-950 bg-white/70 px-2 py-1 rounded inline-block border border-amber-200">
                                Richtwert: {item.schaetzwertKurz} [{item.einheit}]
                              </div>
                            </div>

                            <div className="bg-blue-50/90 p-4 rounded-xl border border-blue-200 space-y-2">
                              <h5 className="font-bold text-xs text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                                <CheckCircle2 className="h-4 w-4 text-blue-700" /><MdText text={inhalt.texte.exakterRechenwertNachNorm} />{item.normBezug}):
                              </h5>
                              <div className="bg-white p-3 rounded-lg border border-blue-200 overflow-x-auto text-center">
                                <BlockMath math={item.rechenwertNorm} />
                              </div>
                              <p className="text-xs text-blue-900/90 leading-relaxed">
                                {item.bedeutungUndEinfluss}
                              </p>
                            </div>
                          </div>

                          {/* Rechte Spalte: Einflussfaktoren & Praxiswarnungen */}
                          <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs space-y-2.5">
                              <h5 className="font-bold text-xs text-text-main flex items-center gap-1.5 uppercase tracking-wide">
                                <TrendingDown className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.primäreEinflussfaktorenAufDen} /></h5>
                              <ul className="space-y-1.5 text-xs text-text-main/80">
                                {item.einflussparameter.map((param, pIdx) => (
                                  <li key={pIdx} className="flex items-start gap-1.5">
                                    <span className="text-shiraz font-bold mt-0.5">•</span>
                                    <span>{param}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {item.praxisWarnung && (
                              <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                                <div className="font-bold flex items-center gap-1.5 text-rose-950">
                                  <AlertTriangle className="h-4 w-4 text-rose-600" /><MdText text={inhalt.texte.kritischerBaupraxisHinweis} /></div>
                                <p className="leading-relaxed text-[11px] text-rose-950/80">
                                  {item.praxisWarnung}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Synopse / Fazit Box */}
      <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200/60 text-xs text-amber-950/90 space-y-2">
        <div className="font-bold text-amber-950 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-800" /><MdText text={inhalt.texte.ingenieurFazitZurHandhabung} /></div>
        <p className="leading-relaxed"><MdText text={inhalt.texte.schätzwerteErmöglichenImFrühen} /></p>
      </div>
    </div>
  );
}
