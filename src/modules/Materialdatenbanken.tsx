import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Database, Leaf, Search, Globe, FileText, CheckCircle2, ShieldAlert, FileSpreadsheet, Eye, Info, RefreshCw, RotateCcw, Calculator } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

const DATABASES = [
  {
    name: 'ÖKOBAUDAT',
    origin: 'Deutschland (BBSR)',
    url: 'https://www.oekobaudat.de/',
    icon: <Database className="text-blue-600" size={24} />,
    color: 'bg-blue-50 border-blue-200',
    description: 'Die ÖKOBAUDAT ist die verbindliche Datenbasis für die Ökobilanzierung von Gebäuden des Bundes (BNB) und für das QNG-Siegel. Sie enthält generische und spezifische Ökobilanzdatensätze (EPDs) für Bauprodukte.',
    features: ['Kostenlos', 'Verbindlich für QNG/BNB', 'DIN EN 15804 konform', 'XML-Schnittstelle']
  },
  {
    name: 'WECOBIS',
    origin: 'Deutschland (BMWSB / BÄK)',
    url: 'https://www.wecobis.de/',
    icon: <Leaf className="text-green-600" size={24} />,
    color: 'bg-green-50 border-green-200',
    description: 'Das Ökologische Baustoffinformationssystem (WECOBIS) liefert herstellerneutrale Informationen zu gesundheitlichen und ökologischen Aspekten von Bauprodukten über deren gesamten Lebenszyklus.',
    features: ['Gesundheitsaspekte', 'Herstellerneutral', 'Lebenszyklusphasen', 'Textbasierte Infos']
  },
  {
    name: 'GESTIS-Stoffdatenbank',
    origin: 'Deutschland (IFA / DGUV)',
    url: 'https://www.dguv.de/ifa/gestis/gestis-stoffdatenbank/index.jsp',
    icon: <ShieldAlert className="text-red-600" size={24} />,
    color: 'bg-red-50 border-red-200',
    description: 'Die GESTIS-Stoffdatenbank enthält Informationen für den sicheren Umgang mit chemischen Stoffen am Arbeitsplatz, wie z.B. physikalisch-chemische Daten, Einstufung und Kennzeichnung (GHS) sowie technische Schutzmaßnahmen.',
    features: ['Gefahrstoffe', 'Arbeitsschutz', 'GHS-Kennzeichnung', 'Kostenlos']
  },
  {
    name: 'DGNB Navigator',
    origin: 'Deutschland (DGNB)',
    url: 'https://www.dgnb-navigator.de/',
    icon: <Search className="text-orange-600" size={24} />,
    color: 'bg-orange-50 border-orange-200',
    description: 'Der DGNB Navigator ist eine Online-Datenbank für Bauprodukte, die detaillierte Informationen zu Nachhaltigkeitsaspekten liefert und direkt mit dem DGNB Zertifizierungssystem verknüpft ist.',
    features: ['Herstellerspezifisch', 'DGNB-Kriterien', 'Zertifikate-Download', 'Produktsuche']
  },
  {
    name: 'Ecoinvent',
    origin: 'Schweiz (Global)',
    url: 'https://ecoinvent.org/',
    icon: <Globe className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    description: 'Ecoinvent ist eine der weltweit größten und umfassendsten LCI-Datenbanken (Life Cycle Inventory). Sie wird oft als Hintergrunddatenbank für die Erstellung von EPDs und komplexen Ökobilanzen genutzt.',
    features: ['Kostenpflichtig', 'Globaler Standard', 'Sehr detailliert', 'Hintergrunddaten']
  },
  {
    name: 'EPD-Programme (z.B. IBU)',
    origin: 'International',
    url: 'https://ibu-epd.com/',
    icon: <FileText className="text-purple-600" size={24} />,
    color: 'bg-purple-50 border-purple-200',
    description: 'Programmhalter wie das Institut Bauen und Umwelt e.V. (IBU) veröffentlichen verifizierte Umweltproduktdeklarationen (EPDs) von Herstellern. Diese Daten fließen oft in die ÖKOBAUDAT ein.',
    features: ['Verifizierte Daten', 'Herstellerspezifisch', 'PDF & XML', 'Primärdaten']
  }
];

interface OekobaudatRecord {
  id: string;
  name: string;
  category: string;
  type: 'Generisch' | 'Spezifisch (EPD)';
  manufacturer: string;
  unit: string;
  gwp: number; // kg CO2-eq
  penrt: number; // MJ
  ap: number; // kg SO2-eq
  ep: number; // kg PO4-eq
  recycledContent: number; // %
  wecobisSafety: string[];
}

const MOCK_MOCK_RECORDS: OekobaudatRecord[] = [
  {
    id: 'o-1',
    name: 'Normalbeton C25/30',
    category: 'Mineralisch / Beton',
    type: 'Generisch',
    manufacturer: 'BBSR Generischer Datensatz',
    unit: '1 m³',
    gwp: 245.0,
    penrt: 1350,
    ap: 0.28,
    ep: 0.08,
    recycledContent: 0,
    wecobisSafety: ['Frei von organischen Lösemitteln', 'Kein VOC-Dampf', 'Nicht brennbar A1']
  },
  {
    id: 'o-2',
    name: 'Brettschichtholz (Nadelholz)',
    category: 'Nachwachsend / Holz',
    type: 'Generisch',
    manufacturer: 'BBSR Generischer Datensatz',
    unit: '1 m³',
    gwp: -482.0, // Biogenes CO2
    penrt: 2600,
    ap: 0.45,
    ep: 0.15,
    recycledContent: 0,
    wecobisSafety: ['Biogener CO2-Speicher', 'Formaldehyd Klasse E1', 'PEFC/FSC zertifiziert']
  },
  {
    id: 'o-3',
    name: 'Flachprodukt Stahl (B500B)',
    category: 'Metall',
    type: 'Spezifisch (EPD)',
    manufacturer: 'Wirtschaftsvereinigung Stahl',
    unit: '1 t',
    gwp: 1120.0,
    penrt: 14200,
    ap: 1.85,
    ep: 0.54,
    recycledContent: 85,
    wecobisSafety: ['unbegrenzt recyclingfähig', 'Schwermetallfrei', 'DGNB VOC konform']
  },
  {
    id: 'o-4',
    name: 'Steinwolle-Dämmplatte (generisch)',
    category: 'Dämmstoffe',
    type: 'Generisch',
    manufacturer: 'BBSR Generischer Datensatz',
    unit: '1 m³',
    gwp: 45.5,
    penrt: 820,
    ap: 0.12,
    ep: 0.03,
    recycledContent: 15,
    wecobisSafety: ['Biopersistenzfrei', 'Recyclingfähig', 'Ausgezeichneter Brandschutz']
  },
  {
    id: 'o-5',
    name: 'Portlandzement CEM I 42,5 R (Muster-Zement)',
    category: 'Mineralisch / Bindemittel',
    type: 'Spezifisch (EPD)',
    manufacturer: 'Deutscher Zementhersteller (Musterwert)',
    unit: '1 t',
    gwp: 680.0,
    penrt: 3340,
    ap: 0.98,
    ep: 0.24,
    recycledContent: 5,
    wecobisSafety: ['Chromatarm nach EG-VO', 'Aerosolarm bei Anmischung']
  },
  {
    id: 'o-6',
    name: 'Porenbeton-Planstein (Muster-EPD)',
    category: 'Mineralisch / Mauerwerk',
    type: 'Spezifisch (EPD)',
    manufacturer: 'Inländisches Mauersteinkombinat',
    unit: '1 m³',
    gwp: 110.0,
    penrt: 780,
    ap: 0.15,
    ep: 0.04,
    recycledContent: 8,
    wecobisSafety: ['Eco-Institut Certified', 'Frei von krebserzeugenden Stoffen', 'Sehr emissionsarm']
  },
  {
    id: 'o-7',
    name: 'Gipskartonplatte GKB 12,5',
    category: 'Ausbau / Trockenbau',
    type: 'Spezifisch (EPD)',
    manufacturer: 'Musterhersteller Trockenbausysteme',
    unit: '1 m²',
    gwp: 1.85,
    penrt: 34.0,
    ap: 0.005,
    ep: 0.001,
    recycledContent: 25,
    wecobisSafety: ['FGD Gips Anteil (REA)', 'Institut Bauen und Umwelt verifiziert', 'Geringe TVOC Emissionen']
  }
];

export interface QngMaterial {
  name: string;
  category: 'Mineralisch' | 'Metalle' | 'Holz & Organisch' | 'Dämmstoffe' | 'Fenster & Glas';
  unit: string;
  gwp: number; // kg CO₂-eq / unit
  penrt: number; // MJ / unit
  biogenicC?: number; // kg CO₂ / unit (stored CO₂ as a negative value)
  rec: string; // Recycling potentials
}

export const QNG_DATA: QngMaterial[] = [
  { name: 'Normalbeton C25/30 (CEM I, Standard)', category: 'Mineralisch', unit: 'm³', gwp: 235, penrt: 1250, rec: 'Sehr gut (Rezyklat-Zuschlag Typ I/II für r-Beton)' },
  { name: 'Sonderbeton C30/37 (CEM III, CO₂-reduziert)', category: 'Mineralisch', unit: 'm³', gwp: 145, penrt: 950, rec: 'Sehr gut (Hüttensandmischung, ressourcensparend)' },
  { name: 'Kalksandstein (KS-Planstein, Rohdichte 1.8)', category: 'Mineralisch', unit: 't', gwp: 110, penrt: 980, rec: 'Mittel (Rein aufbereitet zu Kalksandsteinmehl)' },
  { name: 'Porenbetonplanstein', category: 'Mineralisch', unit: 'm³', gwp: 185, penrt: 1850, rec: 'Mittel (Richten für sortenreines Werksrecycling)' },
  { name: 'Hochlochziegel (unverfüllt)', category: 'Mineralisch', unit: 'm³', gwp: 220, penrt: 2300, rec: 'Mittel (Verwendung als Ziegelmehl/Veg-Substrat)' },
  { name: 'Bewehrungsstahl (Sekundärroute, 100% Elektro-Stahlschrott)', category: 'Metalle', unit: 't', gwp: 450, penrt: 5800, rec: 'Hervorragend (unendlich oft einschmelzbar)' },
  { name: 'Bewehrungsstahl (Primärroute, Hochofen mit Eisenerz)', category: 'Metalle', unit: 't', gwp: 1850, penrt: 24500, rec: 'Hervorragend (Stahlschrott rückgewinnbar)' },
  { name: 'Konstruktionsvollholz (KVH / Nadelholz)', category: 'Holz & Organisch', unit: 'm³', gwp: -620, penrt: 1950, biogenicC: -780, rec: 'Hochwertig (Langfristige stoffliche Kaskadennutzung)' },
  { name: 'Brettschichtholz (BSH, Brettschichtholz)', category: 'Holz & Organisch', unit: 'm³', gwp: -580, penrt: 2400, biogenicC: -760, rec: 'Hochwertig (Langfristige stoffliche Kaskadennutzung)' },
  { name: 'Strohballendämmung (Baustroh gepresst)', category: 'Dämmstoffe', unit: 't', gwp: -1100, penrt: 2100, biogenicC: -1300, rec: 'Exzellent (Biologischer Abbau, vollständige Kreislaufrückführung)' },
  { name: 'Holzweichfaserdämmplatte (WF, flexibel)', category: 'Dämmstoffe', unit: 'm³', gwp: -210, penrt: 4100, biogenicC: -460, rec: 'Gut (Thermische Verwertbarkeit nach Kaskade)' },
  { name: 'Mineralwolle (Steinwolle-Dämmplatte)', category: 'Dämmstoffe', unit: 'm³', gwp: 45, penrt: 750, rec: 'Mittel (Schmelz-Recycling im Aufbau)' },
  { name: 'EPS-Hartschaumplatte (erdölbasiert)', category: 'Dämmstoffe', unit: 'm³', gwp: 95, penrt: 2800, rec: 'Gering (Meist thermische Verwertung d. HBCD-Problemtechnik)' },
  { name: 'Zweifach-Wärmeschutzglas (Ug 1.1)', category: 'Fenster & Glas', unit: 'm²', gwp: 32, penrt: 580, rec: 'Gut (Sauerstoff-Schmelzkreislauf im Floatwerk)' },
  { name: 'Dreifach-Wärmeschutzglas (Ug 0.6 premium)', category: 'Fenster & Glas', unit: 'm²', gwp: 48, penrt: 850, rec: 'Gut (Sauerstoff-Schmelzkreislauf im Floatwerk)' }
];

export default function Materialdatenbanken() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedRecordId, setSelectedRecordId] = useState('o-1');

  // States for QNG / LCA Calculator
  const [qngQuantities, setQngQuantities] = useState<Record<string, string>>({});
  const [qngCategoryFilter, setQngCategoryFilter] = useState<string>('Alle');

  const categories = ['Alle', 'Mineralisch / Beton', 'Nachwachsend / Holz', 'Metall', 'Dämmstoffe', 'Ausbau / Trockenbau'];

  const filteredRecords = MOCK_MOCK_RECORDS.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || record.category.includes(selectedCategory.split(' ')[0]);
    return matchesSearch && matchesCategory;
  });

  const activeRecord = MOCK_MOCK_RECORDS.find(r => r.id === selectedRecordId) || MOCK_MOCK_RECORDS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 font-normal">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Database className="text-shiraz" size={24} /> Materialdatenbanken &amp; Informationssysteme
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Professionelle Materialdatenbanken und Informationssysteme bilden das Fundament für verlässliche Kennwertermittlung, Ausschreibung und BIM-Modellierung.
          </p>
        </div>
        
        <div className="text-sm text-slate-705 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed font-normal">
          <p>
            Für die Berechnung der Umweltwirkungen von Gebäuden (Ökobilanzierung / LCA) werden verlässliche Daten zu den eingesetzten Baumaterialien benötigt. 
            Verschiedene Datenbanken stellen diese Informationen in Form von generischen Datensätzen oder spezifischen Umweltproduktdeklarationen (EPDs) zur Verfügung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {DATABASES.map((db, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${db.color} flex flex-col justify-between h-full`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-home-grau/30">
                      {db.icon}
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{db.name}</h3>
                    <span className="text-[10px] bg-white border border-home-grau/30 px-1.5 py-0.5 rounded text-slate-505 font-bold">{db.origin}</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-705 mb-4 leading-relaxed font-normal">
                  {db.description}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-home-grau/30">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {db.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <CheckCircle2 size={12} className="text-shiraz shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
                <a 
                  href={db.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2 px-4 bg-white border border-home-grau/30 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-50 hover:border-shiraz/30 transition-colors"
                >
                  Zur Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive ÖKOBAUDAT Sandbox */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-home-grau/30 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg uppercase tracking-wider">Sandbox</span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="text-blue-600" size={20} />
              Interaktive ÖKOBAUDAT Suchkonsole (Simuliert)
            </h3>
          </div>
          <p className="text-xs text-slate-500">Direktabfrage normgerechter Kennwerte nach DIN EN 15804.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-normal">
          {/* Query Filters Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-home-grau/30 pr-0 lg:pr-5 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Baustoff oder Hersteller suchen..." 
                title="Nach bestimmten Baustoffen oder Herstellern in der ÖKOBAUDAT filtern (z.B. Beton, Gips)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-home-grau/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-shiraz h-10 bg-slate-50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klassen-Filter:</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      // Auto-select first matching record to avoid empty states
                      const matched = MOCK_MOCK_RECORDS.find(r => cat === 'Alle' || r.category.includes(cat.split(' ')[0]));
                      if (matched) setSelectedRecordId(matched.id);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-shiraz text-white border-shiraz' 
                        : 'bg-slate-50 text-slate-600 border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results selection list */}
            <div className="flex flex-col gap-1.5 flex-1 min-h-[180px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Suchergebnisse ({filteredRecords.length}):
              </span>
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[250px] pr-1">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">Keine Datensätze gefunden.</div>
                ) : (
                  filteredRecords.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedRecordId === record.id 
                          ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400/25' 
                          : 'bg-white border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="block text-xs font-semibold text-slate-850 truncate">{record.name}</span>
                        <span className="block text-[10px] text-slate-405 truncate mt-0.5">{record.manufacturer}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        record.type === 'Generisch' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {record.type.split(' ')[0]}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Details Column representing the ÖKOBAUDAT Datasheet schema */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl text-slate-300 font-mono text-[11px] leading-relaxed flex flex-col justify-between shadow-inner">
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="text-emerald-400 shrink-0" size={16} />
                  <span className="text-xs font-bold text-emerald-300 uppercase">ÖKOBAUDAT DATASHEET VIEW</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">ID: {activeRecord.id.toUpperCase()}-LCA</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 pb-3 mb-3 border-b border-gray-900 leading-normal text-xs font-sans text-gray-400">
                <div>Bezeichnung: <strong className="text-white block font-semibold">{activeRecord.name}</strong></div>
                <div>Filterklasse: <strong className="text-white block font-semibold">{activeRecord.category}</strong></div>
                <div>Datenquellen-Typ: <strong className="text-white block font-semibold">{activeRecord.type}</strong></div>
                <div>Deklarationseinheit: <strong className="text-white block font-semibold">{activeRecord.unit}</strong></div>
                <div className="col-span-2">Herausgeber/Hersteller: <strong className="text-white block font-semibold truncate">{activeRecord.manufacturer}</strong></div>
              </div>

              {/* LCIA indicators block */}
              <div className="space-y-2 mt-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Wirkungsabschätzungsindikatoren (LCIA, Modul A1-A3):</span>
                <div className="grid grid-cols-2 gap-3 mt-1.5 text-xs font-sans">
                  <div className="bg-gray-900 border border-gray-850 p-2.5 rounded-xl">
                    <span className="text-[9px] text-gray-400 uppercase font-semibold block">GWP (Treibhauspotenzial)</span>
                    <strong className="text-base text-emerald-400 font-bold block mt-0.5">
                      {formatDeZahl(activeRecord.gwp, 2)} <span className="text-[10px] text-gray-300 font-normal">kg CO₂-eq/{activeRecord.unit.split(' ').pop()}</span>
                    </strong>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Einfluss auf die Erderwärmung.</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-850 p-2.5 rounded-xl">
                    <span className="text-[9px] text-gray-400 uppercase font-semibold block">PENRT (Primärenergie)</span>
                    <strong className="text-base text-amber-500 font-bold block mt-0.5">
                      {activeRecord.penrt.toLocaleString('de-DE')} <span className="text-[10px] text-gray-300 font-normal">MJ/{activeRecord.unit.split(' ').pop()}</span>
                    </strong>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Nicht-erneuerbare Primärenergie.</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-850 p-2.5 rounded-xl">
                    <span className="text-[9px] text-gray-400 uppercase font-semibold block">AP (Versauerung)</span>
                    <strong className="text-base text-blue-400 font-bold block mt-0.5">
                      {formatDeZahl(activeRecord.ap, 3)} <span className="text-[10px] text-gray-300 font-normal">kg SO₂-eq</span>
                    </strong>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Saurer Regen Belastung.</span>
                  </div>

                  <div className="bg-gray-900 border border-gray-850 p-2.5 rounded-xl">
                    <span className="text-[9px] text-gray-400 uppercase font-semibold block">EP (Eutrophierung)</span>
                    <strong className="text-base text-purple-400 font-bold block mt-0.5">
                      {formatDeZahl(activeRecord.ep, 3)} <span className="text-[10px] text-gray-300 font-normal">kg PO₄-eq</span>
                    </strong>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Nährstoffeintrag in Gewässer.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wecobis safety profiles */}
            <div className="mt-4 pt-3 border-t border-gray-900 font-sans">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Leaf size={12} className="text-green-500" />
                Ökologische Begleitinformation (WECOBIS Schnittstelle):
              </span>
              <div className="flex flex-wrap gap-1">
                {activeRecord.wecobisSafety.map((saf, sIdx) => (
                  <span key={sIdx} className="text-[9px] font-semibold bg-gray-900 border border-gray-800 text-green-300 px-2.5 py-0.5 rounded-lg">
                    ✓ {saf}
                  </span>
                ))}
                {activeRecord.recycledContent > 0 && (
                  <span className="text-[9px] font-semibold bg-gray-900 border border-gray-800 text-blue-300 px-2.5 py-0.5 rounded-lg">
                    ♻ Post-Consumer Recycling: {formatDeWert(activeRecord.recycledContent)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QNG-RECHENWERTTABELLE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/15 pb-4">
          <div className="flex items-center gap-3">
            <Leaf className="text-emerald-600 animate-pulse" size={24} />
            <div>
              <h2 className="text-xl font-bold text-text-main">QNG-Rechenwerttabelle &amp; LCA-Schätzer</h2>
              <p className="text-xs text-text-main/60">
                Offizielle Standarddaten der Ökobau.dat für das Qualitätssiegel Nachhaltiges Gebäude (QNG)
              </p>
            </div>
          </div>
          {/* Quick action to clear calculator */}
          {Object.keys(qngQuantities).some(k => qngQuantities[k] !== '') && (
            <button 
              onClick={() => setQngQuantities({})}
              title="Alle Mengeneinschätzungen im Rechner zurücksetzen"
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} /> Rechner zurücksetzen
            </button>
          )}
        </div>

        {/* QNG Methodology Card & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 text-sm text-text-main/80 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed flex flex-col justify-between">
            <div className="space-y-2">
              <p>
                Das <strong>Qualitätssiegel Nachhaltiges Gebäude (QNG)</strong> ist ein staatliches deutsches Gütesiegel. Es setzt anspruchsvolle Grenzwerte für die Treibhausgasemissionen (GWP) und den Primärenergiebedarf (PENRT) im Lebenszyklus eines Gebäudes (A1-A3 Herstellung, A4-A5 Errichtung, B4-B6 Nutzung, C1-C4 Entsorgung).
              </p>
              <p className="text-xs text-text-main/70">
                Diese Rechenwerttabelle bietet Lehrenden und Studierenden der TH Augsburg eine interaktive Arbeitsdatei, um Baustoffentscheidungen bereits im Vorentwurf quantitativ zu bewerten. Tragen Sie einfach die geschätzten projektbezogenen Mengen ein, um die kumulierten Werte in Echtzeit zu überschauen.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 text-xs text-slate-500 mt-3">
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border text-[11px]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> GWP: Global Warming Potential</span>
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border text-[11px]"><span className="w-2 h-2 rounded-full bg-blue-500"></span> PENRT: Primary Energy Non-Renewable</span>
            </div>
          </div>

          {/* Interactive LCA Live Dashboard */}
          <div className="bg-emerald-50/30 border border-emerald-500/20 p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-tight flex items-center gap-1.5 flex-wrap">
                  <Calculator size={15} /> LCA-Echtzeitergebnisse
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                  Entwurfsvorschau
                </span>
              </div>

              {/* GWP indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Treibhausgaspotenzial (A1-A3):</span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-2xl font-bold text-slate-800">
                    {(() => {
                      let totalGwp = 0;
                      QNG_DATA.forEach(mat => {
                        const qty = parseFloat(qngQuantities[mat.name] || '0');
                        if (!isNaN(qty) && qty > 0) {
                          totalGwp += mat.gwp * qty;
                        }
                      });
                      return formatDeZahl(totalGwp / 1000, 2);
                    })()}
                  </span>
                  <span className="text-xs text-slate-500 font-sans font-bold">t CO₂-eq</span>
                </div>
              </div>

              {/* Biogenic Carbon storage */}
              {(() => {
                let totalBiogenic = 0;
                QNG_DATA.forEach(mat => {
                  const qty = parseFloat(qngQuantities[mat.name] || '0');
                  if (!isNaN(qty) && qty > 0 && mat.biogenicC) {
                    totalBiogenic += mat.biogenicC * qty;
                  }
                });
                if (totalBiogenic < 0) {
                  return (
                    <div className="space-y-1 bg-white/70 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 block font-bold uppercase">Biogene Kohlenstoff-Senke:</span>
                      <div className="flex items-baseline gap-1 font-mono text-emerald-700">
                        <span className="text-sm font-bold">
                          {formatDeZahl((totalBiogenic / 1000), 2)}
                        </span>
                        <span className="text-[10px] font-sans font-medium">t CO₂ (interne Einlagerung)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* PENRT indicator */}
              <div className="space-y-1 pt-1.5 border-t border-emerald-500/10">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Primärenergiebedarf (PENRT):</span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-blue-800">
                    {(() => {
                      let totalPenrt = 0;
                      QNG_DATA.forEach(mat => {
                        const qty = parseFloat(qngQuantities[mat.name] || '0');
                        if (!isNaN(qty) && qty > 0) {
                          totalPenrt += mat.penrt * qty;
                        }
                      });
                      return formatDeZahl(totalPenrt / 1000, 1);
                    })()}
                  </span>
                  <span className="text-xs text-blue-500 font-sans font-bold">GJ (Gigajoule)</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-sans text-slate-500 italic leading-snug mt-4 pt-2 border-t border-emerald-500/10">
              Mengen eintragen zur Live-Berechnung. Alle Werte beziehen sich auf die Herstellungs-Ökobilanzierung (A1-A3).
            </div>
          </div>
        </div>

        {/* Table Filters & Search */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search category filters */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {(['Alle', 'Mineralisch', 'Metalle', 'Holz & Organisch', 'Dämmstoffe', 'Fenster & Glas'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setQngCategoryFilter(cat)}
                title={`Kategorie ${cat} filtern`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${qngCategoryFilter === cat ? 'bg-shiraz text-white shadow-xs' : 'bg-white border border-home-grau/25 hover:bg-slate-100 text-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Disclaimer */}
          <span className="text-[11px] font-medium text-slate-500 font-mono">
            Datenquelle: Ökobau.dat / QNG-Rechenwerte
          </span>
        </div>

        {/* QNG Materials List Table */}
        <div className="overflow-x-auto border border-home-grau/20 rounded-xl">
          <table className="w-full text-xs text-left text-slate-800">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-home-grau/20">
              <tr>
                <th className="p-3 w-1/3">Baustoff / Konstruktionsmaterial</th>
                <th className="p-3">Kategorie</th>
                <th className="p-3 text-right">GWP100 (A1-A3)</th>
                <th className="p-3 text-right">PENRT (A1-A3)</th>
                <th className="p-3 text-right w-32">Menge eingeben</th>
                <th className="p-3 text-right font-mono">GWP Summe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {QNG_DATA.filter(mat => qngCategoryFilter === 'Alle' || mat.category === qngCategoryFilter).map((mat, idx) => {
                const qtyVal = qngQuantities[mat.name] || '';
                const numericQty = parseFloat(qtyVal) || 0;
                const rowGwp = mat.gwp * numericQty;
                
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{mat.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                        Rezyklierung: {mat.rec}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        mat.category === 'Mineralisch' ? 'bg-slate-100 text-slate-800' :
                        mat.category === 'Metalle' ? 'bg-amber-100 text-amber-800' :
                        mat.category === 'Holz & Organisch' ? 'bg-emerald-100 text-emerald-800' :
                        mat.category === 'Dämmstoffe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {mat.category}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-mono font-bold ${mat.gwp < 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {formatDeWert(mat.gwp)}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-1">kg CO₂-eq/{mat.unit}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono font-medium text-slate-700">{formatDeWert(mat.penrt)}</span>
                      <span className="text-slate-400 text-[10px] ml-1">MJ/{mat.unit}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1 font-sans">
                        <input 
                          type="number"
                          min="0"
                          placeholder="0"
                          title={`Menge für ${mat.name} in der gewählten Einheit (${mat.unit}) eingeben`}
                          className="w-20 text-right px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-shiraz font-mono text-xs"
                          value={qtyVal}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQngQuantities(prev => ({
                              ...prev,
                              [mat.name]: val
                            }));
                          }}
                        />
                        <span className="text-[10px] font-bold text-slate-500 w-6 text-left">{mat.unit}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {numericQty > 0 ? (
                        <span className={rowGwp < 0 ? 'text-emerald-600' : 'text-shiraz'}>
                          {rowGwp.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kg
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Informational Guidance bar */}
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex items-start gap-3">
          <Info className="text-sky-600 shrink-0 mt-0.5" size={16} />
          <div className="text-xs text-sky-950 space-y-1">
            <span className="font-bold block">Didaktischer Hinweis zur Ökobilanzierung:</span>
            <p className="leading-relaxed font-normal">
              Negative GWP-Werte (z.B. beim Holz oder Stroh) beruhen auf dem Photosynthese-Effekt: Pflanzen speichern atmosphärischen Kohlenstoff während ihres Wachstums. Bei der Berechnung der Netto-LCA über das gesamte Gebäudeleben (Module A-D) müssen diese Speicher im Rückbau (Modul C3/C4) im Falle thermischer Verwertung bilanziell wieder freigelassen werden. Die nachhaltige Kaskadennutzung (z.B. Weiternutzung statt Verbrennung) ist der Schlüssel zur dauerhaften Kohlenstoffspeicherung.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-base font-bold text-slate-900 mb-4">Datenarten in der Ökobilanzierung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Generische Daten</h4>
            <p className="text-xs text-slate-705 mb-3 leading-relaxed">
              Durchschnittswerte für eine bestimmte Produktgruppe (z.B. "Normalbeton C25/30"). 
              Sie werden oft in frühen Planungsphasen verwendet, wenn das genaue Fabrikat noch nicht feststeht.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
              <li>Oft konservative (schlechtere) Annahmen</li>
              <li>Kostenlos in ÖKOBAUDAT verfügbar</li>
              <li>Gut für erste Abschätzungen</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Spezifische Daten (EPDs)</h4>
            <p className="text-xs text-slate-705 mb-3 leading-relaxed">
              Herstellerspezifische Daten für ein konkretes Produkt (z.B. "Zement CEM II/A-LL 42.5 R vom Werk X"). 
              Sie basieren auf realen Produktionsdaten des Herstellers.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
              <li>Meist bessere Umweltwerte als generische Daten</li>
              <li>Wichtig für die finale Zertifizierung</li>
              <li>Müssen von unabhängigen Dritten verifiziert sein</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-0">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="text-shiraz" size={20} />
          Konkretes Praxisbeispiel: Suchen Sie in der ÖKOBAUDAT
        </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Stellen Sie sich vor, Sie planen ein Gebäude und benötigen den <span className="font-semibold cursor-help" title="Global Warming Potential">GWP-Wert</span> (Treibhausgaspotenzial) für die verwendeten Stahlbetonstützen. So gehe vor:
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <div className="flex bg-shiraz/10 text-shiraz w-8 h-8 rounded-full items-center justify-center font-bold shrink-0 text-xs">1</div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Schritt 1: Suchbegriff & Filter</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Sie öffnen die ÖKOBAUDAT und suchen nach <code>Beton C25/30</code>. Sie filtern nach "Generische Datensätze", da Sie sich in der frühen Leistungsphase 2 (Vorplanung) befinden und den genauen Lieferanten noch nicht kennen.
          </p>
        </div>
          </div>

          <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <div className="flex bg-shiraz/10 text-shiraz w-8 h-8 rounded-full items-center justify-center font-bold shrink-0 text-xs">2</div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Schritt 2: Datensatz auswählen</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Sie wählen den Datensatz <span className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-gray-200">Normalbeton (C25/30)</span> aus der Kategorie <i>Betonbauteile</i>. Die Deklarationseinheit (Bezugsgröße) ist <code>1 m³</code>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <div className="flex bg-shiraz/10 text-shiraz w-8 h-8 rounded-full items-center justify-center font-bold shrink-0 text-xs">3</div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Schritt 3: Umweltindikatoren auslesen</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Im Tab "Umweltindikatoren" lies für die Herstellungsphase (A1-A3) den Wert für das Treibhausgaspotenzial (GWP) ab:
              </p>
              <div className="mt-2 bg-white p-2.5 rounded-lg border border-home-grau/30 text-xs font-mono text-center max-w-sm">
                GWP (A1-A3) = 245 kg CO₂-Äqv. / m³
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-home-grau/30 items-start">
             <div className="flex bg-shiraz/10 text-shiraz w-8 h-8 rounded-full items-center justify-center font-bold shrink-0 text-xs">4</div>
             <div>
              <h4 className="font-bold text-slate-900 text-xs">Schritt 4: Anwendung in der Bauwerksbilanz</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Sie multiplizieren Ihre abgerufene Kubatur aus dem CAD-Modell (z. B. 10 m³) mit dem Datenbankwert, um die CO₂-Emissionen der Stützen zu ermitteln: <br/>
                <code>10 m³ × 245 kg CO₂/m³ = 2.450 kg CO₂</code>.
              </p>
              <p className="text-[11px] text-shiraz font-semibold mt-2">
                Tipp: Später im Bauprojekt, wenn der reale Hersteller feststeht, suchen Sie nach der herstellerspezifischen EPD dieses Zementwerks, die oft deutlich niedriger liegt (z. B. 180 kg CO₂-Äqv. / m³), um Ihre Ökobilanz zu verbessern.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Flächenbezogenes Treibhauspotenzial einer Außenwand"
        zielGleichung="GWP_{A} = \sum_k d_k \cdot \rho_k \cdot gwp_{m,k}"
        schritte={[
          { titel: 'Kalksandstein', erklaerung: 'd = 0,175 m, ρ = 1 800 kg/m³, gwp = 0,13 kg CO₂e/kg (Lehrwert):', formel: '0{,}175 \\cdot 1\\,800 \\cdot 0{,}13 = 40{,}95\\,\\text{kg CO}_2\\text{e/m}^2' },
          { titel: 'EPS-Dämmung', erklaerung: 'd = 0,14 m, ρ = 20 kg/m³, gwp = 3,3 kg CO₂e/kg (Lehrwert):', formel: '0{,}14 \\cdot 20 \\cdot 3{,}3 = 9{,}24\\,\\text{kg CO}_2\\text{e/m}^2' },
          { titel: 'Summe A1–A3', erklaerung: 'Ohne Putz und Befestigung:', formel: 'GWP_A = 50{,}2\\,\\text{kg CO}_2\\text{e/m}^2' }
        ]}
        ergebnisHinweis="Werte stets mit Datensatz-ID, Version und Modul (A1–A3, C, D) aus der aktuellen ÖKOBAUDAT übernehmen. Massebezogene und volumenbezogene Deklarationen nicht verwechseln."
        normQuelle="DIN EN 15804+A2; ÖKOBAUDAT (BMWSB/BBSR)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Umrechnung einer massebezogenen EPD auf die funktionale Einheit"
        zielGleichung="GWP_{m^2} = d \cdot \rho \cdot gwp_m"
        schritte={[
          { titel: 'EPD-Angabe', erklaerung: 'Mineralwolle: 1,20 kg CO₂e je kg (A1–A3), Rohdichte 30 kg/m³:', formel: 'gwp_m = 1{,}20\\,\\text{kg CO}_2\\text{e/kg}' },
          { titel: 'Dicke', erklaerung: 'Für U ≈ 0,20 W/(m²K) gewählt:', formel: 'd = 0{,}16\\,\\text{m}' },
          { titel: 'Ergebnis', erklaerung: 'Flächenbezogen:', formel: 'GWP = 0{,}16 \\cdot 30 \\cdot 1{,}20 = 5{,}76\\,\\text{kg CO}_2\\text{e/m}^2' }
        ]}
        ergebnisHinweis="Dämmstoffe nur bei gleicher Wärmeschutzwirkung (gleicher R-Wert) vergleichen – ein besser dämmender Stoff braucht weniger Dicke."
        normQuelle="DIN EN 15804+A2; DIN EN ISO 6946"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialdatenbanken" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 13 Digitales: EN 15804+A2, ÖKOBAUDAT-Nutzung und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Materialdatenbanken', url: 'https://de.wikipedia.org/wiki/Werkstoffdatenbank' }
        ]}
        regelwerke={[
          { title: 'DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarationen)' },
          { title: 'BNB-Kriterium 1.1.1 (Treibhausgaspotenzial und Primärenergiebedarf)', url: 'https://www.bnb-nachhaltigesbauen.de/' }
        ]}
        literatur={[
          'BBSR/BMWSB: ÖKOBAUDAT – Informationsportal und Dokumentation (www.oekobaudat.de)',
          'IBU (Institut Bauen und Umwelt e. V.): Allgemeine EPD-Programmanleitung (aktuelle Fassung)'
        ]}
        formeln={[
          {
            formel: '\\text{GWP}_{\\text{Bauteil}} = \\sum_{k=1}^m A_k \\cdot d_k \\cdot \\rho_k \\cdot \\text{GWP}_{100,k} \\quad [\\text{kg CO}_2\\text{-Äquiv.}]',
            erklaerung: 'Berechnung des Treibhauspotenzials eines mehrschichtigen Bauteils aus den spezifischen ÖKOBAUDAT-Datensätzen über Fläche, Schichtdicke und Rohdichte.',
            quelle: 'ÖKOBAUDAT / DIN EN 15804'
          },
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{j=1}^n \\frac{d_j}{\\lambda_j} + R_{se}} \\quad [\\text{W/(m}^2\\cdot\\text{K)}]',
            erklaerung: 'Wärmedurchgangskoeffizient unter Verwendung der Nenn- und Bemessungswerte der Wärmeleitfähigkeit aus Materialdatenbanken.',
            quelle: 'DIN EN ISO 6946'
          }
        ]}
      />
    </div>
  );
}
