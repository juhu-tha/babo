// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import React from 'react';
import { Wrench, Info } from 'lucide-react';
import inhalt from '@/content/stahlbetoninstandhaltung/ProdukteTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface ProdukteTabProps {
  productApp: 'wall' | 'deck' | 'balcony' | 'sewage';
  setProductApp: React.Dispatch<React.SetStateAction<'wall' | 'deck' | 'balcony' | 'sewage'>>;
  setStatikRequired: React.Dispatch<React.SetStateAction<boolean>>;
  statikRequired: boolean;
}

export default function ProdukteTab({ productApp, setProductApp, setStatikRequired, statikRequired }: ProdukteTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-home-grau/30 text-text-main p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-text-main text-base flex items-center gap-2">
          <Wrench className="text-shiraz" size={20} /><MdText text={inhalt.texte.systematikDerInstandsetzungsprodukteBeto} /></h3>
        <p className="text-xs text-text-main/70 mt-1 leading-relaxed border-t border-home-grau/20 pt-2"><MdText text={inhalt.texte.jeNachSchadensbildStatischer} /></p>
      </div>

      {/* Mörtelsysteme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inhalt.daten.ProdukteTab.map((m, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border ${m.color} shadow-sm space-y-3 flex flex-col justify-between`}>
            <div>
              <h4 className="font-extrabold text-base text-slate-950">{m.title}</h4>
              <span className="text-xs text-slate-500 block uppercase font-mono font-bold tracking-wide">{m.sub}</span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[55px]">{m.desc}</p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-home-grau/30 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Bindemittel:</span>
                <strong className="font-semibold text-slate-800">{m.binder}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schichtdicke:</span>
                <span className="font-mono text-xs text-slate-800">{m.thickness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">E-Modul:</span>
                <span className="font-mono text-xs text-slate-800">{m.eMod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schwindmaß:</span>
                <span className="text-slate-800">{m.shrink}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Selector & Comparison table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Product Finder Panel */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-home-grau/25 shadow-sm space-y-4">
          <div className="border-b border-home-grau/30 pb-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-shiraz"><MdText text={inhalt.texte.interaktiverSystemFinder} /></h4>
            <p className="text-xs text-home-grau"><MdText text={inhalt.texte.ermittelnSieDasPassende} /></p>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Select Application area */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5"><MdText text={inhalt.texte.t1BauteiltypBelastungsszenario} /></label>
              <div className="space-y-2">
                {inhalt.daten.ProdukteTab_2.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProductApp(item.id as "wall" | "deck" | "balcony" | "sewage")}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${productApp === item.id ? 'bg-shiraz/5 border-shiraz font-bold' : 'bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-xs text-slate-500 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Statische Mitwirkung */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5"><MdText text={inhalt.texte.t2StatischeMitwirkungErforderlich} /></label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatikRequired(true)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all ${statikRequired ? 'bg-shiraz text-white border-shiraz font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                ><MdText text={inhalt.texte.jaTragend} /></button>
                <button
                  type="button"
                  onClick={() => setStatikRequired(false)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all ${!statikRequired ? 'bg-shiraz text-white border-shiraz font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  style={{ background: !statikRequired ? '#1e293b' : '', color: !statikRequired ? '#ffffff' : '', borderColor: !statikRequired ? '#1e293b' : '' }}
                ><MdText text={inhalt.texte.neinNichtTragend} /></button>
              </div>
            </div>

            {/* Finder Recommendation Output */}
            {(() => {
              let recommendedType = '';
              let mortarClass = '';
              let detailDesc = '';
              let minBond = '';
              let protectiveMeasure = '';

              if (productApp === 'wall') {
                if (statikRequired) {
                  recommendedType = inhalt.werte.pccIiSpcc;
                  mortarClass = inhalt.werte.r4StatischRelevant;
                  detailDesc = inhalt.werte.verwendungVonSpritzbaremOder;
                  minBond = inhalt.werte.t20MpaNach;
                  protectiveMeasure = inhalt.werte.osSystemZB;
                } else {
                  recommendedType = inhalt.werte.ccMörtelOderPcc;
                  mortarClass = inhalt.werte.r3StatischRelevantOder;
                  detailDesc = inhalt.werte.händischerEinbauEinesCc;
                  minBond = '≥ 1,5 MPa';
                  protectiveMeasure = inhalt.werte.standardAcrylatbeschichtungPrinzipC;
                }
              } else if (productApp === 'deck') {
                recommendedType = inhalt.werte.pccIFließmörtelPc;
                mortarClass = inhalt.werte.r4ExtremVerschleißfest;
                detailDesc = inhalt.werte.hoheAnforderungenAnDynamische;
                minBond = '≥ 2,0 MPa';
                protectiveMeasure = inhalt.werte.zwingendOs8Oder;
              } else if (productApp === 'sewage') {
                recommendedType = inhalt.werte.pcMörtelEpoxidharzmörtel;
                mortarClass = inhalt.werte.r4ChemischBeständigPh;
                detailDesc = inhalt.werte.säurenImAbwasserZerstören;
                minBond = inhalt.werte.t20MpaHaftuntergrund;
                protectiveMeasure = inhalt.werte.chemischeBeschichtungOderGfk;
              } else {
                recommendedType = inhalt.werte.pccHändischerRmMörtel;
                mortarClass = inhalt.werte.r2R3NichtStatisch;
                detailDesc = inhalt.werte.kosmetischeAusbrücheImAußenbereich;
                minBond = inhalt.werte.t08Bis1;
                protectiveMeasure = inhalt.werte.dünnerCarbonatisierungsbremsenderSchutza;
              }

              return (
                <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl space-y-2 mt-2">
                  <div className="text-xs">
                    <span className="text-slate-500 uppercase block font-bold text-xs"><MdText text={inhalt.texte.empfohleneSystematik} /></span>
                    <strong className="text-sm font-bold text-slate-900 block mt-0.5">{recommendedType}</strong>
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-shiraz/10 text-shiraz font-semibold text-xs rounded-md">{mortarClass}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-800 border-t border-home-grau/30 pt-1.5">{detailDesc}</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-home-grau/30 text-xs">
                    <div>
                      <span className="text-slate-500 block">Mindesthaftzugfestigkeit:</span>
                      <strong className="font-semibold text-slate-800 font-mono">{minBond}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Zusatzschutz:</span>
                      <strong className="font-semibold text-slate-800">{protectiveMeasure}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Requirement Matrix Table */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-home-grau/25 shadow-sm space-y-3">
          <div className="border-b border-home-grau/30 pb-2 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-800"><MdText text={inhalt.texte.prüfnachweiseMindestAnforderungen} /></h4>
              <p className="text-xs text-home-grau"><MdText text={inhalt.texte.technischeLeistungskriterienNachDin} /></p>
            </div>
            <span className="text-xs bg-slate-100 font-mono px-2 py-0.5 rounded font-bold">Instandsetzungs-Zulassung</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-home-grau/30 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-2 font-bold">Leistungsmerkmal</th>
                  <th className="p-2 text-center">Klasse R1</th>
                  <th className="p-2 text-center">Klasse R2</th>
                  <th className="p-2 text-center font-bold text-slate-800 bg-slate-100/50">Klasse R3</th>
                  <th className="p-2 text-center font-bold text-shiraz bg-shiraz/5">Klasse R4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
                <tr>
                  <td className="p-2 font-bold text-slate-800"><MdText text={inhalt.texte.druckfestigkeitMpa} /></td>
                  <td className="p-2 text-center font-mono">≥ 10</td>
                  <td className="p-2 text-center font-mono">≥ 15</td>
                  <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 25</td>
                  <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 45</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-800"><MdText text={inhalt.texte.chloridgehalt} /></td>
                  <td className="p-2 text-center font-mono">≤ 0,05</td>
                  <td className="p-2 text-center font-mono">≤ 0,05</td>
                  <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≤ 0,05</td>
                  <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≤ 0,05</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-800"><MdText text={inhalt.texte.adhäsionsHaftzugMpa} /></td>
                  <td className="p-2 text-center font-mono">-</td>
                  <td className="p-2 text-center font-mono">≥ 0,8</td>
                  <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 1,5</td>
                  <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 2,0</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-800">Karbonatisierungswid.</td>
                  <td className="p-2 text-center text-slate-400">Keine Anf.</td>
                  <td className="p-2 text-center text-slate-400">Keine Anf.</td>
                  <td className="p-2 text-center font-semibold text-emerald-700 bg-slate-100/40">Erforderlich</td>
                  <td className="p-2 text-center font-semibold text-emerald-700 bg-shiraz/5">Erforderlich</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-800"><MdText text={inhalt.texte.modulElastizitätGpa} /></td>
                  <td className="p-2 text-center">-</td>
                  <td className="p-2 text-center">-</td>
                  <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 15</td>
                  <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 20</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-rose-50/50 border border-shiraz/20 p-3 rounded-lg text-slate-850 text-xs leading-relaxed space-y-1 mt-3">
            <div className="font-bold text-shiraz flex items-center gap-1">
              <Info size={13} />
              Regelwerkzusammenhang:
            </div>
            <p><MdText text={inhalt.texte.dieKlassenR3Und} /></p>
          </div>
        </div>

      </div>
    </div>
  );
}
