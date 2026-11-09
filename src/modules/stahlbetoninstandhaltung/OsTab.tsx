// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Layers, CheckCircle2 } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { osSysteme } from './daten';
import inhalt from '@/content/stahlbetoninstandhaltung/OsTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function OsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-shiraz flex items-center gap-2">
          <Layers size={20} /><MdText text={inhalt.texte.oberflächenschutzsystemeOsSysteme} /></h3>
        <p className="text-text-main mt-2 text-sm">
          <FormulaText text={inhalt.werte.osSystemeDienenDem} />
        </p>
      </div>

      {/* Schematische Darstellung OS */}
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungAufbauVon} /></h3>
        <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
          <svg role="img" aria-label="Schematische Darstellung: Aufbau von OS-Systemen" width="100%" height="200" viewBox="0 0 600 200">
            <defs>
              <pattern id="concrete-os" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
                <circle cx="14" cy="12" r="2" fill="#cbd5e1" />
                <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
              </pattern>
            </defs>

            {/* Betonuntergrund */}
            <rect x="50" y="120" width="500" height="60" fill="url(#concrete-os)" stroke="#64748b" strokeWidth="2" />
            <text x="300" y="155" fontSize="14" fill="#475569" textAnchor="middle" fontWeight="bold">Betonuntergrund</text>

            {/* OS 1 (Hydrophobierung) */}
            <g transform="translate(80, 0)">
              <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 1</text>
              <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Hydrophobierung</text>
              {/* Eindringtiefe */}
              <rect x="0" y="120" width="80" height="15" fill="#475569" opacity="0.3" />
              <path d="M 0 120 Q 40 135 80 120" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="2 2" />
              <text x="40" y="110" fontSize="10" fill="#475569" textAnchor="middle">Zieht ein</text>
            </g>

            {/* OS 4 (Beschichtung) */}
            <g transform="translate(220, 0)">
              <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 4</text>
              <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Beschichtung</text>
              {/* Beschichtung */}
              <rect x="0" y="110" width="80" height="10" fill="#64748b" />
              <text x="40" y="100" fontSize="10" fill="#475569" textAnchor="middle">Dünnschichtig</text>
            </g>

            {/* OS 8 (Starr, befahrbar) */}
            <g transform="translate(360, 0)">
              <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 8</text>
              <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Starr, befahrbar</text>
              {/* Grundierung */}
              <rect x="0" y="115" width="80" height="5" fill="#94a3b8" />
              {/* Nutzschicht */}
              <rect x="0" y="95" width="80" height="20" fill="#475569" />
              <text x="40" y="85" fontSize="10" fill="#475569" textAnchor="middle">Dickschichtig</text>
            </g>

            {/* OS 11 (Rissüberbrückend, befahrbar) */}
            <g transform="translate(500, 0)">
              <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 11</text>
              <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Rissüberbrückend</text>
              {/* Grundierung */}
              <rect x="0" y="115" width="80" height="5" fill="#94a3b8" />
              {/* Dichtungsschicht (elastisch) */}
              <rect x="0" y="105" width="80" height="10" fill="#475569" />
              {/* Nutzschicht */}
              <rect x="0" y="90" width="80" height="15" fill="#475569" />
              <text x="40" y="80" fontSize="10" fill="#475569" textAnchor="middle">Elastisch + Starr</text>
            </g>
          </svg>
          <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.unterschiedlicheOsSystemeHydrophobierung} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-off-white border-b border-home-grau/30">
              <tr>
                <th className="p-4 font-semibold text-text-main">OS-System</th>
                <th className="p-4 font-semibold text-text-main">Altbezeichnung</th>
                <th className="p-4 font-semibold text-text-main">Art</th>
                <th className="p-4 font-semibold text-text-main">Anwendungsbereich</th>
                <th className="p-4 font-semibold text-text-main">Rissüberbrückend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-home-grau/10">
              {osSysteme.map((os, idx) => (
                <tr key={idx} className="hover:bg-off-white/50 transition-colors">
                  <td className="p-4 font-bold text-shiraz whitespace-nowrap">{os.id}</td>
                  <td className="p-4 text-home-grau whitespace-nowrap">{os.old}</td>
                  <td className="p-4 font-medium text-text-main">{os.name}</td>
                  <td className="p-4 text-home-grau">{os.use}</td>
                  <td className="p-4">
                    {os.crackBridging.startsWith('Ja') ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-semibold">
                        <CheckCircle2 size={14} />
                        {os.crackBridging}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-home-grau bg-home-grau/10 px-2 py-1 rounded-md text-xs font-semibold">
                        {os.crackBridging}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
