// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Bug } from 'lucide-react';
import inhalt from '@/content/dauerhaftigkeit/TimberDurabilitySimulator.json';
import { MdText } from '@/src/components/inhalt/MdText';

export function TimberDurabilitySimulator() {
  const [inHeated, setInHeated] = useState<boolean>(true);
  const [humidityRisk, setHumidityRisk] = useState<boolean>(false);
  const [directWeather, setDirectWeather] = useState<boolean>(false);
  const [groundContact, setGroundContact] = useState<boolean>(false);
  const [freshwater, setFreshwater] = useState<boolean>(false);
  const [showTimberPath, setShowTimberPath] = useState<boolean>(false);

  // Derive Gebrauchsklasse (GK) based on DIN 68800-1
  const getGK = () => {
    if (groundContact || freshwater) {
      return inhalt.daten.getGK;
    }
    if (directWeather) {
      return inhalt.daten.getGK_2;
    }
    if (!inHeated && humidityRisk) {
      return inhalt.daten.getGK_3;
    }
    if (!inHeated) {
      return inhalt.daten.getGK_4;
    }
    return inhalt.daten.getGK_5;
  };

  const gkInfo = getGK();

  const woodSuitability = inhalt.daten["TimberDurabilitySimulator.woodSuitability"];

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="text-shiraz w-5 h-5" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base"><MdText text={inhalt.texte.din68800BestimmerHolz} /></h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.gebrauchsklassenGkBestimmenDas} /></p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Checkbox Inputs */}
        <div className="lg:col-span-5 bg-slate-50 border border-home-grau/30 p-4 rounded-xl space-y-3">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Umgebungskriterien</span>
          
          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={inHeated}
              onChange={(e) => {
                setInHeated(e.target.checked);
                if (e.target.checked) {
                  setDirectWeather(false);
                  setGroundContact(false);
                  setFreshwater(false);
                }
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.beheizterStändigGeschlossenerInnenraum} /></span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={humidityRisk}
              onChange={(e) => setHumidityRisk(e.target.checked)}
              disabled={inHeated}
              className="accent-shiraz shrink-0"
            />
            <span className={`text-slate-700 ${inHeated ? 'opacity-40' : 'font-medium'}`}><MdText text={inhalt.texte.gefahrZeitweiserBefeuchtungNassraum} /></span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={directWeather}
              onChange={(e) => {
                setDirectWeather(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.außenbereichBewittertDirektregen} /></span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={groundContact}
              onChange={(e) => {
                setGroundContact(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.direkterErdkontakt} /></span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={freshwater}
              onChange={(e) => {
                setFreshwater(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.ständigerKontaktMitSüßwasser} /></span>
          </label>
        </div>

        {/* Dynamic Result Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-100 border border-home-grau/30 p-4 rounded-xl space-y-1.5 text-slate-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-white text-xs px-2.5 py-0.5 rounded-full font-black font-mono">
                {gkInfo.gk}
              </span>
              <span className="text-xs font-bold">{gkInfo.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 font-normal">
              <strong>Gefahrenpotenzial:</strong> {gkInfo.risks}
            </p>
            <p className="text-xs leading-relaxed text-slate-700 font-normal">
              <strong>Soll-Maßnahme:</strong> {gkInfo.recos}
            </p>
          </div>

          <div className="border border-home-grau/30 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="p-2 border-b border-home-grau/30"><MdText text={inhalt.texte.holzartKernholz} /></th>
                  <th className="p-2 border-b border-home-grau/30">Resistenzklasse</th>
                  <th className="p-2 border-b border-home-grau/30"><MdText text={inhalt.texte.eignungBewittert} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {woodSuitability.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">{row.name}</td>
                    <td className="p-2 text-xs text-slate-600">{row.classification}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        row.name.includes('Robinie') || row.name.includes('Eiche')
                          ? 'bg-slate-100 text-slate-700 border border-home-grau/30'
                          : 'bg-rose-50 text-shiraz border border-shiraz/20'
                      }`}>
                        {directWeather || groundContact ? row.gk4 : row.gk3}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowTimberPath(!showTimberPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showTimberPath ? inhalt.werte.holzschutzKriterienAusblenden : inhalt.werte.formelnInteraktiveEinstufungsschritteSch}</span>
        </button>
        {showTimberPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5"><MdText text={inhalt.texte.normativeBestimmungsketteNachDin} /></h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800"><MdText text={inhalt.texte.schritt1UmgebungsdiagnostikFeuchteeinwir} /></p>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.wasserIstDerBiologische} /></p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800"><MdText text={inhalt.texte.schritt2KlassifizierungDer} /></p>
                <p className="text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.ihreGewähltenParameterKlassifizieren} /><strong className="font-mono bg-slate-250 px-1.5 py-0.5 rounded text-slate-850 text-xs">{gkInfo.gk}</strong> ({gkInfo.name}<MdText text={inhalt.texte.diesBestimmtNachDin} /></p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800"><MdText text={inhalt.texte.schritt3AbgleichDer} /></p>
                <p className="text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.hölzerLagernInIhren} /></p>
                <ul className="text-slate-600 list-disc pl-5 space-y-1 text-xs">
                  <li><MdText text={inhalt.texte.klasse1Bis2} /></li>
                  <li><MdText text={inhalt.texte.klasse34Douglasie} /></li>
                  <li><MdText text={inhalt.texte.klasse45Fichte} /></li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800"><MdText text={inhalt.texte.schritt4DasBiologische} /></p>
                <p className="text-slate-650 leading-relaxed font-medium"><MdText text={inhalt.texte.baulichKonstruktiveVorsorgeHat} /></p>
                <p className="text-slate-500 leading-relaxed mt-1"><MdText text={inhalt.texte.nachDin68800Sind} /></p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
