// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Info } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { riliSibPrinzipien } from './daten';
import inhalt from '@/content/stahlbetoninstandhaltung/TrTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function TrTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-blue-500 border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <Info size={20} /><MdText text={inhalt.texte.technischeRegelInstandhaltungVon} /></h3>
        <p className="text-blue-900 mt-2 text-sm">
          <FormulaText text={inhalt.werte.dieTechnischeRegelInstandhaltung} />
        </p>
      </div>

      {/* Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center">
        <h3 className="text-sm font-bold text-text-main mb-6 self-start"><MdText text={inhalt.texte.historischInstandsetzungsprinzipienDerDa} /></h3>
        <svg width="100%" height="250" viewBox="0 0 800 250" className="max-w-3xl">
          <defs>
            <pattern id="concrete-tr" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
              <circle cx="14" cy="12" r="2" fill="#cbd5e1" />
              <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
            </pattern>
            <pattern id="carbonated" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="#f7ced6" strokeWidth="1" opacity="0.5" />
            </pattern>
            <pattern id="reprofiled" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 0 L 10 10 M -1 9 L 1 11 M 9 -1 L 11 1" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
            </pattern>
          </defs>

          {/* Base Concrete */}
          <rect x="50" y="50" width="700" height="150" fill="url(#concrete-tr)" stroke="#475569" strokeWidth="2" />
          
          {/* Rebar */}
          <line x1="50" y1="150" x2="750" y2="150" stroke="#1e293b" strokeWidth="12" />
          
          {/* Principle W: Water restriction */}
          <g transform="translate(100, 0)">
            <rect x="0" y="45" width="120" height="5" fill="#475569" />
            <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#475569" strokeWidth="2" fill="none" />
            <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">W</text>
            <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#475569">Trocken</text>
            {/* Carbonation front */}
            <rect x="0" y="50" width="120" height="110" fill="url(#carbonated)" />
            <line x1="0" y1="160" x2="120" y2="160" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* Principle C: Carbonation restriction */}
          <g transform="translate(260, 0)">
            <rect x="0" y="45" width="120" height="5" fill="#A3113E" />
            <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#A3113E" strokeWidth="2" fill="none" />
            <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#A3113E">C</text>
            <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#475569">CO₂-dicht</text>
            {/* Carbonation front stopped */}
            <rect x="0" y="50" width="120" height="80" fill="url(#carbonated)" />
            <line x1="0" y1="130" x2="120" y2="130" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* Principle R: Reprofiling */}
          <g transform="translate(420, 0)">
            <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#475569" strokeWidth="2" fill="none" />
            <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">R</text>
            {/* Reprofiled area */}
            <rect x="0" y="50" width="120" height="120" fill="url(#reprofiled)" />
            <rect x="0" y="50" width="120" height="120" fill="rgba(252, 211, 77, 0.2)" />
            <text x="60" y="110" textAnchor="middle" fontSize="10" fill="#334155">Alkalisch</text>
          </g>

          {/* Principle K: Cathodic Protection */}
          <g transform="translate(580, 0)">
            <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#334155" strokeWidth="2" fill="none" />
            <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">K</text>
            {/* Anode */}
            <rect x="20" y="60" width="80" height="10" fill="#475569" />
            {/* Current flow */}
            <path d="M 60 70 L 60 140 M 55 135 L 60 140 L 65 135" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" fill="none" />
            <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#334155">Schutzstrom</text>
            {/* Carbonation front */}
            <rect x="0" y="50" width="120" height="110" fill="url(#carbonated)" />
            <line x1="0" y1="160" x2="120" y2="160" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* Legend */}
          <g transform="translate(50, 220)">
            <rect x="0" y="0" width="15" height="15" fill="url(#carbonated)" />
            <text x="20" y="12" fontSize="12" fill="#475569">Carbonatisiert</text>
            
            <line x1="120" y1="7" x2="140" y2="7" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
            <text x="145" y="12" fontSize="12" fill="#475569">Carbonatisierungsfront</text>
            
            <rect x="300" y="0" width="15" height="15" fill="url(#reprofiled)" />
            <rect x="300" y="0" width="15" height="15" fill="rgba(252, 211, 77, 0.2)" />
            <text x="320" y="12" fontSize="12" fill="#475569">Reprofiliert (PCC)</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riliSibPrinzipien.map((prinzip) => (
          <div key={prinzip.id} className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-off-white rounded-lg">
                {prinzip.icon}
              </div>
              <h3 className="text-lg font-bold text-text-main">{prinzip.title}</h3>
            </div>
            <p className="text-text-main font-medium mb-3"><FormulaText text={prinzip.desc} /></p>
            <p className="text-sm text-home-grau leading-relaxed"><FormulaText text={prinzip.details} /></p>
          </div>
        ))}
      </div>
    </div>
  );
}
