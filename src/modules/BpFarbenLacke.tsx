import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Paintbrush, Calculator, ShieldCheck, Info, Check, AlertTriangle, FlaskConical, Atom, Layers } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';
import { BINDERS, OS_SYSTEMS, REACTION_MECHANISMS } from './bpfarbenlacke/daten';
import { RechnerTab } from './bpfarbenlacke/RechnerTab';
import { FilmchemieTab } from './bpfarbenlacke/FilmchemieTab';

export default function BpFarbenLacke() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'komponenten' | 'filmchemie' | 'bindemittel' | 'rechner' | 'voc' | 'oberflaechenschutz'>('allgemein');
  const [selectedMech, setSelectedMech] = useState<string>('oxidative');

  // OS-System selector state
  const [osArea, setOsArea] = useState<number>(300); // m²
  const [osEinsatzbereich, setOsEinsatzbereich] = useState<string>('tiefgarage_boden');
  const [osCrackBridging, setOsCrackBridging] = useState<string>('nein');
  const [osBelastung, setOsBelastung] = useState<string>('leicht_pkw');
  const [selectedOsId, setSelectedOsId] = useState<string>('os8');

  // Input states for calculation
  const [targetDft, setTargetDft] = useState<number>(40); // µm (Desired dry thickness)
  const [solidsVol, setSolidsVol] = useState<number>(45); // % (Volume Solids)
  const [thinning, setThinning] = useState<number>(5); // % (Add dilution)
  const [lossFactor, setLossFactor] = useState<number>(20); // % (Overspray, roller loss, etc.)
  const [areaSquareMeters, setAreaSquareMeters] = useState<number>(120); // m²
  const [numCoats, setNumCoats] = useState<number>(2); // Number of coats

  // Calculations
  // 1. Wet Film Thickness without dilution: WFT = (DFT * 100) / Solids_Vol
  const baseWft = useMemo(() => {
    if (solidsVol <= 0) return 0;
    return (targetDft * 100) / solidsVol;
  }, [targetDft, solidsVol]);

  // 2. Wet Film Thickness including thinning: WFT_thinned = WFT * (1 + thin/100)
  const thinnedWft = useMemo(() => {
    return baseWft * (1 + thinning / 100);
  }, [baseWft, thinning]);

  // 3. Spreading Rate (theoretisch) in m²/Liter: 10 * VolumeSolids[%] / DFT[µm]
  const theoreticalSpreadingRate = useMemo(() => {
    if (targetDft <= 0) return 0;
    return (10 * solidsVol) / targetDft;
  }, [solidsVol, targetDft]);

  // 4. Consumption rate:
  // Theoretical Consumption (ml/m² per coat) = WFT (without dilution, because dilution evaporates)
  // Effective Consumption with loss factor = Theoretical Consumption / (1 - loss/100)
  const theoreticalConsumption = useMemo(() => {
    return baseWft; // µm is equal to ml/m² for liquids without loss and before thinning evaporation
  }, [baseWft]);

  const effectiveConsumption = useMemo(() => {
    if (lossFactor >= 100) return 0;
    return theoreticalConsumption / (1 - lossFactor / 100);
  }, [theoreticalConsumption, lossFactor]);

  // Total required quantity in liters = (effectiveConsumption * area * coats) / 1000
  const totalLitersRequired = useMemo(() => {
    return (effectiveConsumption * areaSquareMeters * numCoats) / 1000;
  }, [effectiveConsumption, areaSquareMeters, numCoats]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-6">
          <Paintbrush className="text-shiraz" size={28} />
          <h2 id="modul-titel" className="text-xl font-bold text-text-main flex items-center gap-2">
              Farben &amp; Lacke im Bauwesen
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Umfassendes Kompendium über Beschichtungssysteme, Bindemittel-Chemie, Schichtdicken-Berechnung und VOC-Regularien
          </p>
        </div>
        </div>

        {/* Local Tab Navigation */}
        <div className="flex border-b border-home-grau/30 mb-6 overflow-x-auto pb-px">
          <button aria-pressed={activeTab === 'allgemein'}
            onClick={() => setActiveTab('allgemein')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'allgemein'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Allgemeine Übersicht
          </button>
          <button aria-pressed={activeTab === 'komponenten'}
            onClick={() => setActiveTab('komponenten')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'komponenten'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Die 4 Hauptbestandteile
          </button>
          <button aria-pressed={activeTab === 'filmchemie'}
            onClick={() => setActiveTab('filmchemie')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'filmchemie'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <FlaskConical size={14} /> Chemie &amp; Filmbildung
            </span>
          </button>
          <button aria-pressed={activeTab === 'bindemittel'}
            onClick={() => setActiveTab('bindemittel')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'bindemittel'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Bindemittel-Matrix
          </button>
          <button aria-pressed={activeTab === 'rechner'}
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'rechner'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <Calculator size={14} /> Schichtdicken- &amp; Mengenschätzer
            </span>
          </button>
          <button aria-pressed={activeTab === 'voc'}
            onClick={() => setActiveTab('voc')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
              activeTab === 'voc'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Schadstoffe &amp; VOC-Grenzwerte
          </button>
          <button aria-pressed={activeTab === 'oberflaechenschutz'}
            onClick={() => setActiveTab('oberflaechenschutz')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
              activeTab === 'oberflaechenschutz'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Oberflächenschutzsysteme (OS)
            </span>
          </button>
        </div>

        {/* TAB CONTENST */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
          
          {/* TAB 1: ALLGEMEIN */}
          {activeTab === 'allgemein' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2">Bedeutung von Beschichtungen im Hoch- und Tiefbau</h3>
                <p className="mb-3">
                  Farben, Lacke und Lasuren sind im Bauwesen weit mehr als reine Gestaltungselemente. Sie bilden die erste Abwehrschicht eines Bauteils gegen aggressive Umwelteinflüsse, Chloride, Feuchtigkeit, UV-Strahlung und sauren Regen. 
                </p>
                <p>
                  Ein optimal gewähltes Beschichtungssystem entscheidet maßgeblich über die <strong>Instandhaltungszyklen und Nutzungsdauer</strong> von Betonfassaden, Holzkonstruktionen und Stahltragwerken (Korrosionsschutzschichten).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-bold text-text-main text-sm">Schutzfunktion</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Verhinderung von Feuchtigkeitseintritt (Regenschutz), Abwehr von gasförmigen Schadstoffen (z.B. CO₂-Bremse zur Vermeidung von Betonkarbonatisierung) und Schutz vor UV-Degradation von organischen Baustoffen (Holz, Kunststoffe).
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-bold text-text-main text-sm">Hygiene &amp; Raumklima</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Einstellung der Raumfeuchte durch diffusionsoffene Innenanstriche (Zweiwege-Feuchteregulierung). Mineralische Farben (Kalk- und Silikatfarben) verhindern die Ansiedlung von Schimmelpilzen auf vollkommen natürliche, biozidfreie Weise dank ihres sehr guten pH-Wertes.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-bold text-text-main text-sm">Ästhetik &amp; Lichtausbeute</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Glanzgrad und Helligkeitskoeffizienten beeinflussen die Tageslichtnutzung im Gebäudeinneren und können Wärmeabsorptionen an Außenfassaden steuern (Stichwort: Reflektion von Infrarotlicht zur Vermeidung städtischer Wärmeinseln).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-950 flex gap-3">
                <Info size={20} className="text-amber-700 mt-0.5 flex-none" />
                <div>
                  <strong className="font-bold">Praktischer Bau-Tipp:</strong> Untergründe müssen vor der Ausführung stets fest, sauber, trocken und tragfähig sein. Die häufigste Fehlerursache bei Abplatzungen ist eine mangelhafte Vorbereitung (Zementleierschichten auf Beton, kriechende Holzfeuchte oder ungeeignete Altanstriche als Trennlagen). Ein einfacher Gitterschnitt-Test nach DIN EN ISO 2409 offenbart die Haftfestigkeit von Bestandsschichten!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPONENTEN */}
          {activeTab === 'komponenten' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-main text-xl">Woraus besteht ein Beschichtungsstoff?</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Nahezu alle Farben und Lacke setzen sich aus vier funktionalen Komponentengruppen zusammen:
          </p>
        </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Das Bindemittel (Die Basis)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Die primäre Trägerkomponente des Beschichtungsstoffs. Sie verbindet die Pigmentpartikel untereinander und verklebt sie dauerhaft mit dem Untergrund. Nach der Trocknung bildet das Bindemittel den eigentlichen Schutzfilm.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Acrylharze, Alkydharze, Epoxidharze, Silikate (Kaliwasserglas), Sumpfkalk, Polyurethane.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Lösemittel / Wasser (Trägermaterial)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Ermöglicht das flüssige Aufbringen und Einstellen der optimalen Viskosität für Rollen, Streichen oder Spritzen. Nach dem Auftrag verdunstet es vollständig und ist somit an der endgültigen Schutzwirkung nicht direkt beteiligt.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Wasser (bei Dispersions- und Acrylfarben), Benzine (Kunstharzlacke), Alkohole, Ester.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Pigmente &amp; Füllstoffe (Farbaufbau)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Pigmente liefern den Farbton und sorgen für Deckkraft und UV-Schutz. Füllstoffe (Kreide, Talkum, Schwerspat) regulieren den Glanzgrad, die Dichte, die Viskosität und erhöhen den mechanischen Festkörperanteil.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Titandioxid (Weißpigment), Eisenoxide (Rot/Gelb), Kreidemehl, Siliziumdioxid.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Additive (Spezialhelfer)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    In Kleinstmengen (0,1 – 2 %) zugesetzt, um gezielte Verarbeitungseigenschaften einzustellen. Sie steuern das Fließverhalten, verhindern Schimmelbildung im Gebinde oder beschleunigen die Trocknung.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Entschäumer, Verlaufshilfsmittel, Topfkonservierer (Biozide), Trockenstoffe (Sikkative für Öle).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHEMIE & FILMBILDUNG */}
          {activeTab === 'filmchemie' && (
            <FilmchemieTab setSelectedMech={setSelectedMech} selectedMech={selectedMech} />
          )}

          {/* TAB 3: BINDEMITTELMATRIX */}
          {activeTab === 'bindemittel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Die Bindemittel-Bibliothek</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Vergleichende Analyse aller baurelevanten Bindemittelarten und ihrer GISCODE-Einstufungen
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BINDERS.map((binder, idx) => (
                  <div key={idx} className="bg-white border border-home-grau/25 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-shiraz/40 transition-colors">
                    <div className="space-y-3">
                      <div className="border-b border-home-grau/10 pb-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-shiraz">{binder.category}</span>
                        <h4 className="font-black text-text-main text-base mt-0.5 leading-tight">{binder.name}</h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Vorteile:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.advantages.map((adv, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Einschränkungen:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.disadvantages.map((dis, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1">
                              <span className="text-red-600 font-bold shrink-0">✕</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-home-grau/10 mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] leading-tight">
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]">Diffusionsfähigkeit</span>
                          <span className="font-bold text-text-main mt-0.5 block">{binder.sdValue}</span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]">GISCODE / PUF-Code</span>
                          <span className="font-bold text-indigo-700 mt-0.5 block">{binder.pufCode || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-main/70 leading-normal italic mt-1">
                        <strong>Einsatz:</strong> {binder.typicalUse}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALCULATOR */}
          {activeTab === 'rechner' && (
            <RechnerTab targetDft={targetDft} setTargetDft={setTargetDft} solidsVol={solidsVol} setSolidsVol={setSolidsVol} thinning={thinning} setThinning={setThinning} lossFactor={lossFactor} setLossFactor={setLossFactor} areaSquareMeters={areaSquareMeters} setAreaSquareMeters={setAreaSquareMeters} numCoats={numCoats} setNumCoats={setNumCoats} baseWft={baseWft} thinnedWft={thinnedWft} theoreticalConsumption={theoreticalConsumption} effectiveConsumption={effectiveConsumption} totalLitersRequired={totalLitersRequired} />
          )}

          {/* TAB 5: VOC & SCHADSTOFFE */}
          {activeTab === 'voc' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-shiraz text-base flex items-center gap-2">
                  <ShieldCheck size={20} />
                  Die Decopaint-Richtlinie (2004/42/EG) &amp; VOC-Belastung
                </h3>
                <p className="leading-relaxed">
                  <strong>VOC (Volatile Organic Compounds)</strong> sind flüchtige organische Kohlenwasserstoffe, die beim Trocknen von weichmacher- und lösemittelhaltigen Anstrichen in die Atemluft übergehen. Hohe Konzentrationen führen zu gesundheitlichen Belastungen im Innenraum (Sick-Building-Syndrom) und belasten im Außenbereich die Umwelt.
                </p>
                <p className="leading-relaxed">
                  Die europäische <strong>Decopaint-Richtlinie</strong> begrenzt den VOC-Höchstgehalt (Gramm VOC je Liter gebrauchsfertiges Produkt) für baurelevante Farben und Lacke.
                </p>
              </div>

              {/* Table representing DEC0PAINT LIMITS */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text-main/40 uppercase tracking-wider block">Grenzwerte für ausgewählte Produktkategorien nach Anhang II A (Phase II):</span>
                <div className="overflow-hidden border border-home-grau/30 rounded-xl text-xs bg-white">
                  <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                    <div className="col-span-1 text-center">Cat</div>
                    <div className="col-span-5">Kategorie-Beschreibung</div>
                    <div className="col-span-3 text-center bg-blue-50/50">Wässrig (Wb) / [g/l]</div>
                    <div className="col-span-3 text-center bg-amber-50/50">Lösemittelbasiert (Sb) / [g/l]</div>
                  </div>
                  {[
                    { cat: 'a', name: 'Wandfarben für den Innenbereich (matt, Glanz < 25@85°)', wb: '30 g/l', sb: '30 g/l (selten)', desc: 'Standarddispersionsfarben' },
                    { cat: 'b', name: 'Wandfarben für den Innenbereich (glänzend)', wb: '100 g/l', sb: '100 g/l', desc: 'Latexfarben, Seidenglanz' },
                    { cat: 'c', name: 'Fassadenfarben für Außenwände (mineralisch/organisch)', wb: '40 g/l', sb: '430 g/l', desc: 'Silikatfassaden, Siliconharze' },
                    { cat: 'd', name: 'Innen-/Außenlacke für Holz und Metall (Bautenschutz)', wb: '130 g/l', sb: '300 g/l', desc: 'Acryllacke, Alkydharzlacke' },
                    { cat: 'i', name: 'Einkomponenten-Speziallacke (z.B. Parkettsiegel)', wb: '140 g/l', sb: '500 g/l', desc: 'Besonders schlagfeste Siegel' },
                    { cat: 'j', name: 'Zweikomponenten-Speziallacke (z.B. EP-Estrichbeschichtungen)', wb: '140 g/l', sb: '500 g/l', desc: 'Industrielle EP- und PUR-Schutzanstriche' },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 p-3 border-b border-home-grau/10 last:border-0 items-center text-[11px]">
                      <div className="col-span-1 text-center font-bold text-shiraz">{row.cat}</div>
                      <div className="col-span-5 font-semibold text-text-main">{row.name}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-sky-800 bg-sky-50/20 py-1 rounded">{row.wb}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-amber-800 bg-amber-50/20 py-1 rounded">{row.sb}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco Labels card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-home-grau/30 rounded-xl p-5">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">E</span>
                    <h4 className="font-bold text-text-main">Umweltzeichen „Blauer Engel“ (DE-UZ 102)</h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed">
                    Die Kriterien des Blauen Engels für emissionsarme Innenwandfarben gehen weit über die gesetzlichen VOC-Mindestanforderungen hinaus:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li>Max. VOC-Gehalt: ≤ 1 g/Liter (fast lösemittelfrei)</li>
                    <li>Begrenzung von Weichmachern und schwerflüchtigen Stoffen (SVOC; Kriterien DE-UZ 102, Ausgabe Januar 2019, Version 7 von 07/2025)</li>
                    <li>Strenge Grenzwerte für Isothiazolinone (übliche Biozide als Topfkonservierer, die Allergien auslösen können)</li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-indigo-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">G</span>
                    <h4 className="font-bold text-text-main">GISCODE-Klassifizierungssystem der BG BAU</h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed">
                    Der GISCODE dient Handwerkern und Planern zur schnellen Einstufung des Arbeitsschutzes und der gesundheitlichen Gefährdung bei der Verarbeitung vor Ort:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li><strong>BSW10 / BSW20:</strong> Wässrige Beschichtungsstoffe, weichmacherfrei bzw. lösemittelarm (sehr geringe Gefährdung).</li>
                    <li><strong>BSL25:</strong> Lösemittelbasierte Bautenschutzlacke (erforderliche Schutzmaßnahmen wie Atemschutz).</li>
                    <li><strong>RE30:</strong> Epoxidharzprodukte, sensibilisierend (zwingend Schutzhandschuhe erforderlich).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: OBERFLAECHENSCHUTZ */}
          {activeTab === 'oberflaechenschutz' && (
            <div className="space-y-8">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2">Oberflächenschutzsysteme (OS) für Beton nach DIN EN 1504-2</h3>
                <p className="mb-3">
                  Betonbauwerke, insbesondere Parkhäuser, Tiefgaragen, Brücken und Tunnel, sind im Laufe ihrer Lebensdauer hohen physikalischen und chemischen Beanspruchungen ausgesetzt (Frost-Tausalz-Angriffe, Karbonatisierung, Chlorideindrang, mechanischer Verschleiß). 
                </p>
                <p>
                  Oberflächenschutzsysteme (OS) nach <strong>DIN EN 1504-2</strong> und der ergänzenden deutschen <strong>TR Instandhaltung (DAfStb)</strong> verhindern das Eindringen schädlicher Stoffe in das Porensystem des Betons. Damit stoppen sie das Fortschreiten der Karbonatisierung und verhindern die chloridinduzierte Korrosion der Stabbewehrung nachhaltig.
                </p>
              </div>

              {/* SECTION: OS SYSTEMS COMPARISON */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Layers size={18} className="text-shiraz" /> System-Klassifizierung (OS 1 bis OS 11)
                </h3>
                <p className="text-xs text-text-main/70">
                  Wählen Sie ein System aus, um eine vollständige Detailkarte mit Schichtaufbau und typischer Applikations-Chemie anzuzeigen:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {OS_SYSTEMS.map((sys) => (
                    <button aria-pressed={selectedOsId === sys.id}
                      key={sys.id}
                      onClick={() => setSelectedOsId(sys.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-1.5 cursor-pointer ${
                        selectedOsId === sys.id
                          ? 'bg-shiraz border-shiraz text-white shadow-md font-bold'
                          : 'bg-white border-home-grau/30 text-text-main hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{sys.name}</div>
                      <div className={`text-[10px] font-medium leading-tight ${selectedOsId === sys.id ? 'text-white/85' : 'text-text-main/60'}`}>
                        {sys.title}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected OS Details Card */}
                {(() => {
                  const currentOs = OS_SYSTEMS.find(s => s.id === selectedOsId) || OS_SYSTEMS[5];
                  return (
                    <div className="bg-stone-50 border border-home-grau/30 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-shiraz/10 text-shiraz font-bold text-xs">Aktuelles System: {currentOs.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentOs.trafficable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {currentOs.trafficable ? 'Befahrbar' : 'Nicht befahrbar'}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-text-main mt-2 border-b border-home-grau/20 pb-1">{currentOs.title}</h4>
                        </div>
                        <p className="text-xs text-text-main/80 leading-relaxed">{currentOs.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Typische Schichtdicke:</span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.thickness}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Rissüberbrückungsklasse:</span>
                            <span className="text-xs text-text-main/70">{currentOs.bridging}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Verwendetes Bindemittel:</span>
                            <span className="text-xs text-text-main/70">{currentOs.mainBinders}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Mittlerer Materialbedarf:</span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.consumption}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs">
                        <h5 className="font-bold text-xs text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-1.5">
                          Schichtaufbau (Applikation)
                        </h5>
                        <div className="relative border-l-2 border-shiraz/30 pl-4 ml-2 py-1 space-y-3 flex-1 flex flex-col justify-center">
                          {currentOs.layers.map((layer, index) => (
                            <div key={index} className="relative text-xs">
                              <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-shiraz border-2 border-white"></span>
                              <span className="font-mono text-[9px] text-shiraz font-black block">Schritt {index + 1}:</span>
                              <p className="text-text-main/80 font-medium leading-snug">{layer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* CHEMICAL MATRIX & BINDER CORRELATION */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Atom size={18} className="text-shiraz" /> Bindemittel-Wirkprinzipien (Der Bauchemikal-Link)
                </h3>
                <p className="text-xs text-text-main/70">
                  Jedes Oberflächenschutzsystem basiert auf spezifischen bauchemischen Molekülgruppen. Hier ist die strukturierte Übersicht nach Wirkungsweise:
                </p>

                <div className="overflow-x-auto border border-home-grau/30 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-xs text-left text-text-main border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-home-grau/30 font-bold text-[11px] text-text-main/80">
                        <th className="p-3">Wirkstoffklasse</th>
                        <th className="p-3">Zugeordnete OS-Systeme</th>
                        <th className="p-3">Chemischer Prozess</th>
                        <th className="p-3">Vorteile / Eigenschaften</th>
                        <th className="p-3">Einschränkungen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-home-grau/20 leading-normal">
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">Silane &amp; Siloxane</td>
                        <td className="p-3 font-semibold">OS 1 (Hydrophobierung)</td>
                        <td className="p-3 text-text-main/80">
                          Reagieren mit den Silanolgruppen der C-S-H-Phasen des Betons unter Abspaltung von Alkohol (Kondensation). Bilden eine polymere, unlösliche Auskleidung der Porenoberflächen, ohne die Poren zu verschließen.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Sehr hohe Eindringtiefe (&gt; 1mm), absolut wasserdampfdurchlässig (s_d &lt; 0,01 m), verringert Frost-Tausalz-Angriffe drastisch.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Kein Schutz vor Kohlendioxid (Karbonatisierung), keine Rissüberbrückung.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">2K-Epoxidharze (EP)</td>
                        <td className="p-3 font-semibold">OS 8</td>
                        <td className="p-3 text-text-main/80">
                          Polyaddition von flüssigen Epoxid-Prepolymeren (Bisphenol-A) mit Amin-Härtern. Es entsteht ein dicht vernetztes, duroplastisches Polymergitter.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Hohe Druck- und Abriebfestigkeit, gute Alkalibeständigkeit, unempfindlich gegenüber schweren mechanischen Lasten.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Starr (keine Rissüberbrückung), frost- und vergilbungsempfindlich bei starker UV-Strahlung im Außenbereich.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">2K-Polyurethane (PU)</td>
                        <td className="p-3 font-semibold">OS 11a, OS 11b</td>
                        <td className="p-3 text-text-main/80">
                          Polyaddition von Polyisocyanaten mit Polyolen. Durch gezielte Auswahl linearer Isocyanate wird ein hochelastischer Schutzfilm (Elastomer) erzielt.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Hochelastisch, sehr gute dynamische Rissüberbrückung bei Minustemperaturen (-20 °C), UV-beständig bei aliphatischer Härter-Basis.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Feuchtigkeitsempfindlich während der Härtung (Blasenbildung durch CO₂-Ausgasung bei Feuchtkontakt), geringere Ritzhärte als EP.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">Reinacrylat-Dispersionen</td>
                        <td className="p-3 font-semibold">OS 2, OS 4, OS 5a</td>
                        <td className="p-3 text-text-main/80">
                          Physikalische Filmbildung durch Verdunstung des Wassers und anschließende Koaleszenz der Polymer-Nanopartikel. Die polare Molekülstruktur hemmt Gase.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Hohe CO₂-Bremswirkung (s_d,CO₂ ≥ 50 m gefordert), wasserbasiert (sehr umweltfreundlich / geruchlos), optimal für vertikale Sichtbetonflächen.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Nicht befahrbar, mäßige statische Rissüberbrückung.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CONFRIGURATOR AND MATERIAL CALC BOARD */}
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                    <Calculator size={18} className="text-shiraz" /> Interaktiver OS-System-Konfigurator &amp; Materialrechner
                  </h3>
                  <p className="text-xs text-text-main/60">
                    Definieren Sie Ihren Anwendungsfall, um die ideale Spezifikation (nach TR Instandhaltung) und die exakt kalkulierten Materialmengen (in kg) zu erhalten.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                  
                  {/* Left Column: Selector Form Inputs */}
                  <div className="lg:col-span-4 bg-stone-50 rounded-xl border border-home-grau/20 p-4 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-text-main">1. Projektfläche (m²)</label>
                      <input aria-label="1. Projektfläche (m²)" 
                        type="number"
                        min="5"
                        max="50000"
                        value={osArea}
                        onChange={(e) => setOsArea(Math.max(5, Number(e.target.value)))}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-mono text-xs font-bold text-text-main outline-none focus:border-shiraz transition-all"
                      />
                      <span className="text-[10px] text-text-main/50 block">Zur Berechnung der Gesamt-Materialmengen</span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">2. Einsatzbereich / Bauteil</label>
                      <select aria-label="2. Einsatzbereich / Bauteil" 
                        value={osEinsatzbereich} 
                        onChange={(e) => setOsEinsatzbereich(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="tiefgarage_boden">Tiefgarage / Bodenplatte</option>
                        <option value="freideck_parkdeck">Freibewittertes Parkgut-Oberdeck / Rampen</option>
                        <option value="brueckenkappe">Brückenüberbau / Brückenkappe</option>
                        <option value="fassade_tunnel">Betonfassade / Tunnelwand / Pfeiler</option>
                        <option value="industriehalle">Industriehalle / Gabelstapler-Betrieb</option>
                        <option value="kellerwand_aussen">Kelleraußenwand / Spritzwasserzone</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">3. Bruch- bzw. Rissrisiko</label>
                      <select aria-label="3. Bruch- bzw. Rissrisiko" 
                        value={osCrackBridging} 
                        onChange={(e) => setOsCrackBridging(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nein">Keine Rissüberbrückung nötig (starr, feste Bodenbedingungen)</option>
                        <option value="ja_statisch">Statische Rissüberbrückung (Klasse A1-A2, ruhende Haarrisse)</option>
                        <option value="ja_dynamisch">Hochelastische Rissüberbrückung (Klasse B3 bei -20 °C, Temperaturschwankungen)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">4. Mechanische Rollbeanspruchung</label>
                      <select aria-label="4. Mechanische Rollbeanspruchung" 
                        value={osBelastung} 
                        onChange={(e) => setOsBelastung(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nur_begehbar">Nicht befahrbar (rein begehbar, dekorativ)</option>
                        <option value="leicht_pkw">Befahrbar (leichte PKW-Lasten, Garagenbetrieb)</option>
                        <option value="schwer_lkw">Schwer befahrbar (harte Punktlasten, LKW, Gabelstapler)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 rounded-lg space-y-1">
                      <span className="font-bold text-[10px] uppercase flex items-center gap-1"><Info size={11} /> Grenzabnahme</span>
                      <p className="text-[10px] leading-relaxed">
                        Reaktionsharz-Beschichtungen (EP/PU) dürfen nur verarbeitet werden, wenn die Betonfeuchte <strong>&lt; 4,0 %</strong> (CM-Methode) beträgt und die Substrattemperatur mindestens <strong>3 Kelvin über dem Taupunkt</strong> liegt!
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Calculations & Action recommendations */}
                  {(() => {
                    // Logic to find recommended system
                    let recommendedSysId = 'os8';
                    let categoryText = 'Starr befahrbares Parkhaus-Beschichtungssystem';
                    let noteText = '';

                    if (osEinsatzbereich === 'tiefgarage_boden') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os11b';
                        categoryText = 'OS 11b – Elastisches befahrbares System (einschichtig)';
                        noteText = 'Empfohlen für feuchtekritische Tiefgaragenböden mit Gefahr von dynamischen Setzungsrissen. Bei drückendem Grundwasser muss rückseitige Feuchtigkeit ausgeschlossen werden (sonst Osmoseblasengefahr!).';
                      } else {
                        recommendedSysId = 'os8';
                        categoryText = 'OS 8 – Starre befahrbare Beschichtung';
                        noteText = 'Bewährtes starres System für Garagenböden ohne Rissbewegungen; sehr abriebfest.';
                      }
                    } else if (osEinsatzbereich === 'freideck_parkdeck') {
                      recommendedSysId = 'os11a';
                      categoryText = 'OS 11a – Erhöhte dynamische Rissüberbrückung (zweischichtig)';
                      noteText = 'Für frei bewitterte Parkdecks mit Rissbewegungen; schützt den Beton vor eindringenden Tausalzlösungen (Anforderungen nach DAfStb-Richtlinie Schutz und Instandsetzung bzw. TR Instandhaltung).';
                    } else if (osEinsatzbereich === 'brueckenkappe') {
                      recommendedSysId = 'os1';
                      categoryText = 'OS 1 – Hydrophobierung';
                      noteText = 'Einfaches und hocheffektives Verfahren für mineralische Überbau-Teile zur Erhöhung des Frost-Widerstands und Abperlen des Wassers.';
                    } else if (osEinsatzbereich === 'fassade_tunnel') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os5b';
                        categoryText = 'OS 5b – Beschichtung mit geringer Rissüberbrückung';
                        noteText = 'Bietet dauerhaften Witterungsschutz auch bei rissanfälligen Betonfertigteil-Fassaden im Außenbereich.';
                      } else if (osCrackBridging === 'ja_statisch') {
                        recommendedSysId = 'os5a';
                        categoryText = 'OS 5a – Beschichtung mit geringer Rissüberbrückung';
                        noteText = 'Kostengünstiger Haarriss-Abdecker für Wände im schattigen Außen- oder Innenbereich.';
                      } else {
                        recommendedSysId = 'os4';
                        categoryText = 'OS 4 – Beschichtung mit erhöhter Dichtheit (CO₂-Bremse)';
                        noteText = 'Optimal für dichte Betonschutzanstriche auf Brückenpfeilern, Lärmschutzwänden und Architekturbetonschichten zur Bewahrung des alkalischen Milieus.';
                      }
                    } else if (osEinsatzbereich === 'industriehalle') {
                      recommendedSysId = 'os8';
                      categoryText = 'OS 8 – Starre EP-Beschichtung für mechanisch stark beanspruchte Flächen';
                      noteText = 'In Industriehallen ist hoher Verschleißwiderstand gefordert. Eine Abstreuung mit feuergetrocknetem Quarzsand verhindert Absplitterung durch Staplerverkehr.';
                    } else if (osEinsatzbereich === 'kellerwand_aussen') {
                      recommendedSysId = 'os2';
                      categoryText = 'OS 2 – Dünne Beschichtung für nicht begeh- und befahrbare Flächen';
                      noteText = 'Dünne Beschichtung zur Verringerung der kapillaren Wasseraufnahme frei bewitterter, nicht erdberührter Sockel- und Wandflächen im Spritzwasserbereich; keine Abdichtung gegen Bodenfeuchte (dafür DIN 18533).';
                    }

                    // Dynamically get recommended material list
                    const materialDefinitions: Record<string, { material: string; rate: number; remark: string }[]> = {
                      os1: [
                        { material: 'Chemischer Silan-Hydrophobierstoff (lösemittelfrei)', rate: 0.35, remark: 'Flutend per Airless oder Flutlanze applizieren (nass in nass)' }
                      ],
                      os2: [
                        { material: 'Grundierung (Acrylat, niedrigviskos)', rate: 0.10, remark: 'Porenfüllend, ggf. nach Hydrophobierung' },
                        { material: 'Oberflächenschutzschicht Acrylat (1. Anstrich)', rate: 0.15, remark: 'Roll-Anstrich' },
                        { material: 'Oberflächenschutzschicht Acrylat (2. Anstrich)', rate: 0.15, remark: 'Roll-Anstrich' }
                      ],
                      os4: [
                        { material: 'Zementgebundene Porenfeinspachtelung (Mörtel)', rate: 1.50, remark: 'Schließen von Betonlunkern' },
                        { material: 'Systemgrundierung Acrylat-Basis', rate: 0.18, remark: 'Tiefenverankerung' },
                        { material: 'Reinacrylat-Schutzfarbe (1. Anstrich)', rate: 0.22, remark: 'Farbtonaufbau' },
                        { material: 'Reinacrylat-Schutzfarbe (2. Anstrich)', rate: 0.22, remark: 'Festlegung der endgültigen CO₂-Bremsschicht' }
                      ],
                      os5a: [
                        { material: 'Cementitious PCC-Feinspachtel', rate: 1.50, remark: 'Egalisierung' },
                        { material: 'Acrylat-Grundfestiger', rate: 0.20, remark: 'Haftverbesserung' },
                        { material: 'Elastomer-Zwischenlage (Acrylat)', rate: 0.35, remark: 'Fugen- und Haarrissabdeckung' },
                        { material: 'Elastomer-Dunkelbeschichtung (Acrylat)', rate: 0.35, remark: 'Satte, schützende Deckschicht' }
                      ],
                      os5b: [
                        { material: 'Grundierung bzw. Vornässen (nach Herstellerangabe)', rate: 0.20, remark: 'Mattfeuchter, tragfähiger Untergrund' },
                        { material: 'Polymer/Zement-Beschichtung (1. Lage)', rate: 1.70, remark: 'Kunststoffmodifizierte Schlämme, rissüberbrückend' },
                        { material: 'Polymer/Zement-Beschichtung (2. Lage)', rate: 1.70, remark: 'Gesamtschichtdicke ca. 2 mm' }
                      ],
                      os8: [
                        { material: '2K-Epoxidharz-Grundierharz (lösungsmittelfrei)', rate: 0.45, remark: 'Haftbrücke porentief einreiben' },
                        { material: 'Egalisierungs-Kratzspachtel (2K-EP + 50% Quarzmehl)', rate: 1.25, remark: 'Schutz vor Porenrückschlag' },
                        { material: 'Zähes Basisharz (2K-Epoxidharz)', rate: 1.65, remark: 'Satte Bindemittelschicht für Einstreuung' },
                        { material: 'Feuergetrockneter Einstreusand (Quarz, 0,4 - 0,8 mm)', rate: 4.50, remark: 'Einstreuung im Überschuss (vollständig absanden. Überschuss fegen)' },
                        { material: 'Kopfversiegelung (pigmentierte 2K-EP-Rollversiegelung)', rate: 0.70, remark: 'Sandeinbindung gegen Reifenabrieb' }
                      ],
                      os11a: [
                        { material: '2K-Epoxidharz-Systemgrundierung', rate: 0.40, remark: 'Füllen der Betonkapillaren' },
                        { material: 'Hochelastische PU-Dichtungsschicht (Membran)', rate: 2.00, remark: 'Rissüberbrückungs-Unterbau (unbesandet aufrakeln)' },
                        { material: 'Zähelastische PU-Verschleißschicht', rate: 1.60, remark: 'Bindeschicht für Quarzsand' },
                        { material: 'Feuergetrockneter Quarzsand (0,4 - 0,8 mm)', rate: 5.00, remark: 'Vollabsandung im Überschuss' },
                        { material: 'Chemikalienresistente PU-Kopfversiegelung (lichtecht)', rate: 0.80, remark: 'Schutz vor Streusalz, Benzin und UV-Licht' }
                      ],
                      os11b: [
                        { material: '2K-Epoxidharz-Systemgrundierung', rate: 0.40, remark: 'Absperrung Wasser' },
                        { material: 'Hochelastische Kombi-PU-Verschleißschicht', rate: 2.30, remark: 'Einschichtige Dichtung & Verschleiß' },
                        { material: 'Feuergetrockneter Absandsand (0,4 - 0,8 mm)', rate: 5.00, remark: 'Rutschfeste Abstreuung' },
                        { material: 'Abrieb- und lichtfeste PU-Kopfversiegelung', rate: 0.85, remark: 'Witterungsstabile Schutzfarbe' }
                      ]
                    };

                    const currentMatBreakdown = materialDefinitions[recommendedSysId] || materialDefinitions['os8'];
                    let totalVolumeSum = 0;

                    return (
                      <div className="lg:col-span-8 space-y-4 animate-in fade-in duration-300">
                        {/* Recommendation result box */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-950 flex gap-3.5">
                          <ShieldCheck size={28} className="text-emerald-700 flex-none mt-0.5" />
                          <div className="space-y-1.5">
                            <span className="font-bold text-[10px] uppercase tracking-wider block text-emerald-800">Technisch empfohlene Konfiguration (TR Instandhaltung):</span>
                            <h4 className="text-base font-black text-emerald-900 leading-none">{categoryText}</h4>
                            <p className="font-semibold text-emerald-800/90 leading-tight">{noteText}</p>
                          </div>
                        </div>

                        {/* Material volume output table */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[11px] font-bold text-text-main/50 uppercase tracking-wider">Kalkulierter Gesamtbedarf für {formatDeWert(osArea)} m²:</span>
                            <span className="px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-mono text-[11px] font-bold">Fläche: {formatDeWert(osArea)} m²</span>
                          </div>

                          <div className="overflow-hidden border border-home-grau/25 rounded-md text-xs bg-white">
                            <div className="grid grid-cols-12 gap-1 p-2.5 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                              <div className="col-span-5">Komponente / Schichtleistung</div>
                              <div className="col-span-2 text-center">Verbrauch</div>
                              <div className="col-span-2 text-center text-shiraz">Gesamtmenge</div>
                              <div className="col-span-3">Arbeitshinweis</div>
                            </div>
                            
                            {currentMatBreakdown.map((row, idx) => {
                              const calculatedTotal = row.rate * osArea;
                              totalVolumeSum += calculatedTotal;

                              return (
                                <div key={idx} className="grid grid-cols-12 gap-1 p-2.5 border-b border-home-grau/10 last:border-0 items-center text-[11px] font-medium text-text-main">
                                  <div className="col-span-5 font-bold flex gap-1.5 items-center">
                                    <span className="w-4 h-4 rounded-full bg-stone-200 text-[10px] font-mono flex items-center justify-center font-bold">{idx + 1}</span>
                                    <span>{row.material}</span>
                                  </div>
                                  <div className="col-span-2 text-center font-mono text-text-main/70">{formatDeZahl(row.rate, 2)} kg/m²</div>
                                  <div className="col-span-2 text-center font-mono font-black text-shiraz bg-shiraz/5 py-1 rounded">{calculatedTotal.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg</div>
                                  <div className="col-span-3 text-text-main/60 italic leading-snug">{row.remark}</div>
                                </div>
                              );
                            })}

                            {/* Aggregates total */}
                            <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100/50 font-bold items-center font-mono text-xs border-t border-home-grau/20">
                              <div className="col-span-12 font-sans flex justify-between font-black">
                                <span>ZUSAMMENFASSUNG HARZ &amp; SAND:</span>
                                <span className="text-shiraz border-2 border-shiraz/35 px-3 py-1 rounded bg-shiraz/10 font-bold">
                                  {totalVolumeSum.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg Gesamt
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Concrete repairs info checklist */}
                        <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-4 text-[11px]">
                          <h5 className="font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-700" /> Ausführungskriterien &amp; Betonvorbereitung (DIN 1045-3):
                          </h5>
                          <ul className="list-disc list-inside space-y-1.5 text-text-main/80 leading-relaxed pl-1">
                            <li><strong>Untergrundfestigkeit:</strong> Die Haftzugfestigkeit (Abreißtest) der vorbereiteten Betonrandzone muss im Mittel mindestens <strong>1,5 N/mm²</strong> betragen (kleinster Einzelwert &gt; 1,0 N/mm²).</li>
                            <li><strong>Rautiefe (Egalisierung):</strong> Bei grobem Betonprofil muss zwingend eine OS-Ausgleichsspachtelung aus feinkörnigem Reaktionsharzmörtel appliziert werden, da ansonsten Deckungsfehlstellen durch Porenblasen ("Pinholes") entstehen.</li>
                            <li><strong>Taupunkt-Regel:</strong> Eine Kondensatbildung auf dem Beton führt bei EP/PU-Harzen zur sofortigen Enthaftung (Ablösen). Die Bauteiloberfläche muss mindestens 3 K wärmer sein als die Taupunkttemperatur.</li>
                            <li><strong>Witterung:</strong> Relative Luftfeuchte &lt; 80 % zur Vermeidung von Carbamatbildung (Klebriger Schleier an der Oberfläche von Epoxidharzen) einhalten.</li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                  
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_farben_lacke" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Nassschichtdicke und Verbrauch einer Fassadenfarbe"
          zielGleichung="d_{wet} = \frac{d_{dry}}{VS/100}, \quad V = \frac{d_{wet}}{1000}\,\text{l/m}^2"
          normQuelle="DIN EN ISO 2808 (Schichtdicke); Volumenfestkörper VS als Herstellerangabe"
          schritte={[
            { titel: '1. Gegeben', formel: 'd_{dry} = 80\\,\\mu\\text{m},\\; VS = 40\\,\\%', erklaerung: 'Ziel-Trockenschichtdicke einer OS-4-Deckbeschichtung (gesamt, zwei Anstriche).' },
            { titel: '2. Nassschichtdicke', formel: 'd_{wet} = 80 / 0{,}40 = 200\\,\\mu\\text{m}', erklaerung: 'Mit dem Nassschichtdickenkamm kontrollieren.' },
            { titel: '3. Theoretischer Verbrauch', formel: 'V = 200/1000 = 0{,}20\\,\\text{l/m}^2', erklaerung: '1 µm Nassfilm entspricht 1 ml/m².' },
            { titel: '4. Mit Verlusten (Rauheit, Rollen ca. 20 %)', formel: 'V_{prakt} \\approx 0{,}20 \\cdot 1{,}2 = 0{,}24\\,\\text{l/m}^2', erklaerung: 'Verlustfaktor als Lehrwert; Herstellerangaben beachten.' },
          ]}
          ergebnisHinweis="Je geringer der Festkörperanteil, desto dicker muss nass aufgetragen werden – zwei Anstriche sind meist sicherer als einer."
        />
      </div>

      <ModulTest moduleId="bp_farben_lacke" />

      <ModuleFooter
        wikipedia={[
          { title: 'Farbe', url: 'https://de.wikipedia.org/wiki/Farbe' },
          { title: 'Lack', url: 'https://de.wikipedia.org/wiki/Lack' },
          { title: 'Flüchtige organische Verbindungen (VOC)', url: 'https://de.wikipedia.org/wiki/Fl%C3%BCchtige_organische_Verbindungen' },
          { title: 'Silikatfarbe', url: 'https://de.wikipedia.org/wiki/Silikatfarbe' }
        ]}
        literatur={[
          'Goldschmidt, A.; Streitberger, H.-J.: BASF-Handbuch Lackiertechnik. Hannover: Vincentz Network 2014 (Farbe und Lack – Bibliothek)',
          'Brock, T.; Groteklaes, M.; Mischke, P.; Strehmel, B.: Lehrbuch der Lacktechnologie. 5., vollst. überarb. Aufl., Hannover: Vincentz Network 2017',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 12944 (Korrosionsschutz von Stahlbauten durch Beschichtungssysteme - Teile 1 bis 9)' },
          { title: 'Decopaint-Richtlinie 2004/42/EG (Begrenzung der Emissionen flüchtiger organischer Verbindungen)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN ISO 2409 (Beschichtungsstoffe - Gitterschnittprüfung)' },
          { title: 'DIN EN 1062-1 (Beschichtungsstoffe – Beschichtungssysteme für mineralische Untergründe und Beton im Außenbereich)' },
          { title: 'DIN EN 1504-2 und DAfStb TR Instandhaltung (Oberflächenschutzsysteme OS)' }
        ]}
        formeln={[
          {
            formel: 'd_{\\text{dry}} = d_{\\text{wet}} \\cdot \\frac{\\text{Festkörpervolumen}\\,[\\%]}{100}',
            erklaerung: 'Berechnung der Trockenschichtdicke d_dry [µm] aus Nassschichtdicke d_wet und Festkörpergehalt (VS-Wert) nach DIN EN ISO 2808.',
            quelle: 'DIN EN ISO 2808'
          },
          {
            formel: 'm_{\\text{VOC}} = \\frac{m_v}{V_{\\text{Produkt}}} \\le \\text{Grenzwert}_{\\text{Decopaint}} \\quad [\\text{g/l}]',
            erklaerung: 'VOC-Gehalt lösemittel- und wasserbasierter Anstrichstoffe zur Einhaltung der europäischen Grenzwerte (z.B. Innenwandfarben max. 30 g/l).',
            quelle: 'Richtlinie 2004/42/EG'
          }
        ]}
      />
    </div>
  );
}
