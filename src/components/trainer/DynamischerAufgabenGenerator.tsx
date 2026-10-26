import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Calculator, RotateCcw, CheckCircle2, XCircle, AlertTriangle, 
  Lightbulb, Sparkles, BookOpen, 
  HelpCircle, Trophy
} from 'lucide-react';
import { BlockMath } from 'react-katex';

interface GeneratorTask {
  id: string;
  category: string;
  title: string;
  difficulty: 'Basis' | 'Mittel' | 'Fortgeschritten'; // Trainer-eigene Stufen (nicht Quizpool)
  generate: () => {
    params: Record<string, number | string>;
    questionText: string;
    correctAnswer: number;
    unit: string;
    tolerancePercent: number;
    hints: string[];
    commonMistakes: { check: (val: number) => boolean; message: string }[];
    solutionSteps: { step: string; math: string; explanation: string }[];
  };
}

const GENERATOR_TASKS: GeneratorTask[] = [
  // 1. Spaltzugfestigkeit (Beton / Labor)
  {
    id: 'spaltzug',
    category: 'Labor & Betonprüfung',
    title: 'Spaltzugfestigkeit & axiale Zugfestigkeit',
    difficulty: 'Basis',
    generate: () => {
      const d = 150; // mm
      const L = 300; // mm
      const F_kN = Math.floor(Math.random() * 160) + 140; // 140 to 300 kN
      const F_N = F_kN * 1000;
      const f_ct_sp = (2 * F_N) / (Math.PI * L * d);
      const f_ctm = 0.9 * f_ct_sp;

      return {
        params: { d, L, F_kN },
        questionText: `An einem zylindrischen Betonprüfkörper (d = ${d} mm, L = ${L} mm) wird im Spaltzugversuch nach DIN EN 12390-6 eine Höchstlast von F = ${formatDeWert(F_kN)} kN gemessen. Berechnen Sie die axiale Betonzugfestigkeit f_ctm unter Ansatz des normativen Umrechnungsbeiwertes f_ctm ≈ 0,90 · f_ct,sp.`,
        correctAnswer: Number(f_ctm.toFixed(2)),
        unit: 'N/mm² (MPa)',
        tolerancePercent: 3,
        hints: [
          'Formel für die Spaltzugfestigkeit: f_ct,sp = (2 · F) / (π · L · d)',
          'Achten Sie darauf, die Kraft F vor dem Einsetzen von kN in Newton (N) umzurechnen!',
          'Der axiale Schätzwert ergibt sich durch Multiplikation mit dem Faktor 0,90.'
        ],
        commonMistakes: [
          {
            check: (val) => Math.abs(val - f_ct_sp) < 0.1,
            message: 'Achtung: Sie haben die reine Spaltzugfestigkeit f_ct,sp berechnet, aber den geforderten Faktor 0,90 für die axiale Zugfestigkeit f_ctm vergessen!'
          },
          {
            check: (val) => Math.abs(val - f_ctm * 1000) < 50 || Math.abs(val - f_ctm / 1000) < 0.005,
            message: 'Einheitenfehler: Sie haben vermutlich kN nicht in N oder mm nicht konsistent umgerechnet.'
          }
        ],
        solutionSteps: [
          {
            step: '1. Umrechnung der Höchstkraft in Newton',
            math: `F = ${formatDeTeXWert(F_kN)}\\text{ kN} = ${F_N.toLocaleString('de-DE')}\\text{ N}`,
            explanation: 'Für Spannungen in N/mm² muss die Prüflast in Newton eingesetzt werden.'
          },
          {
            step: '2. Berechnung der Spaltzugfestigkeit f_ct,sp',
            math: `f_{\\text{ct,sp}} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d} = \\frac{2 \\cdot ${F_N}}{\\pi \\cdot ${L} \\cdot ${d}} = ${formatDeTeX(f_ct_sp, 3)}\\text{ N/mm}^2`,
            explanation: 'Zweidimensionale elastizitätstheoretische Lösung nach Hertz für Linienlast auf Walze.'
          },
          {
            step: '3. Umrechnung auf axiale Betonzugfestigkeit f_ctm',
            math: `f_{\\text{ctm}} \\approx 0{,}90 \\cdot f_{\\text{ct,sp}} = 0{,}90 \\cdot ${formatDeTeX(f_ct_sp, 3)} = \\mathbf{${formatDeTeX(f_ctm, 2)}}\\text{ N/mm}^2`,
            explanation: 'DIN EN 1992-1-1 (EC2) Abs. 3.1.2 legt f_ctm ≈ 0,9 · f_ct,sp fest.'
          }
        ]
      };
    }
  },

  // 2. Knicklast nach Euler (Mechanik / Stahlbau)
  {
    id: 'euler_knicken',
    category: 'Mechanik & Stabilität',
    title: 'Kritische Knicklast nach Euler (Fall 2)',
    difficulty: 'Mittel',
    generate: () => {
      const eulerFall = 2; // Beidseitig gelenkig -> beta = 1.0
      const L_m = Number((Math.random() * 3.5 + 3.0).toFixed(1)); // 3.0 to 6.5 m
      const L_mm = L_m * 1000;
      const I_cm4 = Math.floor(Math.random() * 800) + 400; // 400 to 1200 cm4
      const I_mm4 = I_cm4 * 10000;
      const E_MPa = 210000; // N/mm2 für Stahl

      const F_K_N = (Math.PI * Math.PI * E_MPa * I_mm4) / (L_mm * L_mm);
      const F_K_kN = F_K_N / 1000;

      return {
        params: { L_m, I_cm4, E_MPa },
        questionText: `Eine beidseitig gelenkig gelagerte Stahlstütze (Euler-Fall 2, Knicklängenbeiwert β = 1,0) hat eine Länge von L = ${formatDeWert(L_m)} m. Das minimale Flächenträgheitsmoment des Profils beträgt I_z = ${I_cm4} cm⁴, der Elastizitätsmodul ist E = ${formatDeWert(E_MPa)} N/mm². Berechnen Sie die ideale Knicklast F_K in kN.`,
        correctAnswer: Number(F_K_kN.toFixed(1)),
        unit: 'kN',
        tolerancePercent: 3,
        hints: [
          'Euler-Formel: F_K = (π² · E · I) / l_k²',
          'Achtung bei der Einheitenumrechnung: 1 cm⁴ = 10.000 mm⁴ = 10⁴ mm⁴!',
          'Rechnen Sie die Länge L von Metern in Millimeter um (1 m = 1.000 mm).'
        ],
        commonMistakes: [
          {
            check: (val) => Math.abs(val - F_K_kN / 10) < 5 || Math.abs(val - F_K_kN * 10) < 50,
            message: 'Typischer Fehler bei der cm⁴-Umrechnung: 1 cm⁴ entspricht 10.000 mm⁴ (nicht 100 oder 1.000!).'
          },
          {
            check: (val) => Math.abs(val - F_K_N) < 500,
            message: 'Sie haben das Ergebnis in Newton (N) angegeben. Gefragt war das Ergebnis in Kilonewton (kN).'
          }
        ],
        solutionSteps: [
          {
            step: '1. Einheiten angleichen',
            math: `l_k = 1{,}0 \\cdot ${formatDeTeXWert(L_m)}\\text{ m} = ${L_mm.toLocaleString('de-DE')}\\text{ mm}, \\quad I = ${formatDeTeXWert(I_cm4)}\\text{ cm}^4 = ${I_mm4.toLocaleString('de-DE')}\\text{ mm}^4`,
            explanation: 'Konsistente Einheitenbasis in Newton und Millimeter.'
          },
          {
            step: '2. Einsetzen in die Euler-Formel',
            math: `F_K = \\frac{\\pi^2 \\cdot E \\cdot I}{l_k^2} = \\frac{\\pi^2 \\cdot 210000 \\cdot ${I_mm4.toLocaleString('de-DE')}}{(${L_mm.toLocaleString('de-DE')})^2}`,
            explanation: 'Ideale Verzweigungslast ohne Berücksichtigung geometrischer Imperfektionen.'
          },
          {
            step: '3. Umrechnung in kN',
            math: `F_K = ${formatDeTeX(F_K_N, 0)}\\text{ N} = \\mathbf{${formatDeTeX(F_K_kN, 1)}}\\text{ kN}`,
            explanation: 'Division durch 1.000 liefert die Knicklast in Kilonewton.'
          }
        ]
      };
    }
  },

  // 3. Kriechdehnung nach Eurocode 2 (Massivbau)
  {
    id: 'kriechen_ec2',
    category: 'Massivbau & Eurocode 2',
    title: 'Kriechdehnung unter Dauerlast',
    difficulty: 'Mittel',
    generate: () => {
      const fck = 30; // C30/37
      const Ecm = 33000; // MPa
      const sigma_c = Number((Math.random() * 3 + 7).toFixed(1)); // 7.0 to 10.0 MPa
      const phi = Number((Math.random() * 0.8 + 2.1).toFixed(2)); // 2.10 to 2.90

      const eps_el = sigma_c / Ecm; // elastische Dehnung (-)
      const eps_cr = eps_el * phi; // Kriechdehnung (-)
      const eps_cr_promille = eps_cr * 1000; // in Promille (‰)

      return {
        params: { sigma_c, phi, Ecm },
        questionText: `Eine Betonstütze aus Normalbeton C30/37 (E_cm = 33.000 MPa) steht unter einer zentrischen Dauerlastspannung von σ_c = ${formatDeWert(sigma_c)} MPa. Die berechnete Endkriechzahl nach DIN EN 1992-1-1 beträgt φ(∞, t₀) = ${formatDeWert(phi)}. Berechnen Sie die reine Kriechdehnung ε_cr in Promille (‰).`,
        correctAnswer: Number(eps_cr_promille.toFixed(3)),
        unit: '‰ (Promille)',
        tolerancePercent: 3,
        hints: [
          'Elastische Anfangsdehnung: ε_el = σ_c / E_cm',
          'Kriechdehnung: ε_cr = ε_el · φ(t, t₀)',
          'Um von der dimensionslosen Dehnung auf Promille (‰) zu kommen, multiplizieren Sie mit 1.000.'
        ],
        commonMistakes: [
          {
            check: (val) => Math.abs(val - (eps_el + eps_cr) * 1000) < 0.05,
            message: 'Sie haben die Gesamtdehnung (ε_el + ε_cr) berechnet. Gefragt war jedoch ausschließlich die zeitabhängige Kriechdehnung ε_cr!'
          },
          {
            check: (val) => Math.abs(val - eps_cr) < 0.0001,
            message: 'Sie haben das Ergebnis dimensionslos angegeben. Gefragt war die Dehnung in Promille (‰), also Faktor 1.000!'
          }
        ],
        solutionSteps: [
          {
            step: '1. Elastische Anfangsdehnung ε_el',
            math: `\\varepsilon_{\\text{el}} = \\frac{\\sigma_c}{E_{\\text{cm}}} = \\frac{${formatDeTeXWert(sigma_c)}\\text{ MPa}}{33000\\text{ MPa}} = ${formatDeTeX((eps_el * 1000), 4)}\\,\\char8240`,
            explanation: 'Hookesches Gesetz für den elastischen Anteil zum Belastungszeitpunkt t₀.'
          },
          {
            step: '2. Zeitabhängige Kriechdehnung ε_cr',
            math: `\\varepsilon_{\\text{cr}} = \\varepsilon_{\\text{el}} \\cdot \\varphi = ${formatDeTeX((eps_el * 1000), 4)}\\,\\char8240 \\cdot ${formatDeTeXWert(phi)} = \\mathbf{${formatDeTeX(eps_cr_promille, 3)}}\\,\\char8240`,
            explanation: 'Multiplikation der elastischen Dehnung mit der Kriechzahl. DIN EN 1992-1-1, 3.1.4(3), bezieht auf E_c = 1,05 · E_cm; hier vereinfachend E_cm (Lehrannahme).'
          }
        ]
      };
    }
  },

  // 4. Äquivalenter Wasserzementwert (w/z)eq (Betontechnologie)
  {
    id: 'wz_aequivalent',
    category: 'Betontechnologie',
    title: 'Äquivalenter Wasserzementwert mit Flugasche',
    difficulty: 'Basis',
    generate: () => {
      const zement = 320; // kg/m3
      const wasser = 168; // kg/m3
      const flugasche = Math.floor(Math.random() * 30) + 50; // 50 to 80 kg/m3
      const k = 0.40; // k-Wert Flugasche nach DIN EN 206

      const wz_eq = wasser / (zement + k * flugasche);

      return {
        params: { zement, wasser, flugasche, k },
        questionText: `Für einen Außenbauteilbeton (Expositionsklasse XC4) werden pro m³ Beton z = ${zement} kg Zement (CEM I), w = ${wasser} kg wirksames Wasser und f = ${flugasche} kg Steinkohlenflugasche dosiert. Der normative k-Wert-Anrechenbarkeitsfaktor für Flugasche beträgt k = ${formatDeZahl(k, 2)}. Berechnen Sie den äquivalenten Wasserzementwert (w/z)_eq.`,
        correctAnswer: Number(wz_eq.toFixed(2)),
        unit: '[-]',
        tolerancePercent: 2,
        hints: [
          'Formel: (w/z)_eq = w / (z + k · f)',
          'Flugasche darf nach DIN EN 206 / DIN 1045-2 mit dem k-Wert 0,40 auf den Zementgehalt angerechnet werden.'
        ],
        commonMistakes: [
          {
            check: (val) => Math.abs(val - wasser / (zement + flugasche)) < 0.02,
            message: 'Sie haben die Flugasche zu 100% angerechnet (k = 1,0). Nach DIN EN 206 darf Flugasche jedoch nur mit k = 0,40 angesetzt werden!'
          },
          {
            check: (val) => Math.abs(val - wasser / zement) < 0.02,
            message: 'Sie haben den reinen w/z-Wert ohne Flugasche berechnet. Gefragt war der äquivalente (w/z)_eq-Wert!'
          }
        ],
        solutionSteps: [
          {
            step: '1. Effektiver Zementwert (Bindemitteläquivalent)',
            math: `z_{\\text{eq}} = z + k \\cdot f = ${zement} + 0{,}40 \\cdot ${flugasche} = ${formatDeTeX((zement + k * flugasche), 1)}\\text{ kg/m}^3`,
            explanation: 'Anrechnung der Puzzolanität der Steinkohlenflugasche nach DIN 1045-2 / DIN EN 206.'
          },
          {
            step: '2. Berechnung des (w/z)_eq-Wertes',
            math: `(w/z)_{\\text{eq}} = \\frac{w}{z + k \\cdot f} = \\frac{${wasser}}{${formatDeTeX((zement + k * flugasche), 1)}} = \\mathbf{${formatDeTeX(wz_eq, 2)}}`,
            explanation: 'Vergleich mit dem Grenzwert für XC4 nach DIN 1045-2 (höchstzulässiger (w/z)_eq = 0,60); die anrechenbare Flugaschemenge ist begrenzt (f ≤ 0,33 · z bei CEM I).'
          }
        ]
      };
    }
  },

  // 5. U-Wert-Berechnung (Bauphysik / GModG)
  {
    id: 'u_wert_wand',
    category: 'Bauphysik & Wärmeschutz',
    title: 'Wärmedurchgangskoeffizient (U-Wert) einer Außenwand',
    difficulty: 'Mittel',
    generate: () => {
      const d_daemmung_cm = Math.floor(Math.random() * 6) + 12; // 12 to 18 cm
      const d_daemm_m = d_daemmung_cm / 100;
      const lambda_daemm = 0.035; // W/mK

      const d_ziegel_m = 0.24; // 24 cm Ziegel
      const lambda_ziegel = 0.36; // W/mK

      const R_si = 0.13;
      const R_se = 0.04;

      const R_ziegel = d_ziegel_m / lambda_ziegel;
      const R_daemm = d_daemm_m / lambda_daemm;
      const R_T = R_si + R_ziegel + R_daemm + R_se;
      const U_wert = 1 / R_T;

      return {
        params: { d_daemmung_cm, lambda_daemm, d_ziegel_m, lambda_ziegel },
        questionText: `Eine Außenwand besteht aus 24 cm Hochlochziegelmauerwerk (λ = 0,36 W/(m·K)) und einer außenliegenden Mineralwolledämmung (WDVS) der Dicke d = ${formatDeWert(d_daemmung_cm)} cm (λ = ${formatDeWert(lambda_daemm)} W/(m·K)). Die Wärmeübergangswiderstände betragen R_si = 0,13 m²·K/W und R_se = 0,04 m²·K/W. Putzschichten werden vernachlässigt. Berechnen Sie den Wärmedurchgangskoeffizienten U in W/(m²·K).`,
        correctAnswer: Number(U_wert.toFixed(2)),
        unit: 'W/(m²·K)',
        tolerancePercent: 3,
        hints: [
          'Wärmedurchlasswiderstand einzelner Schichten: R_i = d_i / λ_i (Dicke in Metern einsetzen!)',
          'Gesamtwiderstand: R_T = R_si + ∑ R_i + R_se',
          'U-Wert: U = 1 / R_T'
        ],
        commonMistakes: [
          {
            check: (val) => Math.abs(val - 1 / (R_ziegel + R_daemm)) < 0.05,
            message: 'Sie haben die Wärmeübergangswiderstände R_si und R_se an Innen- und Außenseite vergessen!'
          },
          {
            check: (val) => Math.abs(val - R_T) < 0.1,
            message: 'Sie haben den Wärmedurchgangswiderstand R_T angegeben, nicht den Kehrwert (U = 1 / R_T)!'
          }
        ],
        solutionSteps: [
          {
            step: '1. Wärmedurchlasswiderstände der Baustoffschichten',
            math: `R_{\\text{Ziegel}} = \\frac{0{,}24}{0{,}36} = ${formatDeTeX(R_ziegel, 3)}\\text{ m}^2\\text{K/W}, \\quad R_{\\text{Dämm}} = \\frac{${formatDeTeXWert(d_daemm_m)}}{${formatDeTeXWert(lambda_daemm)}} = ${formatDeTeX(R_daemm, 3)}\\text{ m}^2\\text{K/W}`,
            explanation: 'Dicken in Meter umrechnen (12 cm = 0,12 m).'
          },
          {
            step: '2. Gesamter Wärmedurchgangswiderstand R_T',
            math: `R_T = 0{,}13 + ${formatDeTeX(R_ziegel, 3)} + ${formatDeTeX(R_daemm, 3)} + 0{,}04 = ${formatDeTeX(R_T, 3)}\\text{ m}^2\\text{K/W}`,
            explanation: 'Addition von innerem Übergangswiderstand R_si, Schichten und R_se.'
          },
          {
            step: '3. Kehrwertbildung zum U-Wert',
            math: `U = \\frac{1}{R_T} = \\frac{1}{${formatDeTeX(R_T, 3)}} = \\mathbf{${formatDeTeX(U_wert, 2)}}\\text{ W/(m}^2\\text{K)}`,
            explanation: 'Vergleich: Höchstwert für Außenwände bei Änderungen im Bestand nach GEG/GModG, Anlage 7: 0,24 W/(m²K).'
          }
        ]
      };
    }
  }
];

export function DynamischerAufgabenGenerator() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('spaltzug');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [inputError, setInputError] = useState<string | null>(null);

  // Active generator task
  const currentTaskDef = useMemo(() => {
    return GENERATOR_TASKS.find(t => t.id === selectedTaskId) || GENERATOR_TASKS[0];
  }, [selectedTaskId]);

  // Current generated instance
  const [taskInstance, setTaskInstance] = useState(() => currentTaskDef.generate());

  // Reroll values when task changes or user clicks reroll
  const handleReroll = (taskId = selectedTaskId) => {
    const taskDef = GENERATOR_TASKS.find(t => t.id === taskId) || GENERATOR_TASKS[0];
    setTaskInstance(taskDef.generate());
    setUserAnswer('');
    setIsSubmitted(false);
    setShowSolution(false);
    setInputError(null);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    handleReroll(taskId);
  };

  // Evaluation
  const parsedUserVal = useMemo(() => {
    // Deutsche Zahleneingabe: Tausenderpunkte nur im Muster d.ddd entfernen, Komma → Punkt
    let clean = userAnswer.trim().replace(/\s+/g, '').replace(/^\u2212/, '-');
    if (!clean) return NaN;
    if (/^[-+]?\d{1,3}(\.\d{3})+(,\d*)?$/.test(clean)) clean = clean.replace(/\./g, '');
    if ((clean.match(/,/g) ?? []).length > 1 || (clean.includes(',') && clean.includes('.'))) return NaN;
    clean = clean.replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(clean)) return NaN;
    return Number(clean);
  }, [userAnswer]);

  const evaluationResult = useMemo(() => {
    if (isNaN(parsedUserVal) || !isSubmitted) return null;

    const diff = Math.abs(parsedUserVal - taskInstance.correctAnswer);
    const maxAllowedDiff = Math.abs(taskInstance.correctAnswer) * (taskInstance.tolerancePercent / 100);
    const isCorrect = diff <= maxAllowedDiff;

    // Check common mistakes if wrong
    let mistakeNote = '';
    if (!isCorrect) {
      for (const cm of taskInstance.commonMistakes) {
        if (cm.check(parsedUserVal)) {
          mistakeNote = cm.message;
          break;
        }
      }
    }

    return {
      isCorrect,
      diff,
      mistakeNote
    };
  }, [parsedUserVal, isSubmitted, taskInstance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isNaN(parsedUserVal)) {
      setInputError('Bitte geben Sie einen gültigen Zahlenwert ein.');
      return;
    }

    setInputError(null);
    setIsSubmitted(true);

    const diff = Math.abs(parsedUserVal - taskInstance.correctAnswer);
    const maxAllowedDiff = Math.abs(taskInstance.correctAnswer) * (taskInstance.tolerancePercent / 100);
    const correct = diff <= maxAllowedDiff;

    if (correct) {
      setStreak(prev => prev + 1);
      setTotalSolved(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header & Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-3 py-1 rounded-full inline-block mb-1">
            Zufalls-Rechenaufgaben
          </span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Calculator className="text-shiraz" size={22} />
            Dynamischer Aufgaben- &amp; Klausur-Trainer
          </h2>
          <p className="text-xs text-text-main/70 mt-1">
            Generiert beliebig viele Rechenaufgaben mit randomisierten Werten, Echtzeit-Validierung, 
            Fehler-Diagnose und vollständigem Schritt-für-Schritt-Lösungsweg.
          </p>
        </div>

        {/* Score & Streak Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-off-white px-3.5 py-2 rounded-xl border border-home-grau/30">
            <Trophy size={16} className="text-amber-500" />
            <div className="text-xs">
              <span className="text-text-main/60 block text-[10px]">Gelöst:</span>
              <span className="font-mono font-bold text-text-main">{formatDeWert(totalSolved)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-shiraz/10 px-3.5 py-2 rounded-xl border border-shiraz/20">
            <Sparkles size={16} className="text-shiraz" />
            <div className="text-xs">
              <span className="text-shiraz/80 block text-[10px]">Streak:</span>
              <span className="font-mono font-bold text-shiraz">{formatDeWert(streak)} in Folge 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
        {GENERATOR_TASKS.map((task) => (
          <button
            key={task.id}
            onClick={() => handleSelectTask(task.id)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              selectedTaskId === task.id
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <span>{task.title}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-normal ${
              selectedTaskId === task.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {task.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Main Task Working Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Task Statement & Interactive Input (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider">
                {currentTaskDef.category}
              </span>
              <button
                onClick={() => handleReroll()}
                className="px-3 py-1.5 bg-off-white hover:bg-slate-100 text-text-main border border-home-grau/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Erzeugt neue Zufallszahlen für diese Aufgabe"
              >
                <RotateCcw size={13} className="text-shiraz" />
                <span>Neue Werte würfeln</span>
              </button>
            </div>

            {/* Task Question Text */}
            <div className="text-sm text-text-main leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/25 font-medium">
              {taskInstance.questionText}
            </div>

            {/* Hints Accordion */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-text-main/80 flex items-center gap-1">
                <HelpCircle size={14} className="text-amber-600" /> Lösungshinweise &amp; Formelansatz:
              </span>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1 pl-1">
                {taskInstance.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Answer Input Form */}
          <form onSubmit={handleSubmit} className="pt-4 border-t border-home-grau/20 space-y-3">
            <label className="text-xs font-bold text-text-main block">
              Ihr Rechenergebnis:
            </label>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Zahlenwert eingeben (z. B. 2,45)"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  disabled={isSubmitted && evaluationResult?.isCorrect}
                  className="w-full p-3 rounded-xl border border-home-grau/30 bg-off-white text-sm font-mono font-bold focus:ring-2 focus:ring-shiraz outline-none"
                />
              </div>
              <span className="px-3 py-3 bg-slate-100 border border-home-grau/20 rounded-xl text-xs font-mono font-bold text-slate-700 shrink-0">
                {taskInstance.unit}
              </span>
              <button
                type="submit"
                disabled={isSubmitted && evaluationResult?.isCorrect}
                className="px-5 py-3 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                Prüfen
              </button>
            </div>

            {inputError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle size={15} className="shrink-0 text-rose-600" />
                <span>{inputError}</span>
              </div>
            )}

            {/* Feedback Message */}
            {isSubmitted && evaluationResult && (
              <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                evaluationResult.isCorrect 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {evaluationResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="text-emerald-700" size={18} />
                      <span>Korrekt gelöst! Ausgezeichnet gerechnet.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-rose-700" size={18} />
                      <span>Leider nicht ganz richtig (Toleranz ±{formatDeWert(taskInstance.tolerancePercent)}%).</span>
                    </>
                  )}
                </div>

                {/* Specific Common Mistake Diagnostics */}
                {evaluationResult.mistakeNote && (
                  <div className="mt-2 p-2.5 bg-white/80 rounded-lg border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Diagnose:</strong> {evaluationResult.mistakeNote}</span>
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-text-main/70">
                    Musterlösung: <strong>{formatDeWert(taskInstance.correctAnswer)} {taskInstance.unit}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-shiraz font-bold underline hover:text-shiraz/80 cursor-pointer"
                  >
                    {showSolution ? 'Lösungsweg ausblenden' : 'Schrittweisen Lösungsweg ansehen'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right: Step-by-Step Solution Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <BookOpen size={16} className="text-shiraz" /> Musterlösung &amp; Rechenschritte
            </h3>

            {showSolution || (isSubmitted && evaluationResult?.isCorrect) ? (
              <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                {taskInstance.solutionSteps.map((step, idx) => (
                  <div key={idx} className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
                    <span className="text-xs font-bold text-text-main block">{step.step}</span>
                    <div className="py-1 overflow-x-auto text-xs text-text-main">
                      <BlockMath math={step.math} />
                    </div>
                    <span className="text-[11px] text-text-main/70 block leading-relaxed">{step.explanation}</span>
                  </div>
                ))}

                <button
                  onClick={() => handleReroll()}
                  className="w-full py-2.5 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <RotateCcw size={14} />
                  <span>Gleiche Aufgabe mit neuen Werten üben</span>
                </button>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center text-center p-6 bg-off-white rounded-xl border border-dashed border-home-grau/40">
                <Lightbulb size={32} className="text-amber-500 mb-2 opacity-80" />
                <h4 className="text-xs font-bold text-text-main">Lösungsweg noch verborgen</h4>
                <p className="text-[11px] text-text-main/60 mt-1 max-w-xs">
                  Versuchen Sie zuerst, die Aufgabe eigenständig zu berechnen. Nach der Überprüfung können Sie die Musterlösung aufdecken.
                </p>
                <button
                  onClick={() => setShowSolution(true)}
                  className="mt-4 text-xs font-bold text-shiraz hover:underline cursor-pointer"
                >
                  Lösung sofort aufdecken
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
            <strong>Didaktischer Tipp:</strong> Bei Rechenaufgaben in Prüfungen stammen über 70% der Punktabzüge nicht aus Formelfehlern, sondern aus unvollständigen Einheitenumrechnungen (z. B. Meter vs. Millimeter oder Kilonewton vs. Newton).
          </div>
        </div>
      </div>

    </div>
  );
}
