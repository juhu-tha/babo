// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)

// Standardized RStO 12/24 Profiles for different Belastungsklassen (Bk)
export interface LayerInfo {
  name: string;
  thickness: number; // in cm
  material: string;
  normRequirement: string;
  bgClass: string;
  borderColor: string;
}

export interface RstoProfile {
  title: string;
  description: string;
  totalThickness: number; // in cm
  layers: LayerInfo[];
}

export const RSTO_ASPHALT_DATA: Record<string, RstoProfile> = {
  'Bk100': {
    title: 'Autobahn / Schwerstverkehr (Bk100)',
    description: 'Für hochbelastete Autobahnen mit hohem Schwerverkehr (> 32 Mio. äquivalente 10-t-Achsübergänge nach RStO 12/24). Fokus auf Spurbildungswiderstand und Verformungsstabilität.',
    totalThickness: 85,
    layers: [
      { name: 'Asphaltdeckschicht (SMA 8 S oder PA)', thickness: 4, material: 'Splittmastixasphalt / Offenporig mit PmB 25/55-55 A', normRequirement: 'PSV-Wert ≥ 51 (hohe Griffigkeit), Hohlraumgehalt 3,0-4,5 Vol.-%', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 6, material: 'Asphaltbinder mit PmB 25/55-55 A', normRequirement: 'Dicke 6 cm, hohe Standfestigkeit gegen Schubverformungen im Sommer', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 32 TS)', thickness: 24, material: 'Straßenbaubitumen 50/70 oder PmB', normRequirement: 'Dicke 24 cm in mehreren Lagen, Bindergehalt ≥ 4,2 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 51, material: 'Kies/Splitt-Gemisch (GW/GI, FSS 0/45)', normRequirement: 'Ev2 ≥ 120 MPa auf der Frostschutzschicht, frostunempfindliches Material nach TL SoB-StB', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk32': {
    title: 'Hauptverkehrsstraße / Fernstraße (Bk32)',
    description: 'Bundesstraßen und stark befahrene Landesstraßen (10 bis 32 Mio. äquivalente 10-t-Achsübergänge). Hohe statische und dynamische Belastbarkeit erforderlich.',
    totalThickness: 75,
    layers: [
      { name: 'Asphaltdeckschicht (SMA 11 S oder AC 11 D S)', thickness: 4, material: 'Splittmastix- / Beton-Asphalt mit PmB oder 50/70', normRequirement: 'PSV-Wert ≥ 51, Einbaudicke ca. 4 cm nach ZTV Asphalt-StB', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 6, material: 'Asphaltbinder mit 50/70 oder PmB', normRequirement: 'Hohlraumgehalt des Marshall-Probekörpers 4,0-6,0 Vol.-%', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 16, material: 'Straßenbaubitumen 50/70', normRequirement: 'Bindergehalt ≥ 4,3 M.-%, Verdichtungsgrad ≥ 98,0%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 49, material: 'Frostschutzsand / Kiessand-Gemisch (0/32 od. 0/45)', normRequirement: 'Statischer Verformungsmodul EV2 ≥ 120 MPa', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk10': {
    title: 'Hauptsammelstraße / Industrie (Bk10)',
    description: 'Verbindungsstraßen, Hauptdurchgangsstraßen und Industriegebiets-Erschließungen (3,2 bis 10 Mio. äquivalente 10-t-Achsübergänge). Ausgelegt auf hohe Radlasten.',
    totalThickness: 65,
    layers: [
      { name: 'Asphaltdeckschicht (AC 11 D S / SMA 8)', thickness: 4, material: 'Asphaltbeton / SMA mit 50/70', normRequirement: 'Gute Verschleißfestigkeit, PSV-Wert ≥ 48', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 5, material: 'Binder mit Straßenbaubitumen 50/70', normRequirement: 'Hohlraumfüllungsgrad mind. 70%', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 13, material: 'Bitumen 50/70 oder 70/100', normRequirement: 'Dicke 13 cm, Bindergehalt ≥ 4,3 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 43, material: 'Sand-Kies-Schottergemisch FSS', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS (Bk100–Bk1,8; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk3.2': {
    title: 'Sammelstraße / Landstraße (Bk3.2)',
    description: 'Ortsverbindungsstraßen und Sammelstraßen (1,8 bis 3,2 Mio. äquivalente 10-t-Achsübergänge). Geringerer Lkw-Anteil.',
    totalThickness: 60,
    layers: [
      { name: 'Asphaltdeckschicht (AC 11 D / SMA 8)', thickness: 4, material: 'Asphaltbeton mit 70/100', normRequirement: 'Hohlraumgehalt am fertigen Bauteil 1,5-4,5 Vol.-%', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 14, material: 'Straßenbaubitumen 70/100', normRequirement: 'Verdichtungsgrad ≥ 97,0%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 42, material: 'Sand/Schotter-Recycling-Gemisch', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS (Bk100–Bk1,8; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk1.0': {
    title: 'Wohnstraße / Ortskanal (Bk1.0)',
    description: 'Anlieger- und Wohnstraßen (0,3 bis 1,0 Mio. äquivalente 10-t-Achsübergänge), wenig Schwerverkehr.',
    totalThickness: 55,
    layers: [
      { name: 'Asphaltdeckschicht (AC 8 N oder AC 11 N)', thickness: 4, material: 'Asphaltbeton mit weicherem Bitumen 70/100', normRequirement: 'Dichtheit gegen Sauerstoff/Wasser, PSV ≥ 45 ausreichend', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TN)', thickness: 10, material: 'Straßenbaubitumen 70/100', normRequirement: 'Verdichtungsgrad ≥ 97,0%, Bindergehalt ≥ 4,3 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 41, material: 'Sand-Kies FSS', normRequirement: 'Ev2 ≥ 100 MPa auf der FSS (Bk1,0–Bk0,3; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk0.3': {
    title: 'Anliegerweg / Parkplatz (Bk0.3)',
    description: 'Gering belastete Erschließungsflächen (≤ 0,3 Mio. äquivalente 10-t-Achsübergänge).',
    totalThickness: 50,
    layers: [
      { name: 'Asphaltdeckschicht (AC 8 N / AC 5 N)', thickness: 4, material: 'Asphaltbeton mit Bitumen 70/100 oder 160/220', normRequirement: 'Dichte Deckschicht, gute Verdichtung', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TN)', thickness: 8, material: 'Bitumen 70/100', bgClass: 'bg-zinc-600 text-zinc-200', normRequirement: 'Anforderungen nach TL/ZTV Asphalt-StB', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 38, material: 'Kies/Schotter-Gemisch 0/45', normRequirement: 'Ev2 ≥ 100 MPa auf der FSS (Bk1,0–Bk0,3; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  }
};

export const RSTO_CONCRETE_DATA: Record<string, RstoProfile> = {
  'Bk100': {
    title: 'Autobahn - Betonbauweise (Bk100)',
    description: 'Starre Befestigung mit hoher Dauerhaftigkeit (Bemessungszeitraum nach RStO in der Regel 30 Jahre; tatsächliche Nutzungsdauer oft länger). Keine Spurrinnen durch plastische Verformung.',
    totalThickness: 85,
    layers: [
      { name: 'Betondecke (ZTV Beton-StB) mit Dübeln', thickness: 30, material: 'Beton C30/37 mit hohem Frost-Tausalz-Widerstand (XM2/XF4)', normRequirement: 'Verschleißwiderstand, Gestein mit hohem PSV-Wert, Dübel in Quer- und Anker in Längsscheinfugen', bgClass: 'bg-slate-300 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Vliesstoff / Trennlage', thickness: 0.5, material: 'Geotextil (Georaster / Vlies)', normRequirement: 'Entkopplung zwischen Betondecke und Tragschicht gegen Rissfortleitung', bgClass: 'bg-slate-200 text-slate-600', borderColor: 'border-home-grau/30' },
      { name: 'Hydraulisch gebundene Tragschicht (HGT)', thickness: 15, material: 'Zementgebundenes Gesteinsgemisch', normRequirement: 'Druckfestigkeit nach TL Beton-StB (Lehrwert ca. 7–12 MPa, manuell prüfen)', bgClass: 'bg-slate-400 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 39.5, material: 'Schottertragschicht / Frostschutzsand', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk32': {
    title: 'Verkehrskreisel / Bushaltestelle - Betonbauweise (Bk32)',
    description: 'Starre Bauweise für Bereiche mit Brems-, Anfahr- und Schubkräften sowie langsamem Schwerverkehr.',
    totalThickness: 75,
    layers: [
      { name: 'Betondecke (bewehrt / verdübelt)', thickness: 26, material: 'Fahrbahndeckenbeton C30/37 (Kornklasse 0/22)', normRequirement: 'Festigkeitsklasse und Oberfläche nach ZTV Beton-StB (z. B. Waschbeton für Griffigkeit und Lärmminderung)', bgClass: 'bg-slate-300 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Vliesstoff / Trennlage', thickness: 0.5, material: 'Geotextil', normRequirement: 'Trenn- und Entwässerungselement', bgClass: 'bg-slate-200 text-slate-600', borderColor: 'border-home-grau/30' },
      { name: 'Hydraulisch gebundene Tragschicht (HGT)', thickness: 15, material: 'HGT nach ZTV Beton-StB', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS unter der HGT', bgClass: 'bg-slate-400 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Frostschutzschicht', thickness: 33.5, material: 'Frostunempfindliches Gestein 0/45', normRequirement: 'Verdichtungsgrad DPr ≥ 103%', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  }
};
