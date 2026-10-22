import fs from 'fs';

// --- GIPS ---
const gipsPath = 'src/modules/Gips.tsx';
let gipsContent = fs.readFileSync(gipsPath, 'utf8');

if (!gipsContent.includes('ArrowRight')) {
    gipsContent = gipsContent.replace("import { Box, Layers, Activity } from 'lucide-react';", "import { Box, Layers, Activity, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';");
}
const gipsKreislauf = `
            <div className="bg-white p-6 rounded-xl border border-home-grau/20 mt-6 shadow-sm">
              <h3 className="font-bold text-shiraz text-lg mb-6 text-center">Der Gipskreislauf</h3>
              
              <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
                 {/* Top row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1">Gipsstein</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mb-1">Brennen</div>
                       <div className="text-[10px] text-text-main/60">- 1,5 H₂O (ca. 100-180°C)</div>
                       <ArrowRight className="text-home-grau" />
                    </div>
                    
                    <div className="bg-white border-2 border-shiraz/50 p-4 rounded-xl w-40 text-center shadow-md relative">
                       <div className="absolute -top-3 -right-3 bg-shiraz text-white text-[10px] font-bold px-2 py-1 rounded-full">Bindemittel</div>
                       <div className="font-bold text-shiraz mb-1">Stuckgips</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·0,5H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Halbhydrat</div>
                    </div>
                 </div>
                 
                 {/* Right vertical arrow */}
                 <div className="flex w-full justify-end pr-16 relative z-0 -my-2">
                    <div className="flex flex-col items-center mr-[16px]">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-2 mb-1">+ Wasser (H₂O)</div>
                       <div className="text-[10px] text-text-main/60">Anmischen</div>
                       <ArrowDown className="text-home-grau mt-2" />
                    </div>
                 </div>
                 
                 {/* Bottom row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="flex flex-col items-center invisible w-40">
                       {/* Placeholder for layout */}
                    </div>
                    
                    <div className="flex flex-col items-center w-full">
                       <ArrowLeft className="text-home-grau mb-1" />
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-1">Abbinden (Hydratation)</div>
                       <div className="text-[10px] text-text-main/60">Kristallisation (+ Wärme)</div>
                    </div>
                    
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1">Erhärteter Gips</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat-Kristallgefüge</div>
                    </div>
                 </div>
                 
              </div>
            </div>
`;
gipsContent = gipsContent.replace(
  "</div>\n            </div>\n          </div>\n        )}",
  "</div>\n            </div>\n" + gipsKreislauf + "\n          </div>\n        )}"
);
fs.writeFileSync(gipsPath, gipsContent);

// --- KALK ---
const kalkPath = 'src/modules/Kalk.tsx';
let kalkContent = fs.readFileSync(kalkPath, 'utf8');

if (!kalkContent.includes('ArrowRight')) {
    kalkContent = kalkContent.replace("import { Box, Layers, Activity } from 'lucide-react';", "import { Box, Layers, Activity, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';");
}
const kalkKreislauf = `
            <div className="bg-white p-6 rounded-xl border border-home-grau/20 mt-8 mb-6 shadow-sm">
              <h3 className="font-bold text-shiraz text-lg mb-8 text-center">Technischer Kalkkreislauf</h3>
              
              <div className="relative max-w-3xl mx-auto flex flex-col items-center pb-8">
                 
                 {/* Top: Kalkstein */}
                 <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-48 text-center shadow-sm z-10">
                    <div className="font-bold text-text-main mb-1">Kalkstein</div>
                    <div className="text-xs text-text-main/70 font-mono">CaCO₃</div>
                    <div className="text-[10px] text-text-main/50 mt-1">Ausgangsmaterial</div>
                 </div>
                 
                 <div className="h-16 flex items-center justify-between w-full max-w-lg -mt-3 -mb-3 z-0">
                    <div className="w-1/2 flex items-center justify-start h-full border-l-2 border-dashed border-home-grau/40 ml-24 pl-4 pb-8 rounded-bl-3xl">
                       <div className="flex flex-col items-center mt-12 -ml-10 bg-white p-1">
                          <ArrowUp className="text-home-grau" />
                          <div className="text-[10px] font-bold text-shiraz mt-1 text-center leading-tight">Erhärten<br/>(Karbonatisierung)</div>
                          <div className="text-[10px] text-text-main/60">+ CO₂</div>
                       </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-end h-full border-r-2 border-dashed border-home-grau/40 mr-24 pr-4 pb-8 rounded-br-3xl">
                       <div className="flex flex-col items-center mt-12 -mr-10 bg-white p-1">
                          <div className="text-[10px] text-text-main/60">- CO₂</div>
                          <div className="text-[10px] font-bold text-shiraz mb-1 text-center leading-tight">Brennen<br/>(ca. 900-1200°C)</div>
                          <ArrowDown className="text-home-grau" />
                       </div>
                    </div>
                 </div>

                 {/* Middle: Branntkalk and Kalkmörtel */}
                 <div className="flex justify-between items-center w-full max-w-2xl relative z-10 px-8">
                    <div className="bg-off-white border-2 border-shiraz/50 p-4 rounded-xl w-48 text-center shadow-sm">
                       <div className="font-bold text-shiraz mb-1">Kalkstein / Mauerwerk</div>
                       <div className="text-xs text-text-main/70 font-mono">CaCO₃ (Gebunden)</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                    </div>
                    
                    <div className="bg-white border-2 border-shiraz p-4 rounded-xl w-48 text-center shadow-md relative">
                       <div className="absolute -top-3 -right-3 bg-shiraz text-white text-[10px] font-bold px-2 py-1 rounded-full">Ätzend!</div>
                       <div className="font-bold text-shiraz mb-1">Branntkalk</div>
                       <div className="text-xs text-text-main/70 font-mono">CaO</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Ungelöschter Kalk</div>
                    </div>
                 </div>

                 <div className="h-16 flex items-center justify-between w-full max-w-lg -mt-3 -mb-3 z-0">
                    <div className="w-1/2 flex items-center justify-start h-full border-l-2 border-t-2 border-dashed border-home-grau/40 ml-24 pl-4 pt-8 rounded-tl-3xl">
                       <div className="flex flex-col items-center -mt-10 -ml-16 bg-white p-1 visible">
                          {/* Verarbeiten is here but handled below conceptually */}
                       </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-end h-full border-r-2 border-t-2 border-dashed border-home-grau/40 mr-24 pr-4 pt-8 rounded-tr-3xl">
                       <div className="flex flex-col items-center -mt-12 -mr-8 bg-white p-1">
                          <div className="text-[10px] text-text-main/60">+ H₂O</div>
                          <div className="text-[10px] font-bold text-shiraz mb-1 text-center leading-tight">Löschen<br/>(stark exotherm)</div>
                          <ArrowDown className="text-home-grau" />
                       </div>
                    </div>
                 </div>

                 {/* Bottom: Löschkalk */}
                 <div className="bg-white border-2 border-shiraz/50 p-4 rounded-xl w-48 text-center shadow-sm z-10 mt-2">
                    <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-shiraz/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">Bindemittel</div>
                    <div className="font-bold text-text-main mb-1 mt-1">Löschkalk</div>
                    <div className="text-xs text-text-main/70 font-mono">Ca(OH)₂</div>
                    <div className="text-[10px] text-text-main/50 mt-1">Calciumhydroxid</div>
                 </div>

                 <div className="absolute bottom-16 left-[28%] flex flex-col items-center bg-white p-1">
                    <ArrowLeft className="text-home-grau mb-1" />
                    <div className="text-[10px] font-bold text-shiraz mt-1 text-center leading-tight">Verarbeiten</div>
                    <div className="text-[10px] text-text-main/60">+ H₂O + Sand</div>
                 </div>

              </div>
            </div>
`;
kalkContent = kalkContent.replace(
  '<div className="bg-off-white p-5 rounded-xl border border-home-grau/20">\n                <h3 className="font-bold text-shiraz text-lg mb-2">Herstellung (Brennen)</h3>',
  kalkKreislauf + '\n              <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">\n                <h3 className="font-bold text-shiraz text-lg mb-2">Herstellung (Brennen)</h3>'
);

fs.writeFileSync(kalkPath, kalkContent);
console.log('Grafiken hinzugefügt.');
