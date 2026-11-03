import { Recycle, Scale, Layers, Check, AlertCircle, X, FileSignature } from 'lucide-react';
import React from 'react';
import inhalt from '@/content/abfaelle/EbvMantelverordnung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface EbvMantelverordnungProps {
  ebvEinbauweise: string;
  ebvGrundwasser: string;
  ebvMaterial: string;
  ebvSchutzgebiet: string;
  ebvVolumen: string;
  evaluateEBV: () => { status: "allowed" | "restricted" | "forbidden"; message: string; conditions: string[]; anzeige: string; };
  setEbvEinbauweise: React.Dispatch<React.SetStateAction<string>>;
  setEbvGrundwasser: React.Dispatch<React.SetStateAction<string>>;
  setEbvMaterial: React.Dispatch<React.SetStateAction<string>>;
  setEbvSchutzgebiet: React.Dispatch<React.SetStateAction<string>>;
  setEbvVolumen: React.Dispatch<React.SetStateAction<string>>;
}

export default function EbvMantelverordnung({ ebvEinbauweise, ebvGrundwasser, ebvMaterial, ebvSchutzgebiet, ebvVolumen, evaluateEBV, setEbvEinbauweise, setEbvGrundwasser, setEbvMaterial, setEbvSchutzgebiet, setEbvVolumen }: EbvMantelverordnungProps) {
  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Recycle className="w-7 h-7 text-teal-600" /><MdText text={inhalt.texte.ersatzbaustoffverordnungEbv} /></h3>
          <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.dieSeitDem1} /></p>
        </div>

        {/* Systemwechsel Banner */}
        <div className="bg-slate-100 hover:bg-slate-100/90 transition-all p-5 rounded-xl border border-home-grau/30 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Scale className="w-5 h-5 text-slate-600" /><MdText text={inhalt.texte.historischerSystemwechselDeutschlandweit} /></h4>
          <p className="text-sm text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieEbvHatDie} /></p>
        </div>

        {/* Mantelverordnung Gesamtgefüge */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-slate-950 mb-1 flex items-center gap-2 text-base">
              <Scale className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.dieMantelverordnungMavIm} /></h4>
            <p className="text-xs text-slate-500"><MdText text={inhalt.texte.dieMantelverordnungFürErsatzbaustoffe} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-teal-50/55 border border-teal-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-teal-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 1</div>
                <h5 className="font-bold text-teal-950 mb-2 leading-snug"><MdText text={inhalt.texte.ersatzbaustoffverordnungEbv2} /></h5>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.regeltBundesweitEinheitlichDie} /></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/55 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-rose-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 2</div>
                <h5 className="font-bold text-rose-950 mb-2 leading-snug"><MdText text={inhalt.texte.neufassungDerBbodschv} /></h5>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.regeltDieVerwertungVon} /></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/55 border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider text-xs"><MdText text={inhalt.texte.zugehörigeNovelle} /></div>
                <h5 className="font-bold text-slate-950 mb-2 leading-snug"><MdText text={inhalt.texte.deponieverordnungDepv} /></h5>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.passtDieDeponierechtlichenZuordnungswert} /></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/55 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-blue-800 mb-1.5 uppercase tracking-wider text-xs"><MdText text={inhalt.texte.zugehörigeNovelle2} /></div>
                <h5 className="font-bold text-blue-950 mb-2 leading-snug"><MdText text={inhalt.texte.gewerbeabfallverordnungGewabfv} /></h5>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.verschärftDiePflichtZur} /></p>
              </div>
            </div>
          </div>

          <div className="border-t border-home-grau/30 pt-4">
            <h5 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider"><MdText text={inhalt.texte.gegenüberstellungRechtlicherQuantensprun} /></h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                <div className="font-bold text-slate-800 mb-1"><MdText text={inhalt.texte.vorDem01August} /></div>
                <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                  <li>❌ <strong className="text-slate-800 font-bold">LAGA M20:</strong><MdText text={inhalt.texte.keinGesetzSondernNur} /></li>
                  <li>❌ <strong className="text-slate-800 font-bold">Flickenteppich:</strong><MdText text={inhalt.texte.t16BundesländerHattenEigene} /></li>
                  <li>❌ <strong className="text-slate-800 font-bold">Haftungsangst:</strong><MdText text={inhalt.texte.daRecycelterBauschuttRechtlich} /></li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                <div className="font-bold text-slate-800 mb-1"><MdText text={inhalt.texte.seitDem01August} /></div>
                <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                  <li>✓ <strong className="text-slate-800 font-bold">Bundesrecht:</strong><MdText text={inhalt.texte.einEinheitlichesGesetzBricht} /></li>
                  <li>✓ <strong className="text-slate-800 font-bold"><MdText text={inhalt.texte.produktstatus12Krwg} /></strong><MdText text={inhalt.texte.erstmaligeGesetzlichVerankerteEntlassung} /></li>
                  <li>✓ <strong className="text-slate-800 font-bold">Katasterpflicht:</strong><MdText text={inhalt.texte.größereWiedereinbaumaßnahmenAb250} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Materialklassen-Katalog */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.güteklassenMaterialartenMeb} /></h4>
          <p className="text-sm text-slate-600 mb-2"><MdText text={inhalt.texte.mineralischeErsatzbaustoffeWerdenAnhand} /></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30"><MdText text={inhalt.texte.bodenmaterialBaggergut} /></span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bm0Bg0} /></strong><MdText text={inhalt.texte.unbelastetesNaturbelassenesMaterial} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bm0Bg02} /></strong><MdText text={inhalt.texte.geringfügigVerändertBodenähnlich} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bmF1BgF1} /></strong><MdText text={inhalt.texte.eingeschränkterOffenerEinbauIm} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bmF2BgF2} /></strong><MdText text={inhalt.texte.technischGesicherterEinbauVersiegelt} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bmF3BgF3} /></strong><MdText text={inhalt.texte.starkUmschlosseneTechnischeBauwerke} /></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30"><MdText text={inhalt.texte.recyclingGleisschotter} /></span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800">RC-1:</strong><MdText text={inhalt.texte.hochwertigeRecyclingbaustoffeZB} /></li>
                <li>• <strong className="text-slate-800">RC-2:</strong><MdText text={inhalt.texte.mittlererBelastungsgradRegelhaftNur} /></li>
                <li>• <strong className="text-slate-800">RC-3:</strong><MdText text={inhalt.texte.höhereGehalteNurIn} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.gs0BisGs} /></strong><MdText text={inhalt.texte.aufbereiteterGleisschotter} /></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30"><MdText text={inhalt.texte.slagsAschenCo} /></span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.hmva1Hmva2} /></strong><MdText text={inhalt.texte.hausmüllverbrennungsascheliteStrengKontr} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.sws1BisSws} /></strong><MdText text={inhalt.texte.aufbereiteteSchlackenAusDer} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.hosMhsKup} /></strong><MdText text={inhalt.texte.hochofenMetallhüttenUndKupferschlacken} /></li>
              </ul>
            </div>
          </div>
        </div>

         {/* EBV-EINBAU-KONFIGURATOR (Interactive Applet Element) */}
        <div className="bg-slate-100 border border-home-grau/30 p-6 rounded-2xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Scale className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.interaktiverEbvEinbauKonfigurator} /></h4>
            <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.gebenSieDieParameter} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Materialauswahl */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.t1MaterialGüteklasseMeb} /></label>
                <select aria-label={inhalt.werte.t1MaterialGüteklasseMeb} 
                  value={ebvMaterial} 
                  onChange={(e) => setEbvMaterial(e.target.value)} 
                  className="w-full bg-white text-slate-800 border border-home-grau/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="bm0">Bodenmaterial BM-0 / Baggergut BG-0 (vollst. unbelastet)</option>
                  <option value="bm0_star">Bodenmaterial BM-0* / Baggergut BG-0* (Schadstoffvorkommen minimal)</option>
                  <option value="rc1">Recycling-Baustoff RC-1 / Gleisschotter GS-1 (sehr gut aufbereitet)</option>
                  <option value="bm_f1">Bodenmaterial BM-F1 / Baggergut BG-F1 (leicht belasteter Erdaushub)</option>
                  <option value="rc2">Recycling-Baustoff RC-2 / Gleisschotter GS-2 (mittlere Eluatbelastung)</option>
                  <option value="bm_f2">Bodenmaterial BM-F2 / Baggergut BG-F2</option>
                  <option value="hmva1">Hausmüllverbrennungsasche HMVA-1 (Mindestmenge 50 m³)</option>
                  <option value="rc3">Recycling-Baustoff RC-3 / Bodenmaterial BM-F3 / Baggergut BG-F3</option>
                  <option value="hmva2">Hausmüllverbrennungsasche HMVA-2 (Mindestmenge 250 m³)</option>
                </select>
              </div>

              {/* Wasserschutzgebiet */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.t2WasserschutzgebietGrundwasserschutzbere} /></label>
                <AuswahlGruppe label="Wasserschutzgebiet" className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ausserhalb', label: inhalt.werte.keinWasserschutzgebiet },
                    { id: 'wsg_3', label: inhalt.werte.zoneIiiIiiB },
                    { id: 'wsg_1_2', label: inhalt.werte.zoneIIiIii }
                  ].map((z) => (
                    <button {...alsOption(ebvSchutzgebiet === z.id)}
                      key={z.id}
                      type="button"
                      onClick={() => setEbvSchutzgebiet(z.id)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                              ebvSchutzgebiet === z.id
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </AuswahlGruppe>
              </div>

              {/* Hydrogeologie */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold"><MdText text={inhalt.texte.t3HydrogeologieNatürlicherBodenschutz} /></label>
                <AuswahlGruppe label="Hydrogeologie" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(ebvGrundwasser === 'deckschicht_ja')}
                    type="button"
                    onClick={() => setEbvGrundwasser('deckschicht_ja')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_ja'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold"><MdText text={inhalt.texte.günstigeDeckschicht} /></span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold"><MdText text={inhalt.texte.lehmTonVorhandenAbstand} /></span>
                  </button>
                  <button {...alsOption(ebvGrundwasser === 'deckschicht_nein')}
                    type="button"
                    onClick={() => setEbvGrundwasser('deckschicht_nein')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_nein'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold"><MdText text={inhalt.texte.ungünstigeVerhältnisse} /></span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold"><MdText text={inhalt.texte.sandigKiesigOderGrundwasser} /></span>
                  </button>
                </AuswahlGruppe>
              </div>

              {/* Einbauweise */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold"><MdText text={inhalt.texte.t4EinbausituationBauweise} /></label>
                <AuswahlGruppe label="Einbauweise" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(ebvEinbauweise === 'versiegelt')}
                    type="button"
                    onClick={() => setEbvEinbauweise('versiegelt')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'versiegelt'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold"><MdText text={inhalt.texte.bautechnischeSicherung} /></span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold"><MdText text={inhalt.texte.unterDichtenDeckenAsphalt} /></span>
                  </button>
                  <button {...alsOption(ebvEinbauweise === 'offen')}
                    type="button"
                    onClick={() => setEbvEinbauweise('offen')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'offen'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold"><MdText text={inhalt.texte.offeneBauweise} /></span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold font-semibold"><MdText text={inhalt.texte.wegebauLärmschutzwälleWasserleitend} /></span>
                  </button>
                </AuswahlGruppe>
              </div>

              {/* Menge/Einbauvolumen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold"><MdText text={inhalt.texte.t5EinbauvolumenMeldepflichtNach} /></label>
                <AuswahlGruppe label="Einbauvolumen" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(ebvVolumen === 'unter_250')}
                    type="button"
                    onClick={() => setEbvVolumen('unter_250')}
                    className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'unter_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  ><MdText text={inhalt.texte.kleinsteinbau250M} /></button>
                  <button {...alsOption(ebvVolumen === 'ab_250')}
                    type="button"
                    onClick={() => setEbvVolumen('ab_250')}
                    className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'ab_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  ><MdText text={inhalt.texte.großbaustelle250M} /></button>
                </AuswahlGruppe>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 flex flex-col">
              {(() => {
                const verdict = evaluateEBV();
                return (
                  <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between transition-all duration-350 shadow-xs ${
                          verdict.status === 'allowed'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : verdict.status === 'restricted'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : 'bg-shiraz/5 text-slate-950 border-shiraz/20'
                        }`}>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">
                          {verdict.status === 'allowed' ? (
                            <Check className="w-5 h-5 text-emerald-600 font-bold" />
                          ) : verdict.status === 'restricted' ? (
                            <AlertCircle className="w-5 h-5 text-amber-600 font-bold" />
                          ) : (
                            <X className="w-5 h-5 text-shiraz font-bold" />
                          )}<MdText text={inhalt.texte.rechtlichesUrteil} /></div>
                        <div className="text-xl font-extrabold mt-1">
                          {verdict.message}
                        </div>
                      </div>

                      <div className="border-t border-dashed border-home-grau/30 pt-3">
                        <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5"><MdText text={inhalt.texte.einbaubedingungenRestriktionen} /></span>
                        <ul className="space-y-1.5 text-xs font-semibold leading-relaxed">
                          {verdict.conditions.map((cond, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-teal-600 mt-0.5">•</span>
                              <span>{cond}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-home-grau/30 pt-3 mt-4 text-xs font-bold leading-normal">
                      <span className="block text-xs uppercase font-black text-slate-700 mb-1"><MdText text={inhalt.texte.meldungspflicht22Ebv} /></span>
                      {verdict.anzeige}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Anzeigepflicht & Kataster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileSignature className="w-5 h-5 text-slate-600" /><MdText text={inhalt.texte.katasterregelungAnzeigepflicht22Gesetz} /></h4>
            <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.umDieLangfristigeUmweltverträglichkeit} /></p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><MdText text={inhalt.texte.die250MBagatellgrenze} /></li>
              <li><MdText text={inhalt.texte.fristenAblaufBr} /><strong className="text-slate-800">Voranzeige:</strong><MdText text={inhalt.texte.spätestens4WochenVor} /><strong className="text-slate-800">Abschlussanzeige:</strong><MdText text={inhalt.texte.binnen2WochenNach} /></li>
              <li><MdText text={inhalt.texte.archivierungspflichtenDieZuständigenUnte} /></li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileSignature className="w-5 h-5 text-slate-600" /><MdText text={inhalt.texte.lieferscheineDeckblattPflicht} /></h4>
            <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.fürJedesAntransportierteMeb} /></p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><MdText text={inhalt.texte.präziseKoordinatenDasDeckblatt} /></li>
              <li><MdText text={inhalt.texte.unterschriftspflichtBauherrUndLieferant} /></li>
              <li><MdText text={inhalt.texte.übergabeAnDenEigentümer} /></li>
            </ul>
          </div>
        </div>

        {/* QUBA / Güteüberwachung */}
        <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-start">
          <div className="bg-shiraz text-white p-3 rounded-lg">
            <Recycle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.güteüberwachungQubaSiegelProduktstatus} /></h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold"><MdText text={inhalt.texte.ersatzbaustoffeMüssenEinerWerkseigene} /></p>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-semibold"><MdText text={inhalt.texte.mitErreichungDesQuba} /></p>
            <div className="mt-3 bg-white p-3 rounded-lg border border-home-grau/20 text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800"><MdText text={inhalt.texte.die4KumulativenVoraussetzungen} /></span>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li><MdText text={inhalt.texte.zweckbestimmungDerStoffOder} /></li>
                <li><MdText text={inhalt.texte.marktfähigkeitEsBestehtEin} /></li>
                <li><MdText text={inhalt.texte.technischesRechtProduktkonformitätEr} /></li>
                <li><MdText text={inhalt.texte.schadlosigkeitSeineVerwendungFührt} /></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
}
