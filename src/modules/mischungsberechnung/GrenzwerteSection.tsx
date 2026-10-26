import { FEUCHTIGKEITSKLASSEN } from './daten';
import inhalt from '@/content/mischungsberechnung/GrenzwerteSection.json';
import { MdText } from '@/src/components/inhalt/MdText';

export function GrenzwerteSection() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.grenzwerteDinEn206} /><span className="text-sm font-normal text-text-main/70"><MdText text={inhalt.texte.quelleBetontechnischeDatenDe} /></span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieserAbschnittBietetÜbersichtliche} /></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
             <h3 className="font-bold text-lg mb-3"><MdText text={inhalt.texte.feuchtigkeitsklassenAkr} /></h3>
             <ul className="space-y-3">
               {FEUCHTIGKEITSKLASSEN.map(f => (
                 <li key={f.id} className="text-sm">
                   <strong className="text-text-main">{f.name}</strong> 
                   <div className="text-text-main/70">{f.desc}</div>
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
             <h3 className="font-bold text-lg mb-3">Konsistenzklassen</h3>
             <div className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.dieKonsistenzWirdÜber} /></div>
             <ul className="space-y-1 text-sm text-text-main/80">
               <li><MdText text={inhalt.texte.c0V146} /></li>
               <li><MdText text={inhalt.texte.c1V145} /></li>
               <li><MdText text={inhalt.texte.c2V125} /></li>
               <li><MdText text={inhalt.texte.c3V110} /></li>
               <li><MdText text={inhalt.texte.f5A560620} /></li>
             </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-lg mb-3"><MdText text={inhalt.texte.ausgewählteExpositionsklassenLpBeton} /></h3>
          <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.besondersImFrostbereichXf2} /></p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-2 px-2">Klasse</th>
                  <th className="py-2 px-2">Ausführung</th>
                  <th className="py-2 px-2">max. w/z</th>
                  <th className="py-2 px-2"><MdText text={inhalt.texte.minFestigkeit} /></th>
                  <th className="py-2 px-2"><MdText text={inhalt.texte.minZementKgM} /></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF2 / XF3</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0,50</td>
                  <td className="py-2 px-2">C35/45</td>
                  <td className="py-2 px-2">320</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2"><MdText text={inhalt.texte.mitLpMin4} /></td>
                  <td className="py-2 px-2">0,55</td>
                  <td className="py-2 px-2">C25/30</td>
                  <td className="py-2 px-2">300</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF4</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">–</td>
                  <td className="py-2 px-2"><MdText text={inhalt.texte.nichtGeregeltNurLp} /></td>
                  <td className="py-2 px-2">–</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2"><MdText text={inhalt.texte.mitLpMin42} /></td>
                  <td className="py-2 px-2">0,50</td>
                  <td className="py-2 px-2">C30/37</td>
                  <td className="py-2 px-2">320</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-main/60 mt-3"><MdText text={inhalt.texte.hinweisBeiGesteinskörnungDmax} /></p>
        </div>
      </div>
    </div>
  );
}
