// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)

export default function BindemittelTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bitumenprüfung & Kenngrößen */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3">
            Straßenbaubitumen & Viskositätsklassen
          </h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4">
            Das Bindemittel Bitumen ist thermoplastisch: Bei Kälte spröde, bei Hitze zähviskos/flüssig. Für die Eignung im Asphalt wird es nach den Labortests charakterisiert:
          </p>

          <div className="space-y-4">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <p className="font-bold text-zinc-800">1. Nadelpenetration (DIN EN 1426)</p>
              <p className="text-text-main/75 mt-1">
                Eine standardisierte Stahlnadel (100g) dringt 5 Sekunden bei 25 °C in das Bitumen ein. Ein Eindringtiefe-Wert von 50 Zehntelmillimeter (0,1 mm) entspricht der Klassifizierung "50". 
                Standard-Straßenbitumen: <strong>50/70</strong> oder <strong>70/100</strong>. Je höher die Zahl, desto weicher das Bitumen.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <p className="font-bold text-zinc-800">2. Erweichungspunkt Ring und Kugel (RuK, DIN EN 1427)</p>
              <p className="text-text-main/75 mt-1">
                Temperatur, bei der eine Stahlkugel eine erhitzte Bitumenscheibe um eine definierte Distanz nach unten durchbiegt. 
                Straßenbaubitumen 50/70 bzw. 70/100 hat einen Erweichungspunkt RuK von ca. <strong>43 °C bis 54 °C</strong> (DIN EN 12591). Polymermodifizierte Bitumen (PmB, z. B. mit SBS) erreichen höhere Erweichungspunkte und bleiben bei Kälte elastischer.
              </p>
            </div>
          </div>
        </div>

        {/* Gesteinsprüfung: PSV-Wert */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              Polishing Stone Value (PSV-Wert, DIN EN 1097-8)
            </h3>
  <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
    <p>
      Der wichtigste Material-Parameter für die Griffigkeit und Fahrsicherheit der Asphaltdeckschichten (Vermeidung von Rutschen bei Regen).
            </p>

            <div className="bg-zinc-50 p-3.5 border border-zinc-200 rounded-lg text-xs space-y-2 mb-4">
              <p className="font-bold text-zinc-800">Verfahrensablauf:</p>
              <p className="text-[11px] leading-relaxed text-text-main/70">
                Gesteinssplitt-Körner werden auf einem Probekörper-Rad fixiert und unter permanentem Schleifsand-Wasserstrom unter Andruck eines Reifens künstlich poliert. Anschließend wird die <strong>Reibung (Gleitkoeffizient)</strong> mittels Pendelprüfgerät (SRT) gemessen.
              </p>
              <p className="font-bold text-[11px] text-zinc-900 border-t border-zinc-200 pt-2 font-mono">
                Autobahndeckschichten zwingend: PSV-Wert ≥ 51 oder ≥ 54
    </p>
  </div>

            <p className="text-xs text-text-main/75 leading-relaxed mb-2">
              Geeignete Naturgesteine für extremen Abrieb:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <span className="p-2 bg-zinc-100 text-zinc-700 rounded text-center">Basalt, Andesit, Diabas</span>
              <span className="p-2 bg-red-50 text-red-900 border border-red-350 rounded text-center">Kein weicher Kalkstein!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
