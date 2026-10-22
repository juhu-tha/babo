import fs from 'fs';
const filePath = 'src/modules/BetontechnischeDaten.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add new state options
content = content.replace(
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'mehlkorn'>('druckfestigkeit');",
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'mehlkorn' | 'zusatzstoffe' | 'sonderbetone'>('druckfestigkeit');"
);

// Add buttons
const mehlkornButtonStr = `onClick={() => setActiveTab('mehlkorn')}
          >
            Mehlkorngehalt
          </button>`;
const newButtons = `onClick={() => setActiveTab('mehlkorn')}
          >
            Mehlkorngehalt
          </button>
          <button
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'zusatzstoffe' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/20 hover:border-text-main'}\`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            Zusätze
          </button>
          <button
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'sonderbetone' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/20 hover:border-text-main'}\`}
            onClick={() => setActiveTab('sonderbetone')}
          >
            Sonderbetone
          </button>`;
content = content.replace(mehlkornButtonStr, newButtons);

// Add Tab Contents
const endDiv = `      </div>
    </div>
  );
}`;
const newTabs = `
        {activeTab === 'zusatzstoffe' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Betonzusatzstoffe (ST) und -zusatzmittel (ZM)</h3>
             <p className="text-sm text-text-main/80">Übersicht der üblichen Wirkstoffe (in Anlehnung an DIN EN 934 und betontechnische-daten.de Kapitel 3/4).</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3">Zusatzmittel (ZM)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BV</strong> <strong>Betonverflüssiger:</strong> Verringerung des Wasserbedarfs, Verbesserung der Verarbeitbarkeit.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FM</strong> <strong>Fließmittel:</strong> Starke Verflüssigung für Pumpbeton/SVB.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">VZ</strong> <strong>Verzögerer:</strong> Verlängerung der Verarbeitungszeit (hilfreich im Sommer oder bei massigen Bauteilen, Verzögerung der Hydratation).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">LP</strong> <strong>Luftporenbildner:</strong> Erzeugen kleiner, verteilter künstlicher Luftporen zur Erhöhung des Frost-Tausalz-Widerstands (XF4).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BE</strong> <strong>Beschleuniger:</strong> Erstarrungs- oder Erhärtungsbeschleuniger (z.B. für Spritzbeton).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">ST</strong> <strong>Stabilisierer:</strong> Verhindern von Entmischung und Bluten.</li>
                 </ul>
               </div>

               <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3">Zusatzstoffe (Typ II - reaktiv)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FA</strong> <strong>Flugasche (SFA):</strong> Puzzolanisch, verbessert Verarbeitbarkeit, verringert Hydratationswärme. Anrechenbar auf w/z-Wert.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">SF</strong> <strong>Silikastaub (Microsilica):</strong> Hochreaktiv, stark festigkeitssteigernd, stark erhöhter Wasseranspruch. Für UHPC/HPC.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">HÜS</strong> <strong>Hüttensand (HSM):</strong> Latent-hydraulisch, sehr hell, hoher Sulfatwiderstand.</li>
                 </ul>
                 <h4 className="font-bold text-shiraz mb-3 mt-6">Zusatzstoffe (Typ I - inert)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">KM</strong> <strong>Kalksteinmehl (LL):</strong> Füller, verbessert die Packungsdichte und Helligkeit.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">Farbpigmente</strong> <strong>(Eisenoxid etc.):</strong> Für Architekturbeton.</li>
                 </ul>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'sonderbetone' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Betonanwendungen & Sonderbetone (Kapitel 12)</h3>
             <p className="text-sm text-text-main/80">
               Besondere Betone erfordern spezifische anwendungsbezogene Zusammensetzungen.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { name: 'Sichtbeton (SB)', desc: 'Beton, der absichtlich sichtbar bleibt. Erfordert genaue Schalungsplanung, Farbgleichheit (oft KM/HÜS genutzt) und definierte Nachbehandlung (DIN 18217 / DBV-Merkblatt).' },
                 { name: 'WU-Beton (Weiße Wanne)', desc: 'Wasserundurchlässiger Beton. Verzicht auf nachträgliche Abdichtung. Beschränkung der Rissbreiten, definierter Mindestzementgehalt und maximaler w/z-Wert.' },
                 { name: 'Massige Bauteile', desc: 'Spezielle Anforderung: Begrenzung der Hydratationswärme zur Vermeidung von Temperaturspannungen und Rissen (Einsatz von LH-Zementen, Flugasche).' },
                 { name: 'Bohrpfahlbeton', desc: 'Beton für Spezialtiefbau. Muss entmischungsfrei bleiben und gut fließen (oft F5). Hoher Mehlkorngehalt für Geschmeidigkeit (DIN EN 1536).' },
                 { name: 'SVB (Selbstverdichtend)', desc: 'Beton, der allein durch Schwerkraft entlüftet (F6+). Erfordert Fließmittel (FM) und viskositätsmodifizierende Zusätze (VMA). Keine Rüttelenergie nötig.' },
                 { name: 'Spritzbeton', desc: 'Pneumatisch aufgebrachter Beton. Nutzt Spritzbetonbeschleuniger (SBE) für sofortiges Erstarren. Vorwiegend bei Tunnelsicherung und Instandsetzung (Nass- vs. Trockenspritzverfahren).' },
                 { name: 'Dränbeton / Offenporig', desc: 'Absichtlich hohlraumreicher Beton zur Entwässerung (Einkornbeton). Eingesetzt im Straßenbau oder für Sportanlagen.' },
               ].map((c, i) => (
                 <div key={i} className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm flex flex-col">
                   <div className="font-bold text-text-main mb-2 border-b border-home-grau/20 pb-2">{c.name}</div>
                   <div className="text-sm text-text-main/70">{c.desc}</div>
                 </div>
               ))}
             </div>
          </div>
        )}
`;

content = content.replace(endDiv, newTabs + "\n      </div>\n    </div>\n  );\n}");

fs.writeFileSync(filePath, content);
console.log('Update done');
