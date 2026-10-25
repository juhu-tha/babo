import { ExternalLink } from 'lucide-react';

export default function AnhangGlossarSoftware() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 5</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Epilog: Glossar, Werkzeuge &amp; normative Standards
          </h3>
        </div>

        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
            ⌨ Glossar der Ökobilanzierung (Kurzfassung)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              { term: 'Allokation', def: 'Zuweisung von Umweltaufwendungen auf Koppelprodukte (z.B. Hüttensand aus der Roheisenherstellung).' },
              { term: 'BNB', def: 'Bewertungssystem Nachhaltiges Bauen – Pflichtsystem der Bundesregierung für Bundes- und Staatsgebäude.' },
              { term: 'EF 3.1', def: 'Environmental Footprint-Methodenreferenz der Europ. Kommission, bildet die LCIA-Grundlage nach EN 15804+A2.' },
              { term: 'EEE', def: 'Energieeffizienz-Experte; staatlich registrierter Gutachter für Förderungen und Konformitätsprüfungen.' },
              { term: 'eLCA / Bauteileditor', def: 'Vom BBSR entwickeltes kostenloses Online-Tool zur vereinfachten Bilanzierung von Gebäudeschichten.' },
              { term: 'End-of-Life (EoL)', def: 'Lebensende eines Baustoffes (Rückbau, Sortierung, thermische Verwertung oder Deponierung).' },
              { term: 'EPBD', def: 'EU-Gebäuderichtlinie (EU) 2024/1275: Lebenszyklus-GWP ist für Neubauten ab 2028 (> 1 000 m²) bzw. 2030 (alle) zu berechnen und im Energieausweis offenzulegen.' },
              { term: 'GWP 100', def: 'Global Warming Potential – Erderwärmungspotenzial über einen normierten Zeithorizont von 100 Jahren.' },
              { term: 'ILCD+EPD', def: 'Gemeinsames xml-Datenformat zur Standardübertragung von EPD-Kennwerten in die ÖKOBAUDAT.' },
              { term: 'KFN / KNN', def: 'KfW-Klimaförderrichtlinien (Klimafreundlicher Neubau). Knüpfen Kredite an strenge GWP-Grenzwerte.' },
              { term: 'PCR (Product Category Rules)', def: 'Produktkategorieregeln, die Berechnungsverfahren zur Herstellung vergleichbarer EPDs festlegen.' },
              { term: 'PENRT', def: 'Primärenergie nicht-erneuerbar total. Wichtige QNG-Kompensationsgröße.' },
              { term: 'RSL (Reference Service Life)', def: 'Referenznutzungsdauer eines Baustoffes gemäß BBSR-Zählung (z.B. Gipsputz = 40 Jahre).' },
              { term: 'RSP (Reference Study Period)', def: 'Betrachtungszeitraum eines Gebäudes; für Ökobilanzen in Deutschland standardmäßig 50 Jahre.' },
              { term: 'UUID', def: 'Universell eindeutige Datenkennnummer im XML-Satz der ÖKOBAUDAT zur exakten Materialzuordnung.' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-lg border border-stone-200/60 leading-normal">
                <strong className="text-[11px] font-mono text-slate-900 block font-bold">{item.term}</strong>
                <span className="text-[10px] text-slate-500 block pt-1">{item.def}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
            🌐 Werkzeuge, Datenbanken &amp; Software
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight">ÖKOBAUDAT (BBSR)</strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                  Zentrales deutsches Referenzregister für generische Ökobilanz-Datensätze und verifizierte Produkt-EPDs im ILCD-Format.
                </p>
              </div>
              <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                oekobaudat.de <ExternalLink size={10} />
              </a>
            </div>

            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight">eLCA (BBSR)</strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                  Webbasierte kostenfreie Software des Bundes zur Berechnung von Gebäude-Ökobilanzen konform mit QNG- und BNB-Richtlinien.
                </p>
              </div>
              <a href="https://www.bauteileditor.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                bauteileditor.de <ExternalLink size={10} />
              </a>
            </div>

            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight">openLCA (GreenDelta)</strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                  Hervorragendes, kostenloses Open-Source-Werkzeug zur Modellierung hochkomplexer Stoffstromsysteme und EPDs auf Werksebene.
                </p>
              </div>
              <a href="https://www.openlca.org" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                openlca.org <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
            📖 Normative Quellennachweise (Normenhierarchie)
          </h4>
          <ul className="text-[11px] text-slate-650 space-y-1.5 list-disc pl-5 leading-relaxed">
            <li><strong>ISO 14040 / ISO 14044:</strong> Allgemeine, produktübergreifende Grundsätze und Rechenrahmen für Ökobilanzen.</li>
            <li><strong>ISO 14025:</strong> Leitfaden zur Erarbeitung von verifizierten Typ-III-Umweltdeklarationen (EPDs).</li>
            <li><strong>DIN EN 15804+A2 (2020):</strong> Zentrale Branchennorm zur Definition der Product Category Rules (PCR) für EPDs im Bauwesen.</li>
            <li><strong>DIN EN 15978:</strong> Berechnungsmethode zur Aggregation von EPDs auf die Gebäudeebene über 50 Jahre.</li>
            <li><strong>DIN 277-1:2021-08:</strong> Ermittlung der Netto-Raumflächen (NRF) als gesetzliche QNG-Flächenreferenz.</li>
            <li><strong>GEG / DIN V 18599:</strong> Energetische Berechnungen zum nutzerseitigen Betriebsenergie-Gegenüber (Modul B6).</li>
          </ul>
        </div>

      </div>
    );
}
