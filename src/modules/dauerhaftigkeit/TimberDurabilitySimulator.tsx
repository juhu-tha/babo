// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Bug } from 'lucide-react';

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
      return {
        gk: 'GK 4',
        name: 'Erd- oder Süßwasserkontakt',
        risks: 'Fäulnispilze (Weichfäule), holzzerstörende Moderfäule, Larven.',
        recos: 'Einsatz von Kiefer kesseldruckimprägniert (KD) oder extrem dauerhaften Harthölzern wie Robinie (Resistenzklasse 1).'
      };
    }
    if (directWeather) {
      return {
        gk: 'GK 3.2',
        name: 'Außenbereich, voll bewittert mit Wasserspeicherung',
        risks: 'Regenüberfeuchtung, Pilzbefall (Weiß-/Braunfäule), Rissbildung.',
        recos: 'Konstruktiver Holzschutz unerlässlich (Hirnholzversiegelung, Ablaufschlitze), Douglasie / Lärche (Klasse 3) Kernholz nur für mäßige Beanspruchung.'
      };
    }
    if (!inHeated && humidityRisk) {
      return {
        gk: 'GK 2',
        name: 'Unter Dach, vor Regen geschützt, aber zeitweise feucht',
        risks: 'Pilze (Bluringe/Hausfäulnis) sowie Hausbock/Nagekäfer.',
        recos: 'Bauteile kontrollierbar halten, feuchtesteuernde Lasuren, Nadelholz Kernholzart ohne Imprägnierung möglich.'
      };
    }
    if (!inHeated) {
      return {
        gk: 'GK 1',
        name: 'Innenbereich, trocken, aber ohne kontrollierte Heizung',
        risks: 'Insektenbefall (Hausbocklarven), keine Pilzgefahr (da u < 20%).',
        recos: 'Wahl von Kiefer/Fichte Kernholz ist vollkommen ausreichend. Keine chemische Behandlung nötig.'
      };
    }
    return {
      gk: 'GK 0',
      name: 'Innenbereich, ständig trocken (beheiztes Gebäude)',
      risks: 'Keine Gefährdung durch Pilze oder Insekten.',
      recos: 'Vorbeugender chemischer Holzschutz ist in GK 0 nach DIN 68800 nicht erforderlich und soll unterbleiben (Vorrang baulicher Maßnahmen; DIN 68800 ist eine Norm, kein Gesetz). Konstruktiver Standard genügt.'
    };
  };

  const gkInfo = getGK();

  const woodSuitability = [
    { name: 'Robinie (Scheinakazie)', classification: 'Dauerhaftigkeitsklasse 1-2 (Dauerhaft)', gk4: 'Sehr gut geeignet', gk3: 'Sehr gute Wahl' },
    { name: 'Eiche (Kernholz)', classification: 'Dauerhaftigkeitsklasse 2 (Dauerhaft)', gk4: 'Eingeschränkt geeignet', gk3: 'Sehr gut geeignet' },
    { name: 'Lärche / Douglasie', classification: 'Dauerhaftigkeitsklasse 3-4 (Mäßig dauerhaft)', gk4: 'Nicht geeignet', gk3: 'Geeignet bei freiem Wasserablass' },
    { name: 'Fichte', classification: 'Dauerhaftigkeitsklasse 4 (Wenig dauerhaft)', gk4: 'Ungenügend', gk3: 'Nur mit tiefem Chemie-Holzschutz' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="text-shiraz w-5 h-5" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
          DIN 68800 Bestimmer: Holz-Gebrauchsklasse & Resistenz-Abgleich
        </h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Gebrauchsklassen (GK) bestimmen das Gefährdungsspektrum für Holzbauteile. 
        Klicken Sie die Einsatzkonditionen an, um die Gebrauchsklasse und die zulässigen natürlichen Holzarten (DIN EN 350 i. V. m. DIN 68800-1) zu bestimmen:
      </p>

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
            <span className="text-slate-700 font-medium">Beheizter, ständig geschlossener Innenraum?</span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={humidityRisk}
              onChange={(e) => setHumidityRisk(e.target.checked)}
              disabled={inHeated}
              className="accent-shiraz shrink-0"
            />
            <span className={`text-slate-700 ${inHeated ? 'opacity-40' : 'font-medium'}`}>
              Gefahr zeitweiser Befeuchtung (Nassraum/Kondensation)?
            </span>
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
            <span className="text-slate-700 font-medium">Außenbereich bewittert (Direktregen)?</span>
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
            <span className="text-slate-700 font-medium">Direkter Erdkontakt?</span>
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
            <span className="text-slate-700 font-medium">Ständiger Kontakt mit Süßwasser?</span>
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
                  <th className="p-2 border-b border-home-grau/30">Holzart (Kernholz)</th>
                  <th className="p-2 border-b border-home-grau/30">Resistenzklasse</th>
                  <th className="p-2 border-b border-home-grau/30">Eignung Bewittert</th>
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
          <span>{showTimberPath ? '▲ Holzschutz-Kriterien ausblenden' : '▼ Formeln & interaktive Einstufungsschritte (Schritt für Schritt)'}</span>
        </button>
        {showTimberPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              Normative Bestimmungskette nach DIN 68800-1 / DIN EN 350-2
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 1: Umgebungsdiagnostik (Feuchteeinwirkung)</p>
                <p className="text-slate-600 leading-relaxed">
                  Wasser ist der biologische Katalysator. Pilze können Holz nur abbauen, wenn die Holzfeuchte dauerhaft über ca. 20 % liegt (Fasersättigung bei ca. 28–30 %).
                  Unter beheizten Innenbedingungen bleibt u bei ca. 8–12 %, weshalb kein Pilzrisiko besteht. Sobald Erdkontakt oder Bewitterung einsetzen, stellt sich freies Wasser im Holzgefüge ein.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 2: Klassifizierung der Gebrauchsklasse (GK)</p>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Ihre gewählten Parameter klassifizieren das Tragwerk in die Klasse <strong className="font-mono bg-slate-250 px-1.5 py-0.5 rounded text-slate-850 text-xs">{gkInfo.gk}</strong> ({gkInfo.name}). 
                  Dies bestimmt nach DIN 68800-1:2019-06 die erforderlichen Schutzmaßnahmen (Insektengefahr ab GK 1, Pilzgefahr ab GK 2, Moderfäulerisiko ab GK 4).
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 3: Abgleich der natürlichen Dauerhaftigkeit (Dauerhaftigkeitsklasse nach DIN EN 350:2016-12)</p>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Hölzer lagern in ihren inneren Kernzellen schützende Tannine, Terpene oder Harze ein. Je niedriger die Dauerhaftigkeitsklasse (1 = sehr dauerhaft bis 5 = nicht dauerhaft), desto widerstandsfähiger ist das Holz:
                </p>
                <ul className="text-slate-600 list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Klasse 1 bis 2 (Robinie, Eiche):</strong> Splintfreies Kernholz der Klasse 1 (Robinie) ist ohne chemischen Schutz auch in GK 4 verwendbar; Klasse 2 bis GK 3.2. Eiche wird nach DIN EN 350 mit 2 bis 4 eingestuft.</li>
                  <li><strong>Klasse 3-4 (Douglasie, Lärche):</strong> Nur baulich optimal geschützt (ohne Staunässe, freier Ablauf) einsatzfähig.</li>
                  <li><strong>Klasse 4-5 (Fichte, Tanne):</strong> Ohne Schutzmaßnahmen nicht für bewitterte Gebrauchsklassen geeignet; Fichte ist zudem schlecht tränkbar, sodass auch eine Kesseldruckimprägnierung (KDI) nur begrenzt eindringt.</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 4: Das biologische Dogma des Holzschutzes</p>
                <p className="text-slate-650 leading-relaxed font-medium">
                  Baulich-konstruktive Vorsorge hat ausnahmslos Vorrang vor chemischem Holzschutz!
                </p>
                <p className="text-slate-500 leading-relaxed mt-1">
                  Nach DIN 68800 sind bauliche Maßnahmen vorrangig; in GK 0 sind keine vorbeugenden chemischen Maßnahmen vorgesehen, und in Aufenthaltsräumen soll chemischer Holzschutz vermieden werden. Holzschutzmittel sind Biozidprodukte (Verordnung (EU) Nr. 528/2012).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
