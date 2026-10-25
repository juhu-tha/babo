

export default function AnhangUebungen() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 3</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Klausurrelevante Übungsaufgaben mit Musterlösungen
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Testen Sie Ihr rechnerisches und begriffliches Geschick mit den typischen Vorlesungs- und Klausuraufgaben. Klicken Sie auf „Lösungsweg einblenden", um die akademischen Berechnungen nachzuvollziehen.
        </p>

        <div className="space-y-5">
          {/* Aufgabe 1 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 1</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block">Unterschied deklarierte vs. funktionelle Einheit</strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  Erläutern Sie den fachlichen Unterschied zwischen einer deklarierten Einheit und einer funktionalen Einheit an je einem präzisen Beispiel aus dem Betonbau.
                </p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2">
                <div>
                  <span className="font-bold underline">Deklarierte Einheit:</span> Bezugsgröße einer EPD auf reiner Produktebene ohne definierte baukonstruktive Funktion.
                  <br />
                  <strong>Beispiel:</strong> 1 m³ Transportbeton C25/30 oder 1 kg Baustahl B500B. Dies reicht nicht für Bauteilvergleiche, da Bauteilhauptstärken (statische Erfordernisse) unberücksichtigt bleiben.
                </div>
                <div>
                  <span className="font-bold underline">Funktionelle Einheit:</span> Legt konkrete Funktion mit bauphysikalischen Leistungswerten und der Nutzungsdauer für ein fertiges Bauteil fest.
                  <br />
                  <strong>Beispiel:</strong> 1 m² Deckenfeld im Innenbereich (Spannweite l = 5 m, Verkehrslast = 2,7 kN/m², Nutzungsdauer = 50 Jahre). Ein solcher funktioneller Bezug ermöglicht erst den vergleichenden ökologischen Nachweis zwischen einer Stahlbeton- und einer Holz-Rippendecke!
                </div>
              </div>
            </details>
          </div>

          {/* Aufgabe 2 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 2</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block">Modul-Zuordnung im Gebäudelebenszyklus</strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  Ordnen Sie die folgenden baulichen Prozesse den korrekten Lebenszyklusmodulen gemäß DIN EN 15978 zu:
                  <br />
                  <em>Austausch der Holzfenster nach 40 Jahren / Kraftstoffverbrauch eines Abbruchbaggers / Heizwärmebedarf / Carbonatisierung von Konstruktionsbeton / Schrottgutschrift für recycelten Baustahl.</em>
                </p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-semibold space-y-1 font-mono">
                <div>&bull; Austausch der Holzfenster nach 40 Jahren &rarr; <strong>Modul B4 (Ersatz / Sanierung)</strong></div>
                <div>&bull; Kraftstoffverbrauch des Baggers im Abbruch &rarr; <strong>Modul C1 (Rückbau)</strong></div>
                <div>&bull; Jährlicher Heizwärmebedarf der Nutzer &rarr; <strong>Modul B6 (Betriebsenergie)</strong></div>
                <div>&bull; CO₂-Bindung durch Carbonatisierung von Beton &rarr; <strong>Modul B1 (Nutzungsphase)</strong></div>
                <div>&bull; Gutschrift für verwertbaren Bewehrungsstahlschrott &rarr; <strong>Modul D (Recycling / Gutschriften)</strong></div>
              </div>
            </details>
          </div>

          {/* Aufgabe 3 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 3</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block">Rechnerische GWP-Massenbilanz einer Stahlbetondecke</strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  Gegeben ist eine tragende Stahlbetondeckenplatte mit einer Dicke von <strong>d = 22 cm</strong>, einer Rohdichte von <strong>&rho; = 2.500 kg/m³</strong> und einem normativ festgelegten Bewehrungsgehalt von <strong>100 kg Baustahl pro Kubikmeter</strong> Gesamtbetonvolumen.
                  Die spezifischen GWP-Herstellungsfaktoren (Phasen A1–A3, fiktiv) lauten:
                  <br />
                  &bull; GWP-Beton: <strong>0,10 kg CO₂-eq/kg</strong> &bull; GWP-Bewehrungsstahl: <strong>0,75 kg CO₂-eq/kg</strong>.
                  <br />
                  Berechnen Sie das Gesamt-Herstellungs-Treibhauspotenzial (GWP) dieser Platte bezogen auf <strong>1 m² Deckenfläche</strong>.
                </p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-3.5">
                <div>
                  <strong className="font-bold underline block mb-1">Detaillierte Rechenschritt-Akkumulation:</strong>

                  <div className="space-y-2">
                    <div>
                      <span className="font-bold">1. Volumen der Deckenplatte pro m² Fläche:</span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                        V = d * A = 0,22 m * 1 m² = 0,22 m³ Beton/m²
                      </div>
                    </div>

                    <div>
                      <span className="font-bold">2. Masse des reinen Betonanteils pro m²:</span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                        Masse_Beton = 0,22 m³ * 2500 kg/m³ = 550 kg Beton/m²
                      </div>
                    </div>

                    <div>
                      <span className="font-bold">3. GWP des Betonanteils pro m²:</span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800">
                        GWP_Beton = 550 kg * 0,10 kg CO₂-eq/kg = 55,00 kg CO₂-eq/m²
                      </div>
                    </div>

                    <div>
                      <span className="font-bold">4. Masse des Bewehrungsstahls pro m²:</span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono">
                        Masse_Stahl = 0,22 m³ Beton * 100 kg Stahl/m³ Beton = 22 kg Stahl/m²
                      </div>
                    </div>

                    <div>
                      <span className="font-bold">5. GWP des Stahlanteils pro m²:</span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800">
                        GWP_Stahl = 22 kg * 0,75 kg CO₂-eq/kg = 16,50 kg CO₂-eq/m²
                      </div>
                    </div>

                    <div>
                      <span className="font-bold">6. Summation zum Gesamt-Bauteilwert:</span>
                      <div className="p-2 bg-emerald-100/50 rounded border border-emerald-300 mt-1 font-mono font-bold text-emerald-950 text-xs">
                        GWP_Gesamt = GWP_Beton + GWP_Stahl = 55,00 + 16,50 = 71,50 kg CO₂-eq pro m² Decke
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Aufgabe 4 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-slate-900 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 4</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block">LCA-Transfer &amp; Reduzierung von GWP-Grenzwerten</strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  Der berechnete Lebenszyklus-Treibhauswert eines Entwurfs liegt bei <strong>26,0 kg CO₂-eq/(m² NRF·a)</strong>. Der Bauherr fordert das staatliche QNG-PLUS-Siegel (≤ 24 kg), um Fördergelder zu sichern.
                  Nennen Sie drei konkrete baubegleitende Optimierungsmaßnahmen, begründen Sie deren GWP-Kompensationseffekt, und ordnen Sie diese den jeweiligen Lebenszyklusmodulen zu.
                </p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Austausch des Standardbetons (A1–A3):</strong> Verminderung des Klinkeranteils durch Substitution mit Hochofenzementen (z.B. Wechsel von CEM I auf CEM III/B). Dies verringert das herstellungsbedingte GWP der KG 300 im Schnitt um 35–45% und senkt den GWP-Gesamtwert um ca. 1,5 kg CO₂-eq/(m²·a).
                  </li>
                  <li>
                    <strong>Einplanung langlebiger Bauteilschichten (B4):</strong> Einbau eines robusten Klinker- oder Holzfaserputzverbunds mit einer BBSR-RSL von 50 Jahren statt Dichtbahnen, die nach 20 Jahren getauscht werden müssen. Dies drückt den Sanierungs-Ersatzwert im Modul B4.
                  </li>
                  <li>
                    <strong>Einbindung regenerativer Energiekomponenten (B6):</strong> Beheizung mittels einer modernen Sole-Wasser-Wärmepumpe in Kombination mit einer großflächigen Photovoltaikanlage. Der erzeugte regenerative Strom drückt den operativen Netzstrom-Anteil im Modul B6 drastisch (Einsparung von ca. 3–5 kg CO₂-eq/m²a).
                  </li>
                </ol>
              </div>
            </details>
          </div>

          {/* Aufgabe 5 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-slate-900 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 5</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block">Kritisches Denken: Bewertung von Produktwerbung</strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  Ein Dämmstoffhersteller bewirbt sein Produkt offensiv mit dem Slogan „klimapositiv laut EPD". 
                  Welche fünf kriteriengeleiteten Prüffragen müssen Sie als fachkundige Gutachterin oder fachkundiger Gutachter stellen, um diese Werbeaussage wissenschaftlich zu verifizieren?
                </p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden">✚ Lösungsweg einblenden</span>
                <span className="hidden group-open:inline">➖ Lösungsweg ausblenden</span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                <strong className="block font-bold mb-1">Kritisches Prüfgitter für die EPD-Analyse:</strong>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>
                    <strong>Modulumfang?</strong> Bezieht sich der negative Wert nur auf die Wiege-bis-Werkstor-Fassung (A1–A3, Cradle-to-Gate), wodurch die am Lebensende (End-of-Life) in Phase C3/C4 unweigerlich freigesetzten Thermikgase schlicht ausgeblendet wurden?
                  </li>
                  <li>
                    <strong>Biogener Trick?</strong> Wurde hier die biogene CO₂-Einspeicherung von Holz/Stoffen ungerechtfertigt als permanenter Entlastungseffekt deklariert (obwohl dieser biogene Vorbehalt physisch am Lebenszyklusende netto neutralisiert wird)?
                  </li>
                  <li>
                    <strong>Modul D unzulässig verrechnet?</strong> Wurden zukünftige theoretische Recyclinggutschriften aus dem Modul D rechtswidrig direkt vom Herstellungsaufwand (Mo. A) abgezogen, um eine künstliche GWP-Minussumme zu erzeugen?
                  </li>
                  <li>
                    <strong>Fehlende funktionelle Gleichwertigkeit?</strong> Deckt sich die funktionelle Leistung des Dämmstoffs (z.B. Druckfestigkeit, Wärmeleitgruppe, Brandklasse A1 vs. B2) mit jenen Produkten, die er im Planungsprozess substituieren soll?
                  </li>
                  <li>
                    <strong>Versteckte Transportlasten (A4/C2)?</strong> Wurden die Transportentfernungen so geschönt oder unterschlagen, dass die realen Logistik-GWP-Werte ungenannt bleiben?
                  </li>
                </ol>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
}
