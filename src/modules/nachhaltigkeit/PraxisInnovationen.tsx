import { HardHat, Landmark, FileText, Recycle, Layers, Building, FileSpreadsheet, BookOpen } from 'lucide-react';
import PraxisGebaeudetypE from './PraxisGebaeudetypE';
import { InlineMath } from 'react-katex';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/PraxisInnovationen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { biogenesCo2DinEn16449 } from '@/src/calc/holzphysik';
import { KVH_LEHR_ROHDICHTE } from '@/src/data/gwpLehrwerte';
import { formatDeZahl } from '@/src/utils/numberFormat';

/** Umsetzung 30.10.2026 (DSB-LR-2): Holzvolumen des Leuchtturmprojekts und biogener Speicher nach DIN EN 16449, auf 100 t gerundet */
const LEUCHTTURM_HOLZ_M3 = 1800;
const LEUCHTTURM_CO2_T = Math.round(biogenesCo2DinEn16449(KVH_LEHR_ROHDICHTE, 12, LEUCHTTURM_HOLZ_M3) / 1000 / 100) * 100;

interface PraxisInnovationenProps {
  praxisCategory: "gebaeudetyp_e" | "urban_mining" | "lehmbau" | "holz_hybrid";
  setPraxisCategory: Dispatch<SetStateAction<"gebaeudetyp_e" | "urban_mining" | "lehmbau" | "holz_hybrid">>;
}

export default function PraxisInnovationen({ praxisCategory, setPraxisCategory }: PraxisInnovationenProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
            <HardHat size={12} className="text-shiraz" /><MdText text={inhalt.texte.bauwendeInDerPraxis} /></span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Landmark className="text-shiraz" size={24} /><MdText text={inhalt.texte.praxisSuffizienzGebäudetypE} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.überregulierungAbbauenMaterialkreisläufe} /></p>
          </div>
        </div>

        {/* Subnavigation Tabs for Praxis */}
        <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-3">
          {[
            { id: 'gebaeudetyp_e', label: inhalt.werte.t1GebäudetypEEinfach, icon: FileText, desc: inhalt.werte.gesetzesvorhabenBadAibling },
            { id: 'urban_mining', label: inhalt.werte.t2UrbanMiningMaterialpässe, icon: Recycle, desc: inhalt.werte.rathausKorbachNeuesMuseum },
            { id: 'lehmbau', label: inhalt.werte.t3TragenderLehmbauDin, icon: Layers, desc: inhalt.werte.normenreihe2023Sfk3 },
            { id: 'holz_hybrid', label: inhalt.werte.t4HolzHybridLeuchttürme, icon: Building, desc: inhalt.werte.timberPioneerPrinzEugen }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = praxisCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPraxisCategory(tab.id as "lehmbau" | "gebaeudetyp_e" | "urban_mining" | "holz_hybrid")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
                    isActive
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                  }`}
              >
                <TabIcon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategory Content 1: Gebäudetyp E & Einfach Bauen */}
        {praxisCategory === 'gebaeudetyp_e' && <PraxisGebaeudetypE />}

        {/* Subcategory Content 2: Urban Mining & Materialpässe */}
        {praxisCategory === 'urban_mining' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3">
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.urbanMiningReUse} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.dasBauwerkAlsTemporäres} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Fallbeispiel Rathaus Korbach */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded"><MdText text={inhalt.texte.pionierprojektHessen} /></span>
                    <span className="text-xs font-mono font-bold text-slate-500">60 % Re-Use</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.rathausKorbachInSitu} /></h4>
                  <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beimAbbruchDesRathauserweiterungsbaus} /></p>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li><MdText text={inhalt.texte.vermeidungVonHundertenLkw} /></li>
                    <li><MdText text={inhalt.texte.erfolgreicherEinsatzVonR} /></li>
                    <li><MdText text={inhalt.texte.vorbildcharakterFürKommunaleAusschreibun} /></li>
                  </ul>
                </div>

                {/* Fallbeispiel Neues Museum Berlin */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded"><MdText text={inhalt.texte.kulturerbeZirkularität} /></span>
                    <span className="text-xs font-mono font-bold text-slate-500"><MdText text={inhalt.texte.t375000Ziegel} /></span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.neuesMuseumBerlinDavid} /></h4>
                  <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beimDenkmalgerechtenWiederaufbauDes} /></p>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li><MdText text={inhalt.texte.höchsteRessourcenschonungDurchEchtes} /></li>
                    <li><MdText text={inhalt.texte.verbindungHistorischerBausubstanzMit} /></li>
                    <li><MdText text={inhalt.texte.nullGraueEnergieFür} /></li>
                  </ul>
                </div>

              </div>

              {/* Materialpässe & Madaster Box */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-blue-700 shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong className="block font-bold mb-0.5"><MdText text={inhalt.texte.digitaleMaterialpässeMadasterPlattform} /></strong><MdText text={inhalt.texte.derMaterialpassDokumentiertArt} /></div>
                </div>
                <span className="shrink-0 px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs"><MdText text={inhalt.texte.designForDisassembly} /></span>
              </div>

            </div>

          </div>
        )}

        {/* Subcategory Content 3: Tragender Lehmbau nach DIN 18940 */}
        {praxisCategory === 'lehmbau' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.tragenderLehmbauNachDin} /></h3>
                  <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.konstruktionBemessungUndAusführung} /></p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  DIN 18940
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Normdetails (7-cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.mitDerVeröffentlichungDer} /></p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.schlankeWandstärken} /></strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.stattDerFrüherÜblichen} /></p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.druckfestigkeitsklasseSfk3} /></strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.fürTragendesMauerwerkSind} /></p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.brandschutzKlasseA1} /></strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.mineralischeLehmbaustoffeSindRein} /></p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.t100ZirkulärC2c} /></strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.lehmBindetPhysikalischDurch} /></p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                    <span><MdText text={inhalt.texte.ökobilanzEffektGegenüberGebrannten} /></span>
                    <strong className="font-mono font-bold text-emerald-800 text-sm"><MdText text={inhalt.texte.t85Bis90Primärenergie} /></strong>
                  </div>
                </div>

                {/* Right: Normenmatrix Lehmbau (5-cols) */}
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.dieDeutscheLehmbauNormenfamilie} /></h4>
                  <div className="text-[11px] space-y-2 text-slate-700">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono"><MdText text={inhalt.texte.din18940202306} /></strong>
                      <span><MdText text={inhalt.texte.tragendesLehmsteinmauerwerkKonstruktionB} /></span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono"><MdText text={inhalt.texte.din18945201812} /></strong>
                      <span><MdText text={inhalt.texte.lehmsteineBegriffeAnforderungenUnd} /></span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono"><MdText text={inhalt.texte.din18946201812} /></strong>
                      <span><MdText text={inhalt.texte.lehmmauermörtelBegriffeAnforderungenUnd} /></span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono"><MdText text={inhalt.texte.din18947201812} /></strong>
                      <span><MdText text={inhalt.texte.lehmputzmörtelBegriffeAnforderungenUnd} /></span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono"><MdText text={inhalt.texte.din18948201812} /></strong>
                      <span><MdText text={inhalt.texte.lehmplattenBegriffeAnforderungenUnd} /></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Subcategory Content 4: Holz- & Hybrid-Leuchttürme */}
        {praxisCategory === 'holz_hybrid' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3">
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.großmaßstäblicherHolzHolzHybridbau} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.herausragendeIngenieurbauwerkeUndÖkologi} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Prinz-Eugen-Park München */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start"><MdText text={inhalt.texte.münchen30Hektar} /></span>
                    <h4 className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.prinzEugenParkÖkologische} /></h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieDerzeitGrößteZusammenhängende} /></p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold"><MdText text={inhalt.texte.vorzeigeprojektFürKommunalenKlimaschutz} /></div>
                </div>

                {/* Timber Pioneer Frankfurt */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded self-start"><MdText text={inhalt.texte.frankfurt14100M} /></span>
                    <h4 className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.timberPioneerEuropaviertel} /></h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.erstesHolzHybridBürogebäude.replace('{co2Speicher}', formatDeZahl(LEUCHTTURM_CO2_T, 0))} /></p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold"><MdText text={inhalt.texte.t57GewichtsersparnisBeiDecken} /></div>
                </div>

                {/* Schmuttertal-Gymnasium Diedorf */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded self-start"><MdText text={inhalt.texte.diedorfPlusenergiehaus} /></span>
                    <h4 className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.schmuttertalGymnasiumNaglerKaufmann} /></h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.vierBaukörperInModularer} /></p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold"><MdText text={inhalt.texte.architekturVorbildFürSchulbauten} /></div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    );
}
