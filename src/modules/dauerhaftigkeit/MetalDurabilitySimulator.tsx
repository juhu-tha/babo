// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Layers, Zap, AlertTriangle, Check, AlertCircle } from 'lucide-react';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export function MetalDurabilitySimulator() {
  const [targetClass, setTargetClass] = useState<string>('C3');
  const [years, setYears] = useState<number>(15);
  const [showMetalPath, setShowMetalPath] = useState<boolean>(false);
  
  // Bimetall State
  const [metalA, setMetalA] = useState<string>('verzinkt'); // großflächige Platte
  const [metalB, setMetalB] = useState<string>('edelstahl'); // Schraube
  const [environment, setEnvironment] = useState<string>('moist'); // Feuchtespeicher

  // ISO 12944 corrosion category values inside unalloyed steel & zinc (micro-meter layer loss in year 1)
  const isoData: Record<string, { label: string; steelLoss: number; zincLoss: number; desc: string }> = {
    C1: { label: 'C1 (Kleinstes Risiko / Innen beheizt)', steelLoss: 0.1, zincLoss: 0.02, desc: 'Trockene Büros, Schulen, geringe Kondensation.' },
    C2: { label: 'C2 (Gering / Unbeheizte Depots, ländlich)', steelLoss: 10, zincLoss: 0.5, desc: 'Geringe Verschmutzung, offene Garagen.' },
    C3: { label: 'C3 (Mäßig / Stadtgase, mäßige Küste)', steelLoss: 35, zincLoss: 1.2, desc: 'Urbane u. industrielle Bereiche, mäßiges Chlorid.' },
    C4: { label: 'C4 (Stark / Chemieparks, Küstenregion)', steelLoss: 65, zincLoss: 2.8, desc: 'Chemieanlagen, Schwimmbäder, Küstenbereiche mit mäßiger Salzbelastung.' },
    C5: { label: 'C5 (Sehr stark / Industrie, Küste)', steelLoss: 140, zincLoss: 5.5, desc: 'Industrie mit hoher Feuchte und aggressiver Atmosphäre, Küste mit hoher Salzbelastung (Offshore: CX).' },
    CX: { label: 'CX (Extrem / Tropische u. marine Bereiche)', steelLoss: 450, zincLoss: 15, desc: 'Extreme Salzbelastung und andauernd hohe Luftfeuchte.' },
  };

  const chosen = isoData[targetClass] || isoData.C3;
  const totalSteelLoss = chosen.steelLoss * years;
  const totalZincLoss = chosen.zincLoss * years;

  // Galvanic connections ratings matrix
  const getBimetalRating = () => {
    if (environment === 'dry') {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: 'In trockenen Innenbereichen findet kein nennenswerter Elektrolytfluss statt. Korrosionsrisiko vernachlässigbar.'
      };
    }

    if (metalA === metalB) {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: 'Homogene Verbindung aus identischen Metallen besitzt keine Potentialdifferenz.'
      };
    }

    // Small screw/fastener is Metal B, large plate/component is Metal A.
    // RULE 1: Stainless steel fastener (Edelstahl B) in large Zinc, Aluminium, or Baustahl
    if (metalB === 'edelstahl') {
      return {
        label: 'Geringes bis mäßiges Risiko',
        color: 'bg-slate-100/50 border-home-grau/30 text-slate-800',
        icon: AlertCircle,
        desc: 'Klassische Montageausnahme! Das edle Schraubenmetall (Edelstahl) besitzt ein mäßiges Risiko, führt aber wegen der winzigen Kathodenfläche (Schraube) im Vergleich zur großen Anode (Platte) meist zu keinem katastrophalen Versagen der Platte.'
      };
    }

    // RULE 2: Copper fastener (Kupfer B) in anything unnoble
    if (metalB === 'kupfer') {
      return {
        label: 'Kritisches Risiko / Absolutes No-Go!',
        color: 'bg-rose-50 border-shiraz/20 text-slate-900',
        icon: AlertTriangle,
        desc: 'Schraubverbindung verboten! Das edle Kupfer wird die unedle Platte (Alu, Verzinkt, Stahl) lokal zerstören. Durch abgewaschene Kupferionen droht verheerender Lochfraß (Fließregel!).'
      };
    }

    // RULE 3: Unnoble fastener in stainless steel components (Large stainless plate, small regular iron screw)
    if (metalA === 'edelstahl' && (metalB === 'baustahl' || metalB === 'verzinkt')) {
      return {
        label: 'Extremes Versagensrisiko! (Sicherer Bruch)',
        color: 'bg-rose-50 border-shiraz/35 text-shiraz font-bold',
        icon: AlertTriangle,
        desc: 'Gefährliche Konstellation! Die unedle Schraube fungiert als winzige Opferanode für die riesige Inox-Platte. Das Verbindungsmittel wird extrem schnell unter Spannung korrodieren und abscheren!'
      };
    }

    // Aluminum fastener on copper
    if (metalA === 'kupfer' && metalB === 'aluminium') {
      return {
        label: 'Kritisches Risiko / No-Go',
        color: 'bg-rose-50 border-shiraz/30 text-slate-950',
        icon: AlertTriangle,
        desc: 'Aluminium-Niete oder Schrauben werden in direktem Kupferkontakt rasend schnell elektrolytisch aufgelöst.'
      };
    }

    // Baustahl fastener in Verzinkt / Aluminium
    return {
      label: 'Mäßiges Risiko',
      color: 'bg-slate-100/70 border-home-grau/30 text-slate-800',
      icon: AlertCircle,
      desc: 'Mäßige Potentialdifferenz. Unverzinkte Stahlbauteile rosten beschleunigt, falls sie von Feuchtigkeit umgeben sind.'
    };
  };

  const rating = getBimetalRating();
  const RatingIcon = rating.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6 space-y-6">
      
      {/* Teil 1: Abtragsraten nach ISO 12944 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base">
            DIN EN ISO 12944-2: Werkstoffabtragungs-Projektion
          </h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Stahl und Zink korrodieren abhängig von der Schadstoffbelastung in unterschiedlichen Millimeterraten. 
          Wählen Sie die Korrosivitätskategorie und simulieren Sie den Schichtabtrag über Jahre:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Luftreinheits-Klasse (ISO 12944)</span>
              <select aria-label="Luftreinheits-Klasse (ISO 12944)"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                {Object.keys(isoData).map((k) => (
                  <option key={k} value={k}>{isoData[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betrachtungszeitraum</span>
                <span className="font-mono text-slate-900 font-bold">{years} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 border border-home-grau/30 p-4 rounded-xl flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gerechneter Substanzverlust</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5">Baustahl unlegiert</span>
                <span className="text-base font-black text-shiraz font-mono">
                  {formatDeZahl(totalSteelLoss / 1000, 3)} mm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({formatDeWert(totalSteelLoss)} μm Verlust)</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5">Zinkbeschichtung</span>
                <span className="text-base font-black text-slate-700 font-mono">
                  {formatDeZahl(totalZincLoss, 1)} μm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({formatDeZahl(80 / chosen.zincLoss, 0)} a Schutzzeit bei 80 μm Zink)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-normal italic">
              * {chosen.desc}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-home-grau/30" />

      {/* Teil 2: Bimetall / Galvanischer Prüfer */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base">
            Bimetall-Verträglichkeits-Prüfer (DIN EN ISO 14713)
          </h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Wird ein edleres Metall leitend mit einem unedleren Metall verbunden, opfert sich das unedlere Metall als Anode auf. 
          Prüfen Sie Metallunverträglichkeiten im Baubetrieb:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Großteil (z.B. Blech/Fassade)</span>
              <select aria-label="Großteil (z.B. Blech/Fassade)"
                value={metalA}
                onChange={(e) => setMetalA(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Unlegierter Baustahl</option>
                <option value="verzinkt">Feuerverzinkter Stahl</option>
                <option value="aluminium">Aluminium</option>
                <option value="kupfer">Kupfer</option>
                <option value="edelstahl">Edelstahl</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Verbindungsmittel (Schraube/Niet)</span>
              <select aria-label="Verbindungsmittel (Schraube/Niet)"
                value={metalB}
                onChange={(e) => setMetalB(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Baustahlschraube</option>
                <option value="verzinkt">Verzinkte Schraube</option>
                <option value="aluminium">Aluminiumschraube</option>
                <option value="kupfer">Kupfernagel / Kupferschraube</option>
                <option value="edelstahl">Edelstahlschraube (A2/A4)</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Feuchtigkeit / Umgebung</span>
              <select aria-label="Feuchtigkeit / Umgebung"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="dry">Trockener Innenraum (C1)</option>
                <option value="moist">Standard-Aussenbereich (C3)</option>
                <option value="marine">Nassraum / Salznebel (C4/C5)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Montage-Freigabebewertung</span>
            <div className={`p-4 rounded-xl border flex gap-3 ${rating.color}`}>
              <div className="shrink-0 pt-0.5">
                <RatingIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {rating.label}
                </p>
                <p className="text-xs leading-relaxed">
                  {rating.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowMetalPath(!showMetalPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showMetalPath ? '▲ Formeln & Korrosionsschritte ausblenden' : '▼ Formeln & interaktiver Korrosionsweg (Schritt für Schritt)'}</span>
        </button>
        {showMetalPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>Korrosionsschritte & Galvanischer Leitfaden</span>
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 1: Rechnerischer Abtrag unlegierter Baustahl ({formatDeWert(totalSteelLoss)} μm)</p>
                <p className="text-slate-650 leading-relaxed">
                  Nach DIN EN ISO 12944-2 wird der jährliche Korrosionsverlust für unlegierten Stahl als konstanter Wert angenommen. Für die ausgewählte Klasse <strong>{targetClass}</strong> beträgt dieser im ersten Jahr {formatDeWert(chosen.steelLoss)} μm/a. Über {years} Jahre rechnet man linear:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  d_loss = {formatDeWert(chosen.steelLoss)} μm/a · {years} Jahre = {formatDeWert(totalSteelLoss)} μm ({formatDeZahl(totalSteelLoss / 1000, 3)} mm)
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 2: Rechnerischer Zinkabtrag und theoretische Schutzdauer ({formatDeWert(totalZincLoss)} μm)</p>
                <p className="text-slate-500 leading-relaxed">
                  Zink besitzt eine erheblich niedrigere elektrochemische Abtragsrate von {formatDeWert(chosen.zincLoss)} μm/a. Bei einer handelsüblichen Standardfeuerverzinkung mit z.B. 80 μm (Z80) berechnet sich die rechnerische Schutzzeit bis zur vollkommenen Aufzehrung des Zinks durch:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  t_Schutz = 80 μm / {formatDeZahl(chosen.zincLoss, 1)} μm/a = {formatDeZahl(80 / chosen.zincLoss, 1)} Jahre Schutzdauer
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 3: Bimetall-Verbindung & Anoden-/Kathodenverhältnis</p>
                <p className="text-slate-650 leading-relaxed text-xs">
                  Das Risiko aus Kontaktkorrosion beruht auf dem elektrochemischen Potenzialunterschied und dem Flächenverhältnis.
                  Ein verhängnisvoller Fehler im Stahlbau ist das Platzieren eines unedlen Fasteners (z.B. Schraube aus Baustahl/Zink) in einem riesigen edlen Bauteil (z.B. Edelstahl-Träger). Die Schraube wirkt als punktuelle, winzige Opferanode und korrodiert extrem schnell, was zum standsicherheits-gefährdenden Abscheren führt.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 4: Korrosionsmindernde Vorkehrungen</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Galvanische Entkopplung:</strong> Verwendung nicht-leitender EPDM- bzw. Polyamid-Unterlegscheiben zur Unterbrechung des elektrischen Feststoffkontakts.</li>
                  <li><strong>Katodische Opferbarrieren:</strong> Einsatz opferbereiter galvanischer Schutzschichten (z.B. Zink-Staub-Grundierung oder Sherardisieren).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
