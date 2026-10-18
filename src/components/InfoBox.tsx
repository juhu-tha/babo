import React from 'react';
import { BookOpen } from 'lucide-react';

interface InfoBoxProps {
  title?: string;
  norms: string[];
  formulas: { label: string; formula: string; parameters: string[] }[];
  literature?: string[];
}

export const InfoBox: React.FC<InfoBoxProps> = ({ title = "Normen & Berechnungsgrundlagen", norms, formulas, literature }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 mt-8">
      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-shiraz" /> {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-text-main mb-2">Normen & Richtlinien</h4>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1 mb-4">
            {norms.map((norm, idx) => (
              <li key={idx}>{norm}</li>
            ))}
          </ul>

          {literature && literature.length > 0 && (
            <>
              <h4 className="font-semibold text-text-main mb-2">Literatur</h4>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
                {literature.map((lit, idx) => (
                  <li key={idx}>{lit}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-text-main mb-2">Formeln & Parameter</h4>
          <div className="space-y-4">
            {formulas.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-home-grau/20">
                <div className="text-sm font-bold text-text-main mb-1">{item.label}</div>
                <div className="font-mono text-sm bg-off-white p-2 rounded mb-2 text-center">
                  {item.formula}
                </div>
                <div className="text-xs text-text-main/70 space-y-1">
                  {item.parameters.map((param, pIdx) => (
                    <div key={pIdx}>{param}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
