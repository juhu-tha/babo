// Ausgelagert aus src/modules/Expositionsklassen.tsx (AP 5.2)
import { useState } from 'react';
import { ShieldCheck, Check, Building2, Compass, Eye } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { BUILDING_ZONES } from './daten';
import inhalt from '@/content/expositionsklassen/ExpositionsklassenSkizze.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface ExpositionsklassenSkizzeProps {
  selectedClasses: string[];
  onApplyClasses: (classes: string[]) => void;
  onToggleClass?: (cls: string) => void;
  compact?: boolean;
}

export function ExpositionsklassenSkizze({
  selectedClasses,
  onApplyClasses,
  onToggleClass,
  compact = false
}: ExpositionsklassenSkizzeProps) {
  const [activeMode, setActiveMode] = useState<'building' | 'cover'>('building');
  const [activeZoneId, setActiveZoneId] = useState<string>('tiefgarage');
  const [selectedCoverClass, setSelectedCoverClass] = useState<'XC1' | 'XC4' | 'XD3' | 'XS3'>('XC4');

  const currentZone = BUILDING_ZONES.find(z => z.id === activeZoneId) || BUILDING_ZONES[0];

  // Betondeckungswerte für Detailzoom
  const coverDetails = inhalt.daten.ExpositionsklassenSkizze[selectedCoverClass];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
      
      {/* HEADER & MODUS-UMSCHALTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.interaktiveBauteilExpositionszonierung} /></h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.verortungDerExpositionsklassenIm} /></p>
          </div>
        </div>

        {/* Tab Switcher: Gebäudeschnitt vs Betondeckung */}
        <div className="flex p-1 bg-off-white rounded-xl border border-home-grau/20 self-start sm:self-auto text-xs font-bold">
          <button aria-pressed={activeMode === 'building'}
            type="button"
            onClick={() => setActiveMode('building')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'building'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-white'
            }`}
          >
            <Compass size={14} /><MdText text={inhalt.texte.t1BauwerksZonierung} /></button>
          <button aria-pressed={activeMode === 'cover'}
            type="button"
            onClick={() => setActiveMode('cover')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'cover'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-white'
            }`}
          >
            <Eye size={14} /><MdText text={inhalt.texte.t2DetailzoomBetondeckungEc2} /></button>
        </div>
      </div>

      {/* QUICK PRESET PILLS */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-text-main/70 block"><MdText text={inhalt.texte.schnellauswahlTypischerIngenieurbauteile} /></span>
        <div className="flex flex-wrap gap-2">
          {BUILDING_ZONES.map(z => {
            const isActive = activeZoneId === z.id && activeMode === 'building';
            const isFullyApplied = z.classes.every(c => selectedClasses.includes(c));

            return (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setActiveZoneId(z.id);
                  setActiveMode('building');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : isFullyApplied
                    ? 'bg-shiraz/10 text-shiraz border-shiraz/30 hover:bg-shiraz/20'
                    : 'bg-white text-text-main/80 border-home-grau/25 hover:bg-off-white'
                }`}
              >
                <span>{z.title.split('&')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-off-white text-text-main/60 border border-home-grau/20'
                }`}>
                  {z.classes.join('+')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* ANSICHT 1: GEBÄUDESCHNITT & UMWELTZONIERUNG                          */}
      {/* =================================================================== */}
      {activeMode === 'building' && (
        <div className="space-y-5">
          {/* Technischer Vektor-Gebäudeschnitt SVG */}
          <div className="w-full bg-[#fcf8f2] rounded-2xl border border-home-grau/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 940 430"
              className="w-full h-auto select-none font-sans"
              style={{ maxHeight: '420px' }}
            >
              <defs>
                {/* Schraffur Erdreich */}
                <pattern id="soilPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="16" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
                  <circle cx="8" cy="8" r="1" fill="#94a3b8" fillOpacity="0.4" />
                </pattern>
                {/* Schraffur Wasser */}
                <pattern id="waterPattern" width="20" height="12" patternUnits="userSpaceOnUse">
                  <path d="M0,6 Q5,2 10,6 T20,6" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.5" />
                </pattern>
                {/* Beton-Pünktelung */}
                <pattern id="concreteDotPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#475569" fillOpacity="0.3" />
                  <circle cx="8" cy="7" r="0.6" fill="#475569" fillOpacity="0.3" />
                  <circle cx="5" cy="11" r="0.9" fill="#475569" fillOpacity="0.25" />
                </pattern>
              </defs>

              {/* HINTERGRUND-ZONEN */}
              {/* Himmel / Atmosphäre */}
              <rect x="0" y="0" width="940" height="230" fill="#f8fafc" />
              {/* Erdreich Baugrund */}
              <rect x="0" y="230" width="600" height="200" fill="#e2e8f0" />
              <rect x="0" y="230" width="600" height="200" fill="url(#soilPattern)" />
              {/* Grundwasser-Bereich */}
              <rect x="0" y="300" width="600" height="130" fill="#0284c7" fillOpacity="0.08" />
              <line x1="0" y1="300" x2="600" y2="300" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6,4" />
              <text x="14" y="318" fill="#0369a1" fontSize="11" fontWeight="bold">
                Grundwasserspiegel (GW) – Sulfatbelastung (XA1–XA3 / SR-Zement)
              </text>

              {/* Meeresbecken rechts */}
              <rect x="740" y="200" width="200" height="230" fill="#0284c7" fillOpacity="0.15" />
              <rect x="740" y="200" width="200" height="230" fill="url(#waterPattern)" />
              {/* Tide-Wellenlinie */}
              <path d="M740,215 Q790,205 840,215 T940,215 L940,430 L740,430 Z" fill="#0284c7" fillOpacity="0.2" />
              <text x="760" y="235" fill="#0369a1" fontSize="11" fontWeight="bold">
                Meerwasser / Brandung (XS3)
              </text>

              {/* GEBÄUDESTRUKTUR */}

              {/* 1. FUNDAMENTPLATTE (Erdreich: XC2 + XA1 + WF) */}
              <g 
                onClick={() => setActiveZoneId('fundament')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="200" y="280" width="400" height="50" 
                  fill={activeZoneId === 'fundament' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'fundament' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'fundament' ? 3 : 1.5}
                  rx="3"
                />
                <rect x="200" y="280" width="400" height="50" fill="url(#concreteDotPattern)" />
                <text x="400" y="310" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">
                  Fundamentplatte &amp; Sohle [XC2 | XA1 | WF]
                </text>
              </g>

              {/* 2. KELLERAUSSENWÄNDE */}
              <rect x="200" y="180" width="24" height="100" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              <rect x="576" y="180" width="24" height="100" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

              {/* 3. TIEFGARAGE / BODENPLATTE & FAHRGASSE (XD3 + XF4 + XM1 + WA) */}
              <g 
                onClick={() => setActiveZoneId('tiefgarage')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="224" y="235" width="352" height="45" 
                  fill={activeZoneId === 'tiefgarage' ? '#fee2e2' : '#e2e8f0'}
                  stroke={activeZoneId === 'tiefgarage' ? '#9b111e' : '#64748b'}
                  strokeWidth={activeZoneId === 'tiefgarage' ? 2.5 : 1.5}
                />
                {/* PKW-Silhouette */}
                <path d="M260,252 L275,242 L310,242 L325,252 L335,252 L335,260 L255,260 L255,252 Z" fill="#475569" fillOpacity="0.7" />
                <circle cx="272" cy="261" r="5" fill="#1e293b" />
                <circle cx="318" cy="261" r="5" fill="#1e293b" />
                {/* Schneematsch-Tropfen & Tausalz */}
                <circle cx="280" cy="268" r="2" fill="#ef4444" />
                <circle cx="310" cy="268" r="2" fill="#ef4444" />
                <circle cx="330" cy="268" r="1.5" fill="#ef4444" />
                <text x="420" y="258" textAnchor="middle" fill={activeZoneId === 'tiefgarage' ? '#9b111e' : '#0f172a'} fontSize="12" fontWeight="bold">
                  Tiefgarage Fahrgasse [XD3 | XF4 | XM1 | WA]
                </text>
                <text x="420" y="272" textAnchor="middle" fill="#64748b" fontSize="9.5">
                  Tausalz-Schneematsch &bull; Lochfraß &bull; c_nom &ge; 55 mm
                </text>
              </g>

              {/* 4. EINFAHRTSRAMPE LINKS (XD3 + XF4 + XM2 + WA) */}
              <g 
                onClick={() => setActiveZoneId('rampe')}
                className="cursor-pointer transition-all"
              >
                <polygon 
                  points="60,180 200,240 200,265 60,205"
                  fill={activeZoneId === 'rampe' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'rampe' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'rampe' ? 3 : 1.5}
                />
                <text x="130" y="210" textAnchor="middle" transform="rotate(22, 130, 210)" fill={activeZoneId === 'rampe' ? '#9b111e' : '#1e293b'} fontSize="10.5" fontWeight="bold">
                  Freie Rampe [XD3 | XF4 | XM2]
                </text>
              </g>

              {/* 5. ERDGESCHOSS- & OBERGESCHOSSDECKE */}
              <rect x="200" y="168" width="400" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
              <rect x="320" y="65" width="280" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />

              {/* INNENSTÜTZEN */}
              <rect x="380" y="81" width="18" height="87" fill="#64748b" />
              <rect x="490" y="81" width="18" height="87" fill="#64748b" />

              {/* 6. WOHN- & BÜRORÄUME INNEN (X0 / XC1 / WO) */}
              <g 
                onClick={() => setActiveZoneId('innen')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="330" y="83" width="260" height="83" 
                  fill={activeZoneId === 'innen' ? '#fee2e2' : '#f8fafc'}
                  fillOpacity={activeZoneId === 'innen' ? 0.6 : 0.8}
                  stroke={activeZoneId === 'innen' ? '#9b111e' : '#cbd5e1'}
                  strokeWidth={activeZoneId === 'innen' ? 2 : 1}
                  strokeDasharray={activeZoneId === 'innen' ? undefined : '4,3'}
                  rx="6"
                />
                <text x="445" y="115" textAnchor="middle" fill={activeZoneId === 'innen' ? '#9b111e' : '#1e293b'} fontSize="12" fontWeight="bold">
                  Wohn- &amp; Büroräume [XC1 | WO]
                </text>
                <text x="445" y="132" textAnchor="middle" fill="#64748b" fontSize="10">
                  Trockene Raumluft (RH 30–65%) &bull; kein Frost
                </text>
                <text x="445" y="148" textAnchor="middle" fill="#0284c7" fontSize="9.5" fontWeight="bold">
                  c_nom = 20 mm &bull; min. C16/20
                </text>
              </g>

              {/* 7. BALKON LINKS (XC4 + XF1 + WF) */}
              <g 
                onClick={() => setActiveZoneId('balkon')}
                className="cursor-pointer transition-all"
              >
                {/* Kragarm-Platte */}
                <rect 
                  x="190" y="68" width="130" height="14" 
                  fill={activeZoneId === 'balkon' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'balkon' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'balkon' ? 2.5 : 1.5}
                />
                {/* Balkongeländer */}
                <line x1="192" y1="68" x2="192" y2="35" stroke="#64748b" strokeWidth="2" />
                <line x1="192" y1="35" x2="310" y2="35" stroke="#64748b" strokeWidth="2" />
                <line x1="250" y1="68" x2="250" y2="35" stroke="#64748b" strokeWidth="1.5" />
                {/* Regenpfeile */}
                <path d="M210,15 L200,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M240,15 L230,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M270,15 L260,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x="250" y="60" textAnchor="middle" fill={activeZoneId === 'balkon' ? '#9b111e' : '#0f172a'} fontSize="11" fontWeight="bold">
                  Balkon [XC4 | XF1 | WF]
                </text>
              </g>

              {/* 8. FLACHDACH & ATTIKA (XC4 + XF3 + WF) */}
              <g 
                onClick={() => setActiveZoneId('dach')}
                className="cursor-pointer transition-all"
              >
                {/* Dachdecke */}
                <rect 
                  x="320" y="24" width="280" height="18" 
                  fill={activeZoneId === 'dach' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'dach' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'dach' ? 2.5 : 1.5}
                />
                {/* Attika-Aufkantung */}
                <rect x="320" y="10" width="18" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                <rect x="582" y="10" width="18" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                {/* Regenwolke Symbol */}
                <path d="M420,10 Q425,2 435,4 Q445,0 455,6 Q465,4 470,10 Z" fill="#94a3b8" fillOpacity="0.4" />
                <line x1="435" y1="12" x2="430" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="450" y1="12" x2="445" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="465" y1="12" x2="460" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <text x="460" y="20" textAnchor="middle" fill={activeZoneId === 'dach' ? '#9b111e' : '#0f172a'} fontSize="11" fontWeight="bold">
                  Flachdach &amp; Attika [XC4 | XF3 | WF]
                </text>
              </g>

              {/* 9. INDUSTRIEBODEN / SCHACHT RECHTS (XA2 + XM2 + WF) */}
              <g 
                onClick={() => setActiveZoneId('industrie')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="615" y="170" width="115" height="110" 
                  fill={activeZoneId === 'industrie' ? '#fee2e2' : '#e2e8f0'}
                  stroke={activeZoneId === 'industrie' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'industrie' ? 2.5 : 1.5}
                  rx="3"
                />
                <rect x="615" y="170" width="115" height="110" fill="url(#concreteDotPattern)" />
                {/* Chemikalienbecken-Schraffur */}
                <rect x="625" y="195" width="95" height="40" fill="#fef08a" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="1" strokeDasharray="3,2" />
                <text x="672" y="215" textAnchor="middle" fill="#854d0e" fontSize="10" fontWeight="bold">
                  Säure / Sulfat
                </text>
                <text x="672" y="228" textAnchor="middle" fill="#854d0e" fontSize="9">
                  600–3.000 mg/l
                </text>
                <text x="672" y="255" textAnchor="middle" fill={activeZoneId === 'industrie' ? '#9b111e' : '#1e293b'} fontSize="10.5" fontWeight="bold">
                  Schacht [XA2 | XM2]
                </text>
                <text x="672" y="270" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
                  SR-Zement Pflicht!
                </text>
              </g>

              {/* 10. KÜSTENBAUWERK / KAIMAUER GANZ RECHTS (XS3 + XF4 + WA) */}
              <g 
                onClick={() => setActiveZoneId('kueste')}
                className="cursor-pointer transition-all"
              >
                <polygon 
                  points="740,150 820,150 820,380 770,380 740,310"
                  fill={activeZoneId === 'kueste' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'kueste' ? '#9b111e' : '#0369a1'}
                  strokeWidth={activeZoneId === 'kueste' ? 3 : 2}
                />
                <rect x="745" y="155" width="70" height="150" fill="url(#concreteDotPattern)" />
                {/* Wellenspritzer */}
                <circle cx="830" cy="180" r="3" fill="#38bdf8" />
                <circle cx="845" cy="190" r="2.5" fill="#38bdf8" />
                <circle cx="838" cy="170" r="2" fill="#38bdf8" />
                <text x="780" y="200" textAnchor="middle" fill={activeZoneId === 'kueste' ? '#9b111e' : '#0c4a6e'} fontSize="11" fontWeight="bold">
                  Kaimauer
                </text>
                <text x="780" y="215" textAnchor="middle" fill={activeZoneId === 'kueste' ? '#9b111e' : '#0c4a6e'} fontSize="9.5" fontWeight="bold">
                  [XS3 | XF4]
                </text>
                <text x="780" y="235" textAnchor="middle" fill="#0369a1" fontSize="9">
                  c_nom = 55 mm
                </text>
              </g>

              {/* HINWEIS-LEGENDEN-BOX */}
              <rect x="15" y="15" width="165" height="60" fill="#ffffff" fillOpacity="0.9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
              <text x="25" y="32" fill="#1e293b" fontSize="10.5" fontWeight="bold">Interaktive Vektorskizze:</text>
              <text x="25" y="48" fill="#64748b" fontSize="9.5">Klicken Sie auf ein Bauteil,</text>
              <text x="25" y="62" fill="#9b111e" fontSize="9.5" fontWeight="bold">um DIN-Grenzwerte zu laden.</text>
            </svg>
          </div>

          {/* DETAIL-INSPEKTIONS-KARTE DES AKTIVEN BAUTEILS */}
          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-shiraz text-white">
                    {currentZone.classes.join(' + ')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-home-grau/20 text-text-main">
                    Feuchteklasse: {currentZone.feuchteklasse}
                  </span>
                  <span className="text-xs text-text-main/60 hidden sm:inline">
                    {currentZone.normRef}
                  </span>
                </div>
                <h4 className="text-base font-bold text-text-main mt-1">
                  {currentZone.title}
                </h4>
                <p className="text-xs text-text-main/70">
                  {currentZone.subtitle}
                </p>
              </div>

              {/* 1-Klick-Übernahme in den Rechner */}
              <button
                type="button"
                onClick={() => onApplyClasses(currentZone.classes)}
                className="px-4 py-2 rounded-xl bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Check size={14} /><MdText text={inhalt.texte.imRechnerÜbernehmen} />{currentZone.classes.join('+')})
              </button>
            </div>

            {/* Normative Grenzwerte-Gitter nach DIN 1045-2 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block"><MdText text={inhalt.texte.maxWZEq} /></span>
                <span className="text-sm font-bold font-mono text-shiraz">
                  &le; {formatDeZahl(currentZone.maxWz, 2)}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block"><MdText text={inhalt.texte.minFestigkeit} /></span>
                <span className="text-sm font-bold font-mono text-text-main">
                  {currentZone.minStrength}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block"><MdText text={inhalt.texte.minZementD16} /></span>
                <span className="text-sm font-bold font-mono text-text-main">
                  &ge; {formatDeWert(currentZone.minCement)} kg/m&sup3;
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block"><MdText text={inhalt.texte.cMinDurEc2} /></span>
                <span className="text-sm font-bold font-mono text-text-main">
                  {formatDeWert(currentZone.cMinDur)} mm
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] text-text-main/60 block"><MdText text={inhalt.texte.nennmaßCNom} /></span>
                <span className="text-sm font-bold font-mono text-emerald-800">
                  {formatDeWert(currentZone.cNom)} mm
                </span>
              </div>
            </div>

            {/* Schädigungsmechanismus & Baustellenpraxis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-amber-800 block"><MdText text={inhalt.texte.kritischerSchädigungsmechanismus} /></span>
                <p className="text-text-main/80 leading-relaxed">{currentZone.mechanism}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-emerald-800 block"><MdText text={inhalt.texte.praxisempfehlungZusatzvorgaben} /></span>
                <p className="text-text-main/80 leading-relaxed">{currentZone.practicalTips}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ANSICHT 2: DETAILZOOM BETONDECKUNG & DEPASSIVIERUNG                 */}
      {/* =================================================================== */}
      {activeMode === 'cover' && (
        <div className="space-y-5">
          {/* Klassen-Umschalter für Betondeckungs-Visualisierung */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-off-white rounded-xl border border-home-grau/20 text-xs">
            <span className="font-bold text-text-main"><MdText text={inhalt.texte.expositionsklasseZurBetondeckungWählen} /></span>
            <div className="flex flex-wrap gap-1.5">
              {(['XC1', 'XC4', 'XD3', 'XS3'] as const).map(cKey => (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => setSelectedCoverClass(cKey)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedCoverClass === cKey
                      ? 'bg-shiraz text-white shadow-xs'
                      : 'bg-white text-text-main border border-home-grau/25 hover:bg-off-white'
                  }`}
                >
                  {cKey} (c_nom = {
                    cKey === 'XC1' ? '25' : cKey === 'XC4' ? '35' : cKey === 'XD3' ? '50' : '55'
                  } mm)
                </button>
              ))}
            </div>
          </div>

          {/* Vektor-Querschnitt Betondeckung SVG */}
          <div className="w-full bg-[#fcf8f2] rounded-2xl border border-home-grau/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 920 370"
              className="w-full h-auto select-none font-sans"
              style={{ maxHeight: '380px' }}
            >
              <defs>
                <pattern id="concretePores" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="5" r="1.2" fill="#64748b" fillOpacity="0.3" />
                  <circle cx="14" cy="12" r="1.8" fill="#64748b" fillOpacity="0.25" />
                  <circle cx="16" cy="4" r="0.8" fill="#64748b" fillOpacity="0.35" />
                  <circle cx="7" cy="16" r="1.4" fill="#64748b" fillOpacity="0.2" />
                </pattern>
                {/* Stahlrippen-Muster */}
                <pattern id="rebarRibs" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#334155" strokeWidth="2.5" />
                </pattern>
              </defs>

              {/* 1. ATMOSPHÄRE LINKS (x < 0) */}
              <rect x="0" y="30" width="160" height="310" fill="#f1f5f9" />
              <text x="80" y="60" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
                Außenluft / Umwelt
              </text>
              <text x="80" y="80" textAnchor="middle" fill="#64748b" fontSize="10">
                CO₂ &bull; H₂O &bull; Cl⁻ &bull; Frost
              </text>

              {/* Pfeile Umweltangriff */}
              <path d="M110,120 L155,120" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="130" y="112" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="bold">CO₂</text>

              <path d="M100,180 L155,180" stroke="#0284c7" strokeWidth="2" />
              <text x="125" y="172" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">Cl⁻</text>

              <path d="M110,240 L155,240" stroke="#0f766e" strokeWidth="2" />
              <text x="130" y="232" textAnchor="middle" fill="#0f766e" fontSize="11" fontWeight="bold">H₂O</text>

              {/* BAUTEILOBERFLÄCHE (x = 0) */}
              <line x1="160" y1="30" x2="160" y2="340" stroke="#1e293b" strokeWidth="3" />
              <text x="160" y="22" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                x = 0 (Oberfläche)
              </text>

              {/* 2. KARBONATISIERTE ZONE (Phenolphthalein farblos: pH < 9.0) */}
              <rect x="160" y="30" width="110" height="310" fill="#e2e8f0" fillOpacity="0.7" />
              <rect x="160" y="30" width="110" height="310" fill="url(#concretePores)" />
              <line x1="270" y1="30" x2="270" y2="340" stroke="#b91c1c" strokeWidth="2" strokeDasharray="5,3" />
              <text x="215" y="60" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="bold">
                Depassiviert
              </text>
              <text x="215" y="76" textAnchor="middle" fill="#991b1b" fontSize="9.5">
                pH &lt; 9,0 (farblos)
              </text>
              <text x="215" y="92" textAnchor="middle" fill="#991b1b" fontSize="9">
                dk(t) = k·&radic;t
              </text>

              {/* 3. ALKALISCHE BETONMATRIX (Phenolphthalein magenta: pH > 12.5) */}
              <rect x="270" y="30" width="620" height="310" fill="#fdf2f8" fillOpacity="0.9" />
              <rect x="270" y="30" width="620" height="310" fill="url(#concretePores)" />
              <text x="370" y="60" fill="#831843" fontSize="12" fontWeight="bold">
                Alkalische Schutzmatrix (pH &approx; 12,5 &ndash; 13,5)
              </text>
              <text x="370" y="78" fill="#9d174d" fontSize="10">
                Stabiler Passivierungsfilm (&gamma;-Fe₂O₃) schützt den Bewehrungsstahl
              </text>

              {/* DYNAMISCHE POSITION DER BEWEHRUNG JE NACH KLASSE */}
              {(() => {
                // Skalierung: 160 mm = x=0.
                // Pro mm Betondeckung nehmen wir ca. 6.5 px im Zoom
                const scalePxPerMm = 6.2;
                const cNomVal = coverDetails.cNom;
                const cMinVal = coverDetails.cMinDur;
                const stirrupOuterX = 160 + cNomVal * scalePxPerMm;
                const stirrupThick = 12; // 10 mm Bügel
                const rebarDiameter = 48; // 20 mm Längsstab
                const rebarCenterX = stirrupOuterX + stirrupThick + rebarDiameter / 2;
                const rebarCenterY = 190;

                return (
                  <g>
                    {/* BÜGEL (Stirrup) */}
                    <rect 
                      x={stirrupOuterX} 
                      y="110" 
                      width={stirrupThick} 
                      height="170" 
                      rx="4"
                      fill="#64748b" 
                      stroke="#1e293b" 
                      strokeWidth="1.5" 
                    />
                    <text x={stirrupOuterX + 6} y="98" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                      Bügel &phi;w
                    </text>

                    {/* LÄNGSBEWEHRUNGSSTAB (Rebar) */}
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2} 
                      fill="#475569" 
                      stroke="#0f172a" 
                      strokeWidth="2" 
                    />
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2 - 1} 
                      fill="url(#rebarRibs)" 
                    />
                    {/* Passivschicht Kontur (grün leuchtend) */}
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2 + 2} 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="4,2" 
                    />

                    <text x={rebarCenterX} y={rebarCenterY + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                      ds = 20
                    </text>
                    <text x={rebarCenterX} y={rebarCenterY + 42} textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                      Passivfilm (&gamma;-Fe₂O₃)
                    </text>

                    {/* MASSKETTEN (DIMENSION LINES) */}
                    {/* 1. c_nom Maßkette ganz unten */}
                    <line x1="160" y1="305" x2={stirrupOuterX} y2="305" stroke="#9b111e" strokeWidth="2" />
                    <line x1="160" y1="295" x2="160" y2="315" stroke="#9b111e" strokeWidth="1.5" />
                    <line x1={stirrupOuterX} y1="295" x2={stirrupOuterX} y2="315" stroke="#9b111e" strokeWidth="1.5" />
                    <text x={(160 + stirrupOuterX) / 2} y="325" textAnchor="middle" fill="#9b111e" fontSize="12" fontWeight="bold">
                      cnom = {formatDeWert(cNomVal)} mm
                    </text>

                    {/* 2. c_min,dur Teilmaßkette */}
                    <line x1="160" y1="270" x2={160 + cMinVal * scalePxPerMm} y2="270" stroke="#0369a1" strokeWidth="1.5" />
                    <line x1="160" y1="264" x2="160" y2="276" stroke="#0369a1" strokeWidth="1.2" />
                    <line x1={160 + cMinVal * scalePxPerMm} y1="264" x2={160 + cMinVal * scalePxPerMm} y2="276" stroke="#0369a1" strokeWidth="1.2" />
                    <text x={(160 + 160 + cMinVal * scalePxPerMm) / 2} y="262" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
                      cmin,dur = {formatDeWert(cMinVal)} mm
                    </text>

                    {/* 3. delta_c_dev Teilmaßkette */}
                    <line x1={160 + cMinVal * scalePxPerMm} y1="270" x2={stirrupOuterX} y2="270" stroke="#d97706" strokeWidth="1.5" />
                    <line x1={stirrupOuterX} y1="264" x2={stirrupOuterX} y2="276" stroke="#d97706" strokeWidth="1.2" />
                    <text x={(160 + cMinVal * scalePxPerMm + stirrupOuterX) / 2} y="262" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                      &Delta;cdev = 10 mm
                    </text>
                  </g>
                );
              })()}

              {/* CHLORID-DIFFUSIONS-GRADIENTENKURVE (GESTICHELT BLAU) */}
              <path 
                d="M160,140 Q250,210 400,240 T700,245" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="2.5" 
                strokeDasharray="6,4" 
              />
              <text x="320" y="195" fill="#0284c7" fontSize="10.5" fontWeight="bold">
                Chloridprofil C(x,t) &ndash; Fick'sches Diffusionsgesetz
              </text>
              <line x1="160" y1="220" x2="600" y2="220" stroke="#0284c7" strokeWidth="1" strokeDasharray="2,2" />
              <text x="470" y="215" fill="#0284c7" fontSize="9">
                Kritischer Grenzwert Ccrit &approx; 0,40–0,50 M.-% bez. auf Zement
              </text>
            </svg>
          </div>

          {/* FORMEL- & BEMESSUNGSLEITFADEN BETONDECKUNG */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <ShieldCheck className="text-shiraz" size={18} /><MdText text={inhalt.texte.normativeBemessungDerBetondeckung} /></h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.t1NennmaßGleichung} /></span>
                <div className="text-center py-1 font-mono text-shiraz font-bold"><MdText text={inhalt.texte.cnomCminCdev} /></div>
                <p className="text-text-main/70"><MdText text={inhalt.texte.cMinMaxC} /></p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.t2Karbonatisierungsfortschritt} /></span>
                <div className="text-center py-1 font-mono text-amber-800 font-bold"><MdText text={inhalt.texte.dkTKcarbT} /></div>
                <p className="text-text-main/70"><MdText text={inhalt.texte.erreichtDieKarbonatisierungsfrontDen} /></p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.t3ChloridLochfraß} /></span>
                <div className="text-center py-1 font-mono text-cyan-800 font-bold">
                  Ccrit &approx; 0,40 &ndash; 0,50 M.-%
                </div>
                <p className="text-text-main/70"><MdText text={inhalt.texte.chlorideInitiierenLochfraßkorrosionLokal} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
