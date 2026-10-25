// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Sparkles } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';
import type { ConcreteClassData } from './daten';

export interface Ausblick2025TabProps {
  baseConcrete: ConcreteClassData;
  calcResults: { fck: number; fcm: number; fcd: number; s: number; betaCcT0: number; fcmT0: number; fckT0: number; betaCcT: number; fcmT: number; fckT: number; fctm: number; fctk005: number; fctk095: number; fctd: number; fctmFl: number; fctSp: number; fctmT: number; alphaE: number; Ecm: number; Ec0: number; EcmT0: number; EcmT: number; Gcm: number; epsC1: number; epsCu1: number; kPlastizitaet: number; epsC2: number; epsCu2: number; exponentN: number; h0: number; kh: number; epsCd0: number; epsCd: number; epsCa: number; epsCs: number; deltaLShrinkMm: number; phi0: number; phiLinear: number; phiFinal: number; isNonlinearCreep: boolean; stressLimitLin: number; stressLimitMax: number; kSigma: number; epsCc: number; deltaLCreepMm: number; EcEff: number; EcEffZwang: number; Ecm2025: number; etaFc2025: number; };
}

export default function Ausblick2025Tab({ baseConcrete, calcResults }: Ausblick2025TabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-home-grau/20">
          <Sparkles size={20} className="text-shiraz" />
          <h3 className="font-bold text-slate-900 text-base">
            Abschnitt 8: Wesentliche Neuerungen in Eurocode 2 der 2. Generation (DIN EN 1992-1-1:2025-09)
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          In der 2. Generation des Eurocode 2 (Abschnitt 5.1 &amp; Anhang B) wurden zentrale Formulierungen für hochfeste Betone, alternative Bindemittel und Klinkerersatzstoffe präzisiert:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
            <strong className="block text-slate-900 font-bold text-sm">1. Neuer E-Modul-Ansatz</strong>
            <p className="text-slate-600 leading-relaxed">
              Die Gleichung basiert nun auf der 3. Wurzel der mittleren Druckfestigkeit:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono">
              <InlineMath math="E_{cm} = k_E \cdot f_{cm}^{1/3}" />
            </div>
            <p className="text-slate-500 text-[11px]">
              Mit dem Gesteinsbeiwert <InlineMath math="k_E = 9500" /> für Quarzit. Aktueller Rechnerwert für {baseConcrete.name}: <strong>{formatDeZahl(calcResults.Ecm2025, 0)} MPa</strong> (vs. {formatDeZahl(calcResults.Ecm, 0)} MPa im EC2 1. Gen).
            </p>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
            <strong className="block text-slate-900 font-bold text-sm">2. Kontinuierlicher Sprödigkeitsfaktor</strong>
            <p className="text-slate-600 leading-relaxed">
              Anstelle des sprunghaften Einsetzens ab C55/67 wird der stetige Faktor eingeführt:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono">
              <InlineMath math="\eta_{fc} = \left(\frac{40}{f_{ck}}\right)^{1/3} \le 1{,}0" />
            </div>
            <p className="text-slate-500 text-[11px]">
              Aktueller Wert für {baseConcrete.name}: <strong>{formatDeZahl(calcResults.etaFc2025, 3)}</strong>.
            </p>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
            <strong className="block text-slate-900 font-bold text-sm">3. Konsistente Kriech-/Schwindteilung</strong>
            <p className="text-slate-600 leading-relaxed">
              Einheitliche Aufspaltung in Grund- und Trocknungskomponenten:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono space-y-1">
              <div><InlineMath math="\varepsilon_{cs} = \varepsilon_{cbs} + \varepsilon_{cds}" /></div>
              <div><InlineMath math="\varphi = \varphi_{bc} + \varphi_{dc}" /></div>
            </div>
            <p className="text-slate-500 text-[11px]">
              Bessere Modellierung von CEM II/III-Betonen und Flugasche/Silica-Zusätzen.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
