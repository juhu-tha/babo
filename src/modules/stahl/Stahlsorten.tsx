import { BookOpen, Sparkles, Layers, Flame, Activity, Scale, Check, TrendingDown } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { extendedSteelGrades, structuralProfiles } from './daten';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { Slider } from '@/src/components/ui/Slider';
import type { ExtendedSteelGrade, StructuralProfile } from './daten';
import type { Dispatch, SetStateAction } from 'react';

interface StahlsortenProps {
  activeGradedData: ExtendedSteelGrade;
  activeProfile: StructuralProfile;
  designMoment: number;
  filteredSteelGrades: ExtendedSteelGrade[];
  reinforcementDeepDiveTab: "bewehrung" | "spannstahl";
  selectedProfileId: string;
  selectedStahlsorteId: string;
  setDesignMoment: Dispatch<SetStateAction<number>>;
  setReinforcementDeepDiveTab: Dispatch<SetStateAction<"bewehrung" | "spannstahl">>;
  setSelectedProfileId: Dispatch<SetStateAction<string>>;
  setSelectedStahlsorteId: Dispatch<SetStateAction<string>>;
  setSteelCatalogFilter: Dispatch<SetStateAction<"baustahl" | "bewehrung" | "spannstahl" | "edelstahl" | "all">>;
  steelCatalogFilter: "baustahl" | "bewehrung" | "spannstahl" | "edelstahl" | "all";
}

export default function Stahlsorten({ activeGradedData, activeProfile, designMoment, filteredSteelGrades, reinforcementDeepDiveTab, selectedProfileId, selectedStahlsorteId, setDesignMoment, setReinforcementDeepDiveTab, setSelectedProfileId, setSelectedStahlsorteId, setSteelCatalogFilter, steelCatalogFilter }: StahlsortenProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* 1. Bezeichnungssystem nach DIN EN 10027-1 */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-shiraz/10 rounded-lg text-shiraz">
              <BookOpen size={18} />
            </div>
            <h3 className="text-lg font-bold text-text-main">Systematik der Stahlbezeichnung (DIN EN 10027-1)</h3>
          </div>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Baustähle werden im Bauwesen standardisiert benannt. Die Kurzbezeichnung schlüsselt mechanische Mindestwerte, technologische Zähigkeiten, Herstellungsverfahren und Lieferzustände präzise auf:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="font-black text-shiraz text-2xl mb-1">S</span>
              <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Stahltyp</span>
              <p className="text-xs text-text-main/85"><strong>Structural Steel:</strong> Kennzeichnet den herkömmlichen Verwendungszweck als tragender Baustahl.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="font-black text-shiraz text-2xl mb-1">355</span>
              <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Streckgrenze</span>
              <p className="text-xs text-text-main/85">Nennwert der Mindeststreckgrenze <InlineMath math="f_y" /> in N/mm² (MPa) für Bauteildicken <InlineMath math="t \le 16\text{ mm}" />.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="font-black text-shiraz text-2xl mb-1">J2</span>
              <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Zähigkeitsstufe</span>
              <p className="text-xs text-text-main/85">Kerbschlagarbeit mind. <strong>27 Joule</strong> bei <strong>-20 °C</strong>. Sichert das Tragwerk optimal gegen Sprödbruch.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="font-black text-shiraz text-2xl mb-1">+N</span>
              <span className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-1">Lieferzustand</span>
              <p className="text-xs text-text-main/85"><strong>Normalisierend gewalzt</strong> bzw. normalgeglüht (+N). Weitere Zustände: thermo-mechanisch (+M).</p>
            </div>
          </div>

          <div className="p-3.5 bg-shiraz/5 text-shiraz rounded-xl border border-shiraz/10 text-center font-mono text-xs md:text-sm font-bold flex items-center justify-center gap-2">
            <Sparkles size={16} /> Entschlüsseltes Praxisbeispiel: <span className="underline decoration-wavy text-text-main">S355J2+N</span> (Baustahl mit fy = 355 MPa, kerbschlagzäh bei -20°C, normalbehandelt)
          </div>
        </div>

        {/* 2. FACHWISSEN: BEWEHRUNGSSTÄHLE & SPANNSTÄHLE IM BETONBAU */}
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Fachwissen: Bewehrungsstähle &amp; Spannstähle im Beton- &amp; Spannbetonbau
                </h4>
                <p className="text-xs text-text-main/70">
                  Normative Grundlagen nach DIN 488, Spannstahl-Zulassungen (abZ; prEN 10138 nur Entwurf) und Eurocode 2 (DIN EN 1992-1-1)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button aria-pressed={reinforcementDeepDiveTab === 'bewehrung'}
                onClick={() => setReinforcementDeepDiveTab('bewehrung')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reinforcementDeepDiveTab === 'bewehrung' 
                      ? 'bg-shiraz text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Bewehrungsstähle (DIN 488 / EC2)
              </button>
              <button aria-pressed={reinforcementDeepDiveTab === 'spannstahl'}
                onClick={() => setReinforcementDeepDiveTab('spannstahl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reinforcementDeepDiveTab === 'spannstahl' 
                      ? 'bg-shiraz text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Spannstähle (abZ / prEN 10138)
              </button>
            </div>
          </div>

          {reinforcementDeepDiveTab === 'bewehrung' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Duktilitätsklasse A */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Klasse A</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">Normalduktil</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">B500A (z.B. Matten Q/R)</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      Kaltgezogen oder kaltgerippt. Für ebene, flächige Bauteile mit verteilten Lasten ohne seismische Anforderungen.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>ft/fy:</span>
                      <span className="font-bold text-slate-800">&ge; 1,05</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>&epsilon;_uk (Agt):</span>
                      <span className="font-bold text-slate-800">&ge; 2,5 %</span>
                    </div>
                  </div>
                </div>

                {/* Duktilitätsklasse B */}
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Klasse B</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">Hochduktil (Standard)</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">B500B (Betonstabstahl)</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      Warmgewalzt mit Thermex-Vergütung. Standard im Hoch- und Ingenieurbau zur Bildung plastischer Fließgelenke.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-emerald-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-emerald-900">
                      <span>ft/fy:</span>
                      <span className="font-bold">&ge; 1,08</span>
                    </div>
                    <div className="flex justify-between text-emerald-900">
                      <span>&epsilon;_uk (Agt):</span>
                      <span className="font-bold">&ge; 5,0 %</span>
                    </div>
                  </div>
                </div>

                {/* Duktilitätsklasse C */}
                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-800 uppercase tracking-wider">Klasse C</span>
                      <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-mono font-semibold">Erdbebenfest</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">B500C (Erdbebenstahl)</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      Höchste dissipative Rotationskapazität für seismische Zonen, Brückenpfeiler und Explosionsschutzbauwerke.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-purple-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-purple-900">
                      <span>ft/fy:</span>
                      <span className="font-bold">1,15 &dots; 1,35</span>
                    </div>
                    <div className="flex justify-between text-purple-900">
                      <span>&epsilon;_uk (Agt):</span>
                      <span className="font-bold">&ge; 7,5 %</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                  <strong className="text-text-main block text-xs uppercase tracking-wide">
                    Verbundwirkung: Rippenprofilierung &amp; Kraftübertragung
                  </strong>
                  <p className="text-text-main/80 leading-relaxed">
                    Glatter Rundstahl besitzt fast nur Haft- und Reibungsverbund. Betonstähle nach DIN 488 besitzen daher <strong>Schrägrippen</strong> (2- oder 4-reihig), sodass der Zementstein formschlüssig in die Rippenzwischenräume greift.
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[11px] text-center">
                    <InlineMath math="f_{bd} = 2{,}25 \cdot \eta_1 \cdot \eta_2 \cdot f_{ctd}" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <InlineMath math="\eta_1 = 1{,}0" /> für gute Verbundbedingungen (untere Bauteilhälfte); <InlineMath math="\eta_1 = 0{,}7" /> für mäßigen Verbund (oberste 25 cm wegen Wasseraufstieg/Bleeding).
                  </p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                  <strong className="text-text-main block text-xs uppercase tracking-wide">
                    Das Thermex-Verfahren (Tempcore)
                  </strong>
                  <p className="text-text-main/80 leading-relaxed">
                    Wie erreicht man hohe Festigkeit bei geringem Kohlenstoffgehalt (<InlineMath math="\le 0{,}22\%" /> für perfekte Schweißbarkeit)?
                  </p>
                  <p className="text-text-main/80 leading-relaxed">
                    Aus der Walzhitze (<InlineMath math="\approx 950^\circ\text{C}" />) durchläuft der Stab eine intensive Wasser-Kühlstrecke. Die äußere Randschicht kühlt schlagartig ab und wandelt sich in harten Martensit um. Der heiße Kern kühlt danach langsam an Luft ab und <strong>lässt die Randschicht von innen heraus thermisch an</strong>.
                  </p>
                  <div className="flex gap-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span>✓</span>
                    <span>Ergebnis: Zäher, elastischer Ferrit-Perlit-Kern mit hochfestem Anlassmartensit-Randring.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Erzeugnisform Litzen */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spannlitzen</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-3 / abZ</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">Y1860 S7 (7-drähtig)</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      6 schraubenförmig um 1 Kerndraht verseilte Runddrähte. Höchste Flexibilität für gekrümmte Spanngliedführungen in Brückenüberbauten.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>fpk (Zugfestigkeit):</span>
                      <span className="font-bold text-shiraz">1860 N/mm²</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>fp0,1k (0,1%-Grenze):</span>
                      <span className="font-bold text-slate-800">1600 N/mm²</span>
                    </div>
                  </div>
                </div>

                {/* Erzeugnisform Stäbe */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spannstäbe</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-4 / abZ</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">SAS 670 / SAS 950</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      Warmgewalzter Rundstahl mit aufgewalzten Gewinderippen. Beliebiges bauseitiges Ablängen und Koppelung mittels Gewindemuffen.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Durchmesser:</span>
                      <span className="font-bold text-slate-800">18 &dots; 47 mm</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Einsatz:</span>
                      <span className="font-bold text-slate-800">Geotechnik / Quervorsp.</span>
                    </div>
                  </div>
                </div>

                {/* Erzeugnisform Drähte */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Spanndrähte</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">prEN 10138-2 / abZ</span>
                    </div>
                    <div className="text-sm font-bold text-text-main">Y1770 C (Einzeldraht)</div>
                    <p className="text-xs text-text-main/75 leading-relaxed">
                      Kaltgezogene Einzeldrähte, glatt oder profiliert. Standard für Spannbeton-Eisenbahnschwellen und Hohlkörper-Deckenplatten.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>fpk (Zugfestigkeit):</span>
                      <span className="font-bold text-slate-800">1570 &dots; 1770 N/mm²</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Verfahren:</span>
                      <span className="font-bold text-slate-800">Sofortiger Verbund</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                  <strong className="text-text-main block text-xs uppercase tracking-wide">
                    Spannungsrelaxation unter Dauerlast (EC2 Gl. 3.28–3.30)
                  </strong>
                  <p className="text-text-main/80 leading-relaxed">
                    Unter hoher konstanter Vorspannung (<InlineMath math="\sigma_{p0} \approx 0{,}7 \dots 0{,}8 f_{pk}" />) wandern Versetzungen kontinuierlich weiter. Dadurch sinkt die elastische Zugspannung zeitabhängig ab – ohne dass sich die Bauteillänge ändert!
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                    <InlineMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} \approx 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75(1-\mu)}" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Moderne Spannlitzen erfüllen <strong>Klasse 2 (sehr niedrige Relaxation)</strong> mit einem 1000-Stunden-Verlust von <InlineMath math="\rho_{1000} \le 2{,}5\%" /> bei 20 °C.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-2">
                  <strong className="text-rose-900 block text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Flame className="text-rose-600 h-4 w-4" />
                    Sicherheitskritisches Schweißverbot für Spannstähle!
                  </strong>
                  <p className="text-rose-950/85 leading-relaxed">
                    <strong>WARUM DARF AN SPANNSTAHL UNTER KEINEN UMSTÄNDEN GESCHWEISST WERDEN?</strong>
                  </p>
                  <p className="text-rose-950/85 leading-relaxed">
                    Spannstahl besitzt ca. <strong>0,80 bis 0,85 % Kohlenstoff</strong> und eine durch mehrfaches Kaltziehen erzeugte feinfaserige Kristalltextur.
                  </p>
                  <p className="text-rose-950/85 leading-relaxed">
                    Bereits ein minimaler Funkenüberschlag (Lichtbogenzündung) erhitzt den Stahl über die Austenitisierungstemperatur. Das umliegende kalte Material kühlt die Stelle blitzartig ab (Selbstabschreckung). Es entsteht <strong>glasharter, extrem spröder Martensit mit Mikrorissen</strong>. Unter der gigantischen Vorspannung reißt das Spannglied schlagartig und ohne Vorwarnung ab!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Detaillierter Stahlsorten-Katalog mit Reitern & Kategorien-Filter */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-3">
            <h4 className="font-bold text-text-main text-base flex items-center gap-2">
              <Layers size={18} className="text-shiraz" /> Register der Stahlwerkstoffe ({filteredSteelGrades.length} Güten)
            </h4>

            {/* Kategorie Filter-Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button aria-pressed={steelCatalogFilter === 'all'}
                onClick={() => setSteelCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'all'
                      ? 'bg-shiraz text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Alle ({extendedSteelGrades.length})
              </button>
              <button aria-pressed={steelCatalogFilter === 'baustahl'}
                onClick={() => setSteelCatalogFilter('baustahl')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'baustahl'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                  }`}
              >
                Baustähle ({extendedSteelGrades.filter(g => g.category === 'baustahl').length})
              </button>
              <button aria-pressed={steelCatalogFilter === 'bewehrung'}
                onClick={() => setSteelCatalogFilter('bewehrung')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'bewehrung'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
              >
                Bewehrungsstähle ({extendedSteelGrades.filter(g => g.category === 'bewehrung').length})
              </button>
              <button aria-pressed={steelCatalogFilter === 'spannstahl'}
                onClick={() => setSteelCatalogFilter('spannstahl')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'spannstahl'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
              >
                Spannstähle ({extendedSteelGrades.filter(g => g.category === 'spannstahl').length})
              </button>
              <button aria-pressed={steelCatalogFilter === 'edelstahl'}
                onClick={() => setSteelCatalogFilter('edelstahl')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    steelCatalogFilter === 'edelstahl'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                  }`}
              >
                Edelstähle ({extendedSteelGrades.filter(g => g.category === 'edelstahl').length})
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Linke Spalte: Stahlsorten-Selector */}
            <div className="lg:w-1/3 flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredSteelGrades.map((gradeItem) => (
                  <button aria-pressed={selectedStahlsorteId === gradeItem.id}
                    key={gradeItem.id}
                    onClick={() => setSelectedStahlsorteId(gradeItem.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-start cursor-pointer hover:shadow-sm ${
                        selectedStahlsorteId === gradeItem.id
                          ? 'bg-shiraz border-shiraz text-white shadow-md shadow-shiraz/10'
                          : 'bg-slate-50/50 border-slate-100 text-text-main hover:bg-slate-100/50'
                      }`}
                    id={`steel-selector-btn-${gradeItem.id}`}
                  >
                    <span className="font-bold text-sm md:text-base flex items-center gap-1.5 w-full justify-between">
                      <span>{gradeItem.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          selectedStahlsorteId === gradeItem.id
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                        {gradeItem.categoryLabel}
                      </span>
                    </span>
                    <span className={`text-xs mt-1 font-normal line-clamp-1 ${
                        selectedStahlsorteId === gradeItem.id ? 'text-white/80' : 'text-slate-500'
                      }`}>
                      {gradeItem.sub.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rechte Spalte: Steckbrief der ausgewählten Güte */}
            <div className="lg:w-2/3 bg-slate-50/40 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
              <div className="border-b border-home-grau/20 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="text-xl font-bold text-text-main">{activeGradedData.name}</h4>
                  <div className="flex gap-2">
                    <span className="bg-shiraz/10 text-shiraz font-mono text-xs px-2.5 py-1 rounded-full font-bold">
                      W.-Nr. {activeGradedData.werkstoffnummer}
                    </span>
                    <span className="bg-slate-200/70 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-full">
                      {activeGradedData.density}
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-shiraz font-semibold tracking-wide flex items-center gap-1">
                  <Sparkles size={12} /> {activeGradedData.sub}
                </p>
              </div>

              <p className="text-sm text-text-main/90 leading-relaxed font-normal">
                {activeGradedData.description}
              </p>

              {/* Gefügedaten & Werkstoffkenngrößen als Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streckgrenze fy</span>
                  <span className="text-base font-bold text-shiraz font-mono mt-0.5">{formatDeWert(activeGradedData.fy)} MPa</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Mindestfließgrenze</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zugfestigkeit fu</span>
                  <span className="text-base font-bold text-text-main font-mono mt-0.5">{formatDeWert(activeGradedData.fu)} MPa</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Bruchspannung</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">C-Gehalt</span>
                  <span className="text-base font-bold text-text-main font-mono mt-0.5">{activeGradedData.carbonContent}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Max. Massenanteil</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schweißbarkeit</span>
                  <span className="text-xs font-bold text-teal-600 mt-1 line-clamp-1">{activeGradedData.weldability.split(';')[0]}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Technologische Eignung</span>
                </div>
              </div>

              {/* Anwendungen & Vorteile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h5 className="font-bold text-text-main text-xs uppercase tracking-wider text-slate-500 pb-1.5 border-b border-dashed border-slate-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span> Typische Anwendungen
                  </h5>
                  <ul className="text-xs text-text-main/80 space-y-2 list-none font-normal">
                    {activeGradedData.applications.map((app, uidx) => (
                      <li key={uidx} className="flex gap-1.5 items-start">
                        <span className="text-shiraz shrink-0 font-bold">✓</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h5 className="font-bold text-text-main text-xs uppercase tracking-wider text-slate-500 pb-1.5 border-b border-dashed border-slate-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span> Werkstofftechnische Vorteile
                  </h5>
                  <ul className="text-xs text-text-main/80 space-y-2 list-none font-normal">
                    {activeGradedData.advantages.map((adv, adidx) => (
                      <li key={adidx} className="flex gap-1.5 items-start">
                        <span className="text-teal-600 shrink-0 font-bold">✓</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reales Referenzobjekt (Beispiel) */}
              <div className="bg-shiraz/[0.02] p-4 rounded-xl border border-shiraz/10 shadow-sm mt-1 space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-shiraz/5 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-shiraz/10 text-shiraz rounded">
                      <Activity size={12} />
                    </div>
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider">Praxis- &amp; Referenzbeispiel für {activeGradedData.name}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">{activeGradedData.exampleObject.location}</span>
                </div>
                <div>
                  <h6 className="font-bold text-sm text-text-main mb-1">{activeGradedData.exampleObject.name}</h6>
                  <p className="text-xs text-text-main/85 leading-relaxed font-normal">
                    {activeGradedData.exampleObject.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Interaktives Dimensionierungsbeispiel & Materialeffizienz */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-150">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-shiraz/10 rounded-lg text-shiraz">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main">Interaktives Dimensionierungsbeispiel &amp; CO₂-Bilanz</h3>
                <p className="text-xs text-text-main/70">Wahl der Stahlsorte zur Gewichtsreduktion und Erhöhung der materialeffizienten Tragfähigkeit</p>
              </div>
            </div>
          </div>

          {/* Eingabeparameter Steuerungen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  1. Gewähltes Trägerprofil (Walzstahl)
                </label>
                <span className="text-xs bg-shiraz/10 text-shiraz font-semibold px-2 py-0.5 rounded">
                  {activeProfile.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {structuralProfiles.map((prof) => (
                  <button aria-pressed={selectedProfileId === prof.id}
                    key={prof.id}
                    onClick={() => setSelectedProfileId(prof.id)}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-colors cursor-pointer ${
                        selectedProfileId === prof.id
                          ? 'bg-shiraz text-white border-shiraz font-bold'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-100'
                      }`}
                    id={`profile-selector-${prof.id}`}
                  >
                    <div className="font-bold">{prof.name}</div>
                    <div className={`text-[10px] mt-0.5 font-normal ${selectedProfileId === prof.id ? 'text-white/80' : 'text-slate-400'}`}>
                      Wpl: {formatDeWert(prof.Wpl_y)} cm³, Gew: {formatDeWert(prof.weight)} kg/m
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  2. Bemessungsbiegemoment <InlineMath math="M_{Ed}" />
                </label>
                <span className="text-sm font-black text-shiraz bg-white px-2.5 py-1 rounded border shadow-sm font-mono">
                  {formatDeWert(designMoment)} kNm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400">10 kNm</span>
                <div className="flex-1">
                  <Slider
                    label="Momentenbeanspruchung"
                    min={10}
                    max={600}
                    step={5}
                    value={designMoment}
                    onChange={(e) => setDesignMoment(Number(e.target.value))}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400">600 kNm</span>
              </div>
              <p className="text-[10px] text-slate-500 font-normal">
                * Entspricht der maximalen Biegungsbeanspruchung im Feld eines Einfeldträgers durch äußere Lasten. Es gilt d. Tragsicherheitsnachweis: <InlineMath math="M_{Ed} \le M_{pl,Rd}" />.
              </p>
            </div>
          </div>

          {/* Live Vergleichsergebnisse */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-shiraz" /> Live-Festigkeitsvergleich des Profils {activeProfile.name} in Abhängigkeit der Stahlgüten:
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-xs md:text-sm text-left font-sans">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">Stahlgüte</th>
                    <th className="px-4 py-3 text-center">Faktor fy</th>
                    <th className="px-4 py-3">Plastischer Momentenwiderstand Mpl,Rd</th>
                    <th className="px-4 py-3">Zentrische Normalkraftkapazität Npl,Rd</th>
                    <th className="px-4 py-3 text-center">Tragfähigkeits-Status</th>
                    <th className="px-4 py-3 text-right">Massen-Effizienz (Rel.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {['S235', 'S355', 'S460', 'S690'].map((gradeId) => {
                    const associatedGrade = extendedSteelGrades.find(g => g.id === gradeId)!;
                    const fyValue = associatedGrade.fy;
                    const m_pl_rd = (activeProfile.Wpl_y * fyValue) / 1000;
                    const n_pl_rd = (activeProfile.Area * fyValue) / 10;
                    const isSufficient = m_pl_rd >= designMoment;
                    const relativeGain = ((fyValue - 235) / 235) * 100;

                    return (
                      <tr key={gradeId} className={`hover:bg-slate-50/50 transition-colors ${selectedStahlsorteId === gradeId ? 'bg-shiraz/[0.03] font-semibold' : ''}`}>
                        <td className="px-4 py-3 font-bold">
                          <span className="flex items-center gap-1.5">
                            {gradeId}
                            {selectedStahlsorteId === gradeId && (
                              <span className="w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-slate-600">{formatDeWert(fyValue)} N/mm²</td>
                        <td className="px-4 py-3 font-mono font-bold text-shiraz">
                          {formatDeZahl(m_pl_rd, 1)} kNm
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-mono">
                          {formatDeZahl(n_pl_rd, 0)} kN
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          {isSufficient ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                              <Check size={10} className="stroke-[3px]" /> Erreicht (OK)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] px-2.5 py-1 rounded-full border border-red-200">
                              ✕ Nicht ausr.
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-teal-600">
                          {gradeId === 'S235' ? 'Basisreferenz' : `+${formatDeZahl(relativeGain, 1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CO2- & Material-Ökobilanz visualisieren */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Scale size={11} className="text-shiraz" /> Tragwerkseigengewicht
              </span>
              <span className="text-xl font-mono font-black text-text-main">{formatDeZahl(activeProfile.weight, 1)} kg/m </span>
              <span className="text-[11px] text-slate-500 font-normal">Trägerlänge unbeeinflusst vom Stahlwerkstoff.</span>
            </div>

            <div className="flex flex-col gap-1 border-y md:border-y-0 md:border-x border-slate-200 md:px-4 py-2 md:py-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingDown size={11} className="text-teal-600" /> Profilhöhen-Reduzierung (S235 vs. S690)
              </span>
              <span className="text-xl font-bold text-teal-600 font-mono">
                -33,3 %
              </span>
              <span className="text-[11px] text-slate-500 leading-normal font-normal">
                IPE 300 (42,2 kg) kann beansprucht wie IPE 200 (22,4 kg) in S690 ausgeführt werden!
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Flame size={11} className="text-shiraz" /> CO₂-Emissionsvorteil bei Optimierung
              </span>
              <span className="text-xl font-mono font-black text-emerald-600">
                ~ {formatDeZahl(((activeProfile.weight * 1.8) * 0.45), 1)} kg CO₂ / m
              </span>
              <span className="text-[11px] text-slate-500 leading-normal font-normal">
                Vermeidete CO₂-Emissionen durch d. verringerten Vormaterialbedarf (Emissionsbasis: 1,8 kg CO₂/kg Baustahl).
              </span>
            </div>
          </div>
        </div>
      </div>
    );
}
