import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('materials.json', 'utf-8'));

const propertiesSchema = [
  { id: 'density', label: 'Rohdichte ρ', unit: 'kg/m³', desc: 'Masse pro Volumeneinheit.' },
  { id: 'eModul', label: 'E-Modul E', unit: 'MPa', desc: 'Widerstand gegen elastische Verformung (Steifigkeit).' },
  { id: 'compressive', label: 'Druckfestigkeit fc', unit: 'MPa', desc: 'Maximal ertragbare Druckspannung.' },
  { id: 'tensile', label: 'Zugfestigkeit ft', unit: 'MPa', desc: 'Maximal ertragbare Zugspannung.' },
  { id: 'thermalCond', label: 'Wärmeleitfähigkeit λ', unit: 'W/(m·K)', desc: 'Fähigkeit, thermische Energie zu transportieren.' },
  { id: 'thermalExp', label: 'Wärmedehnungkoeff. αT', unit: '10⁻⁶ 1/K', desc: 'Längenänderung bei Temperaturänderung um 1 Kelvin.' },
  { id: 'heatCap', label: 'Spez. Wärmekapazität cp', unit: 'J/(kg·K)', desc: 'Energie, um 1 kg des Stoffes um 1 K zu erwärmen.' }
];

const categoryMap = new Map();
const materials = [];

for (const [id, data] of Object.entries(rawData as Record<string, any>)) {
  const { name, category, ...props } = data;
  
  let categoryId = "";
  for (const [k, v] of categoryMap.entries()) {
    if (v.name === category) categoryId = k;
  }
  
  if (!categoryId) {
    categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    categoryMap.set(categoryId, { id: categoryId, name: category });
  }

  materials.push({
    id,
    categoryId,
    name,
    properties: props,
    metadata: {}
  });
}

const optimizedLibrary = {
  version: "1.0.0",
  schema: propertiesSchema,
  categories: Array.from(categoryMap.values()),
  materials: materials
};

if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}
fs.writeFileSync('src/data/materials.json', JSON.stringify(optimizedLibrary, null, 2));

console.log('Optimized library written to src/data/materials.json');
