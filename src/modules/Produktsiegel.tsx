import React, { useState } from 'react';
import { Award, Leaf, Trees, ShieldCheck, Building, FileText, CheckCircle2, Info, HelpCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/produktsiegel/Produktsiegel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function Produktsiegel() {
  const [activeIsoType, setActiveIsoType] = useState<'type1' | 'type2' | 'type3'>('type1');

  const isoTypes = [
    {
      id: 'type1' as const,
      title: inhalt.werte.typIIso14024,
      subtitle: inhalt.werte.klassischeUmweltzeichen,
      desc: inhalt.werte.freiwilligeAufKriterienBasierende,
      criteria: inhalt.daten["Produktsiegel.isoTypes.0.criteria"],
      examples: inhalt.werte.blauerEngelNatureplusEu,
      textColor: 'text-blue-700 bg-blue-50 border-blue-200',
      badge: inhalt.werte.zertifiziertDurchDritte
    },
    {
      id: 'type2' as const,
      title: inhalt.werte.typIiIso14021,
      subtitle: 'Hersteller-Selbstdeklarationen',
      desc: inhalt.werte.umweltbezogeneAnbietererklärungenDieVom,
      criteria: inhalt.daten["Produktsiegel.isoTypes.1.criteria"],
      examples: inhalt.werte.selbsterklärungenZuRecyclatgehaltRecycli,
      textColor: 'text-amber-700 bg-amber-50 border-amber-200',
      badge: inhalt.werte.eigenerklärungDesHerstellers
    },
    {
      id: 'type3' as const,
      title: inhalt.werte.typIiiIso14025,
      subtitle: inhalt.werte.umweltproduktdeklarationenEpd,
      desc: inhalt.werte.standardisierteQuantifizierteUmweltinfor,
      criteria: inhalt.daten["Produktsiegel.isoTypes.2.criteria"],
      examples: inhalt.werte.epdVomInstitutBauen,
      textColor: 'text-purple-700 bg-purple-50 border-purple-200',
      badge: inhalt.werte.unabhängigVerifiziert
    }
  ];

  const selectedIso = isoTypes.find(t => t.id === activeIsoType) || isoTypes[0];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* ISO 14020 Environmental Labels Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-home-grau/30 pb-4 mb-6 gap-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Info className="text-shiraz" size={20} /><MdText text={inhalt.texte.klassifizierungNachIso14020} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieInternationaleNormenserieIso} /></p>
        </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded"><MdText text={inhalt.texte.iso14420Series} /></span>
        </div>

        {/* Dynamic Buttons for Types */}
        <AuswahlGruppe label="Typ der Umweltkennzeichnung" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {isoTypes.map((type) => {
            const isActive = activeIsoType === type.id;
            return (
              <button {...alsOption(isActive)}
                key={type.id}
                onClick={() => setActiveIsoType(type.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-full gap-2 ${
                  isActive 
                    ? 'border-shiraz bg-shiraz/5 text-shiraz shadow-sm ring-1 ring-shiraz/35' 
                    : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-mono tracking-wider uppercase font-bold text-slate-400">
                      {type.id === 'type1' ? 'Typ I' : type.id === 'type2' ? 'Typ II' : 'Typ III'}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive ? 'bg-shiraz/10 text-shiraz' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {type.id === 'type1' ? 'Label' : type.id === 'type2' ? 'Selbst' : 'EPD'}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mt-1 ${isActive ? 'text-shiraz' : 'text-slate-900'}`}>
                    {type.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {type.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </AuswahlGruppe>

        {/* Selected ISO Type Details Display */}
        <div className="bg-slate-50 p-6 rounded-xl border border-home-grau/30 animate-in fade-in duration-300">
          <div className="flex justify-between items-start gap-2 mb-3 border-b border-home-grau/30 pb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                {selectedIso.title}: <span className="text-slate-600 font-normal">{selectedIso.subtitle}</span>
              </h4>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border text-center font-bold font-mono tracking-wide ${selectedIso.textColor}`}>
              {selectedIso.badge}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {selectedIso.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 size={14} className="text-shiraz" /><MdText text={inhalt.texte.kerneigenschaftenKriterien} /></h5>
              <ul className="space-y-1.5">
                {selectedIso.criteria.map((crt, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 bg-shiraz/50 rounded-full mt-1.5 shrink-0" />
                    <span>{crt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between h-full">
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1"><MdText text={inhalt.texte.typischeBeispieleImBauwesen} /></h5>
                <p className="text-xs text-shiraz font-medium leading-relaxed">
                  {selectedIso.examples}
                </p>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 leading-normal flex items-start gap-1 bg-slate-50 p-2 rounded border border-home-grau/30">
                <HelpCircle size={12} className="text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {selectedIso.id === 'type3' 
                    ? inhalt.werte.epdsSindReinInformative 
                    : selectedIso.id === 'type2' 
                    ? inhalt.werte.selbstdeklarationenDeckenOftEinzelne
                    : inhalt.werte.umweltzeichenBewertenDasBauteil
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Award className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.etablierteSiegelKennzeichnungen} /></h2>
        
        <div className="text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-home-grau/30 mb-6">
          <p><MdText text={inhalt.texte.imGegensatzZuGebäudezertifizierungen} /></p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 shrink-0 h-fit">
                <Award size={24} />
              </div>
              <div>
                <a href="https://www.blauer-engel.de/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                  <h4 className="font-bold text-base mb-1"><MdText text={inhalt.texte.blauerEngel} /><span className="text-xs font-mono text-slate-400 font-normal ml-1">(Typ I)</span></h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.dasÄltesteUmweltzeichenDer} /></p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 shrink-0 h-fit">
                <Leaf size={24} />
              </div>
              <div>
                <a href="https://c2ccertified.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600">
                  <h4 className="font-bold text-base mb-1"><MdText text={inhalt.texte.cradleToCradleC2c} /><span className="text-xs font-mono text-slate-400 font-normal ml-1"><MdText text={inhalt.texte.typIArtig} /></span></h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.bewertetDieKreislauffähigkeitVon} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 shrink-0 h-fit">
                <Trees size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  <a href="https://fsc.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-amber-600">FSC</a> &amp; <a href="https://pefc.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-amber-600">PEFC</a>
                </h4>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.zertifikateFürNachhaltigeWaldwirtschaft} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 shrink-0 h-fit">
                <ShieldCheck size={24} />
              </div>
              <div>
                <a href="https://natureplus.org/" target="_blank" rel="noopener noreferrer" className="hover:underline text-purple-600">
                  <h4 className="font-bold text-base mb-1">natureplus <span className="text-xs font-mono text-slate-400 font-normal ml-1">(Typ I)</span></h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.internationalesQualitätszeichenFürNachha} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-slate-700 shrink-0 h-fit">
                <Building size={24} />
              </div>
              <div>
                <a href="https://www.csc-zertifizierung.de/" target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-700">
                  <h4 className="font-bold text-base mb-1"><MdText text={inhalt.texte.cscConcreteSustainabilityCouncil} /></h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.weltweitesZertifizierungssystemSpeziellF} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 shrink-0 h-fit">
                <ShieldCheck size={24} />
              </div>
              <div>
                <a href="https://www.emicode.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-teal-600">
                  <h4 className="font-bold text-base mb-1">EMICODE</h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.wichtigesSiegelFürVerlegewerkstoffe} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 shrink-0 h-fit">
                <Leaf size={24} />
              </div>
              <div>
                <a href="https://www.eco-institut-label.de/" target="_blank" rel="noopener noreferrer" className="hover:underline text-green-600">
                  <h4 className="font-bold text-base mb-1">eco-INSTITUT-Label</h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.verlässlicheAuszeichnungFürBesonders} /></p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 shrink-0 h-fit">
                <FileText size={24} />
              </div>
              <div>
                <a href="https://ibu-epd.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600">
                  <h4 className="font-bold text-base mb-1"><MdText text={inhalt.texte.epdEnvironmentalProductDeclaration} /><span className="text-xs font-mono text-slate-400 font-normal ml-1">(Typ III)</span></h4>
                </a>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.standardisierteUmweltproduktdeklarationN} /></p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Umweltdeklaration' },
          { title: inhalt.werte.blauerEngel, url: 'https://de.wikipedia.org/wiki/Blauer_Engel' },
          { title: 'FSC', url: 'https://de.wikipedia.org/wiki/Forest_Stewardship_Council' }
        ]}
        literatur={inhalt.daten["Produktsiegel.literatur"]}
        regelwerke={inhalt.daten["Produktsiegel.regelwerke"]}
        formeln={inhalt.daten["Produktsiegel.formeln"]}
      />
    </div>
  );
}
