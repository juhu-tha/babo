import re

with open('src/modules/spannbeton/SpannbetonPrinzipien.tsx', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('/tmp/einfeldtraeger_calc.jsx', 'r', encoding='utf-8') as f:
    calc_jsx = f.read()

return_pos = orig.find('return (')
if return_pos == -1:
    return_pos = orig.find('return <div')
verfahren_pos = orig.find('{activeSubTab === "verfahren" &&')

print('Return pos:', return_pos, 'Verfahren pos:', verfahren_pos)

new_head = '''  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Subtab Navigation */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Compass className="text-shiraz h-5 w-5" />
              Statisch-konstruktive Grundkonzepte, Tragwerkstheorie &amp; Vorspannverfahren
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Fundamentale Grundlagen für die Bemessung nach DIN EN 1992-1-1 (Eurocode 2) und DIN EN 1992-2 (Betonbrücken)
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-md self-start md:self-auto border border-slate-200">
            EC2 Kap. 5.10 &amp; 7.2
          </span>
        </div>

        {/* Subtab Button Bar */}
        <div className="flex flex-wrap gap-2 pt-1 border-b border-home-grau/20 pb-3">
          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "konzepte"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("konzepte")}
          >
            <BookOpen size={14} /> 1. Grundprinzipien
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "systemberechnung"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("systemberechnung")}
          >
            <Compass size={14} /> 2. Systemberechnung
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "verfahren"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("verfahren")}
          >
            <Layers size={14} /> 3. Spannverfahren: Anwendungsfälle &amp; Eigenschaften
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "querschnitte"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("querschnitte")}
          >
            <Scale size={14} /> 4. Brutto-, Netto- &amp; Ideell-Querschnitt
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "lastausgleich"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("lastausgleich")}
          >
            <Activity size={14} /> 5. Umlenkkräfte &amp; Load Balancing
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "zwangsmomente"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("zwangsmomente")}
          >
            <GitBranch size={14} /> 6. Statische Unbestimmtheit &amp; Konkordanz
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "grenzspannungen"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("grenzspannungen")}
          >
            <ShieldCheck size={14} /> 7. Grenzspannungen, Lastkombinationen &amp; Koppelstellen
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "ausblick_ec2"
                ? "bg-shiraz text-white border-shiraz shadow-xs"
                : "bg-white text-text-main border-home-grau/30 hover:bg-off-white"
            }`}
            onClick={() => setActiveSubTab("ausblick_ec2")}
          >
            <Sparkles size={14} /> 8. 2. Generation EC2 (prEN 1992-1-1)
          </button>
        </div>
      </div>

      {/* 1. SUB-TAB: GRUNDPRINZIPIEN */}
      {activeSubTab === "konzepte" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="text-amber-600 h-4 w-4" />
                Das Dilemma des schlaffen Stahlbetons (Zustand II)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Im klassischen Stahlbetonbau herrscht eine asymmetrische Arbeitsteilung: Der Beton übernimmt den Druck, während der Betonstahl für die Zugabtragung verantwortlich ist. Da die Betonzugfestigkeit nur etwa <strong>10 % seiner Druckfestigkeit</strong> beträgt (<InlineMath math="f_{ctm} \\approx 0{,}10 \\cdot f_{ck}" />), reißt der Beton unter Biegung bereits bei winzigen Bruchteilen der Traglast.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div>• <strong>Zustand I (Ungerissen):</strong> Vor Rissbildung voll tragfähig, aber nur für Kleinstmomente nutzbar.</div>
                <div>• <strong>Zustand II (Gerissen):</strong> Zugbewehrung dehnt sich erst nach Rissbildung nennenswert. Folge: Sprunghafter Abfall der Biegesteifigkeit (<InlineMath math="I_{II} \\ll I_I" />), überproportionale Durchbiegungen und ungehinderter Zutritt von Wasser und Tausalzchloriden.</div>
                <div>• <strong>Ermüdungsrisiko:</strong> Bei zyklischer Last (Eisenbahnbrücken) treten an den Rissstellen hohe lokale Spannungsspitzen auf, die zu vorzeitigem Ermüdungsbruch führen.</div>
              </div>
            </div>

            <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 space-y-3">
              <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                <ShieldCheck className="text-shiraz h-4 w-4" />
                Das Spannbeton-Prinzip: Eigenspannung gegen Zug
              </h4>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die Vorspannung prägt dem Tragwerk einen <strong>künstlichen Eigenspannungszustand</strong> auf: Der gesamte Querschnitt (oder zumindest die Zugzone) wird vorab permanent überdrückt. Die durch äußere Gebrauchslasten erzeugten Zugspannungen treffen auf ein vorverdichtetes Druckfeld und heben lediglich den Druck auf.
              </p>
              <div className="bg-white p-3 rounded-lg border border-shiraz/20 text-xs text-text-main/80 space-y-1">
                <div>• <strong>Erhaltung des Zustands I:</strong> Die volle Biegesteifigkeit des Bruttoquerschnitts bleibt unter Gebrauchslast wirksam.</div>
                <div>• <strong>Minimalste Verformungen:</strong> Schlankheitsgrade bis <InlineMath math="L/h \\approx 30 \\dots 40" /> werden wirtschaftlich realisierbar.</div>
                <div>• <strong>Ermüdungsschutz:</strong> Die Schwingbreiten der Spannstahlspannungen bleiben im ungerissenen Zustand mikroskopisch klein, wodurch Ermüdungsschäden nahezu ausgeschlossen werden.</div>
                <div>• <strong>Anwendungsgebiete:</strong> Weitgespannte Brückenüberbauten (DIN EN 1992-2), Hallenbinder, Flachdecken und fluiddichte Behälter (Klärbecken, Auffangwannen).</div>
              </div>
            </div>
          </div>

          {/* Physikalische Notwendigkeit hochfester Spannstähle: Die Dehnungsfalle von B500 */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Zap className="text-amber-500 h-4 w-4" />
                Physikalische Notwendigkeit hochfester Spannstähle: Die Dehnungsfalle von B500
              </h4>
              <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded border border-amber-200">
                Abschnitt 5.2 der Richtlinie / EC2
              </span>
            </div>

            <p className="text-xs text-text-main/80 leading-relaxed">
              Warum kann man einen Brückenträger nicht einfach mit billigem Standard-Betonstahl (B500B) vorspannen? Die Antwort liegt in der <strong>Größenordnung der rheologischen Betonverformungen</strong> (Kriechen + Schwinden) im Vergleich zur maximalen elastischen Dehnfähigkeit des Stahls:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* B500B */}
              <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200 space-y-2">
                <div className="font-bold text-red-900 flex items-center justify-between">
                  <span>Betonstahl B500B:</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-red-100 text-red-700 rounded-md font-bold">Unbrauchbar als Spannstahl</span>
                </div>
                <div className="space-y-1.5 text-slate-700 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Streckgrenze (Bemessungswert):</span>
                    <InlineMath math="f_{yd} = \\frac{f_{yk}}{\\gamma_s} = \\frac{500}{1{,}15} \\approx 435\\,\\text{N/mm}^2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Elastizitätsmodul:</span>
                    <InlineMath math="E_s = 200\\,000\\,\\text{N/mm}^2" />
                  </div>
                  <div className="pt-2 border-t border-red-200 flex justify-between items-center font-bold text-red-800">
                    <span>Max. elastische Dehnung:</span>
                    <div className="text-right">
                      <InlineMath math="\\varepsilon_{s,el} = \\frac{f_{yd}}{E_s} \\approx 2{,}18 \\cdot 10^{-3}" />
                      <span className="ml-1.5 font-sans font-extrabold text-red-700">(= 2,175 ‰)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Y1860 */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span>Hochfester Spannstahl (Y1860S7):</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold">EC2 Standard-Spannstahl</span>
                </div>
                <div className="space-y-1.5 text-slate-700 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">0,1%-Grenze &amp; Zugfestigkeit:</span>
                    <InlineMath math="f_{p0{,}1k} = 1600\\,\\text{N/mm}^2, \\quad f_{pk} = 1860\\,\\text{N/mm}^2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Elastizitätsmodul:</span>
                    <InlineMath math="E_p = 195\\,000\\,\\text{N/mm}^2" />
                  </div>
                  <div className="pt-2 border-t border-emerald-200 flex justify-between items-center font-bold text-emerald-800">
                    <span>Nutzbare Initialdehnung:</span>
                    <div className="text-right">
                      <InlineMath math="\\varepsilon_{p0} = \\frac{\\sigma_{p0}}{E_p} = \\frac{1400}{195\\,000} \\approx 7{,}18 \\cdot 10^{-3}" />
                      <span className="ml-1.5 font-sans font-extrabold text-emerald-700">(= 7,18 ‰)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dehnungs-Schieberegler */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sliders size={14} className="text-shiraz" />
                  Summe aus Beton-Schwinddehnung und Dauer-Kriechverkürzung (<InlineMath math="\\varepsilon_{c+s} = \\varepsilon_{cs}(\\infty) + \\varepsilon_{cc}(\\infty, t_0)" />):
                </span>
                <span className="font-mono font-bold text-shiraz text-sm">{formatDeZahl(creepShrinkStrain, 2)} ‰</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="2.50"
                step="0.05"
                value={creepShrinkStrain}
                onChange={(e) => setCreepShrinkStrain(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.8 ‰ (Sehr feucht / massiger Pfeiler)</span>
                <span>1.5 ‰ (Üblicher Bauteil-Durchschnitt)</span>
                <span>2.5 ‰ (Trockener Innenraum / dünnwandige Deckenplatte)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white rounded-lg border border-red-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-red-800">
                    <span>Verbleibende Vorspannkraft B500B:</span>
                    <span>{b500ResidualPct} %</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-red-500 h-full transition-all duration-200"
                      style={{ width: `${b500ResidualPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-red-700 leading-tight">
                    {b500ResidualPct === 0
                      ? "Totalausfall! Die Kriech- und Schwindverkürzung übersteigt die Streckgrenze vollkommen. Vorspannkraft = 0 kN."
                      : `Katastrophaler Verlust von ${b500LossPct}% der Initialkraft! B500 ist für Vorspannung physikalisch unbrauchbar.`}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-emerald-800">
                    <span>Verbleibende Vorspannkraft Spannstahl:</span>
                    <span>{tendonResidualPct} %</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-200"
                      style={{ width: `${tendonResidualPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-tight">
                    Erfolgreich! Der zeitabhängige Verlust beträgt nur {tendonLossPct} %. Ein dauerhaft hoher Vorspanngrad von <strong>{tendonResidualPct} %</strong> bleibt über 100 Jahre gesichert erhalten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: SYSTEMBERECHNUNG */}
      {activeSubTab === "systemberechnung" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* A. Interaktiver Simulator: Spanngliedlage, Dehnungsüberlagerung & Spannungsverteilung */}
          <SpannbetonDehnungsAnimation />

          {/* B. Rechner: Grundprinzipien am Einfeldträger: Unbewehrter Beton vs. Stahlbeton vs. Spannbeton */}
''' + calc_jsx + '''
        </div>
      )}

      '''

new_text = orig[:return_pos] + new_head + orig[verfahren_pos:]

with open('src/modules/spannbeton/SpannbetonPrinzipien.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated SpannbetonPrinzipien.tsx cleanly!')
