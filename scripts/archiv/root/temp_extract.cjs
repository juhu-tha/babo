
    const materialsData = {
  // Beton & Mineralische Baustoffe
  beton: {
    name: 'Beton (C30/37)', category: 'Beton & Mineralische Baustoffe',
    density: 2400, eModul: 33000, compressive: 38, tensile: 2.9, thermalCond: 2.0, thermalExp: 10, heatCap: 1000,
  },
  hochleistungsbeton: {
    name: 'Hochleistungsbeton (C80/95)', category: 'Beton & Mineralische Baustoffe',
    density: 2500, eModul: 44000, compressive: 88, tensile: 4.8, thermalCond: 2.2, thermalExp: 10, heatCap: 1000,
  },
  leichtbeton: {
    name: 'Leichtbeton (LC20/22)', category: 'Beton & Mineralische Baustoffe',
    density: 1600, eModul: 15000, compressive: 22, tensile: 1.6, thermalCond: 0.8, thermalExp: 8, heatCap: 1000,
  },
  mauerwerk: {
    name: 'Kalksandstein (KS 12)', category: 'Beton & Mineralische Baustoffe',
    density: 1800, eModul: 8000, compressive: 12, tensile: 1.0, thermalCond: 0.9, thermalExp: 8, heatCap: 1000,
  },
  ziegel: {
    name: 'Ziegelmauerwerk (MZ 12)', category: 'Beton & Mineralische Baustoffe',
    density: 1600, eModul: 4000, compressive: 12, tensile: 0.5, thermalCond: 0.5, thermalExp: 6, heatCap: 1000,
  },
  vollziegel: {
    name: 'Vollziegel (MZ 20)', category: 'Beton & Mineralische Baustoffe',
    density: 1800, eModul: 6000, compressive: 20, tensile: 1.5, thermalCond: 0.81, thermalExp: 5, heatCap: 1000,
  },
  porenbeton: {
    name: 'Porenbeton (PB 4)', category: 'Beton & Mineralische Baustoffe',
    density: 500, eModul: 1500, compressive: 4, tensile: 0.2, thermalCond: 0.12, thermalExp: 8, heatCap: 1000,
  },
  
  // Gesteine
  granit: {
    name: 'Granit', category: 'Gesteine',
    density: 2700, eModul: 50000, compressive: 200, tensile: 15, thermalCond: 2.8, thermalExp: 8, heatCap: 800,
  },
  basalt: {
    name: 'Basalt', category: 'Gesteine',
    density: 2950, eModul: 70000, compressive: 300, tensile: 20, thermalCond: 1.7, thermalExp: 8, heatCap: 840,
  },
  sandstein: {
    name: 'Sandstein', category: 'Gesteine',
    density: 2200, eModul: 15000, compressive: 80, tensile: 5, thermalCond: 2.3, thermalExp: 10, heatCap: 800,
  },
  schiefer: {
    name: 'Schiefer', category: 'Gesteine',
    density: 2800, eModul: 60000, compressive: 120, tensile: 30, thermalCond: 2.0, thermalExp: 9, heatCap: 800,
  },
  
  // Putze & Mörtel
  zementmoertel: {
    name: 'Zementmörtel (M10)', category: 'Putze & Mörtel',
    density: 2000, eModul: 15000, compressive: 10, tensile: 2.0, thermalCond: 1.4, thermalExp: 10, heatCap: 1000,
  },
  kalkmoertel: {
    name: 'Kalkmörtel (M2.5)', category: 'Putze & Mörtel',
    density: 1800, eModul: 4000, compressive: 2.5, tensile: 0.5, thermalCond: 0.8, thermalExp: 8, heatCap: 1000,
  },
  gipsputz: {
    name: 'Gipsputz', category: 'Putze & Mörtel',
    density: 1200, eModul: 3000, compressive: 3, tensile: 1.0, thermalCond: 0.35, thermalExp: 12, heatCap: 1000,
  },
  
  // Metalle
  stahl: {
    name: 'Baustahl (S235)', category: 'Metalle',
    density: 7850, eModul: 210000, compressive: 235, tensile: 360, thermalCond: 50.0, thermalExp: 12, heatCap: 440,
  },
  spannstahl: {
    name: 'Spannstahl (St 1570/1770)', category: 'Metalle',
    density: 7850, eModul: 195000, compressive: 1570, tensile: 1770, thermalCond: 50.0, thermalExp: 12, heatCap: 440,
  },
  edelstahl: {
    name: 'Edelstahl (1.4301 / V2A)', category: 'Metalle',
    density: 7900, eModul: 200000, compressive: 210, tensile: 500, thermalCond: 15.0, thermalExp: 16, heatCap: 500,
  },
  gusseisen: {
    name: 'Gusseisen (EN-GJL-200)', category: 'Metalle',
    density: 7200, eModul: 100000, compressive: 800, tensile: 200, thermalCond: 50.0, thermalExp: 10, heatCap: 500,
  },
  aluminium: {
    name: 'Aluminium (EN AW-6060)', category: 'Metalle',
    density: 2700, eModul: 70000, compressive: 160, tensile: 190, thermalCond: 200.0, thermalExp: 23, heatCap: 900,
  },
  kupfer: {
    name: 'Kupfer (Cu-DHP)', category: 'Metalle',
    density: 8920, eModul: 130000, compressive: 200, tensile: 250, thermalCond: 380.0, thermalExp: 16.5, heatCap: 385,
  },
  titan: {
    name: 'Titan (Grade 2)', category: 'Metalle',
    density: 4500, eModul: 105000, compressive: 400, tensile: 400, thermalCond: 22.0, thermalExp: 8.6, heatCap: 520,
  },

  // Holz & Holzwerkstoffe
  holz: {
    name: 'Nadelholz (C24, 0°)', category: 'Holz & Holzwerkstoffe',
    density: 420, eModul: 11000, compressive: 21, tensile: 14, thermalCond: 0.13, thermalExp: 5, heatCap: 1600,
  },
  laubholz: {
    name: 'Laubholz (D30, Eiche, 0°)', category: 'Holz & Holzwerkstoffe',
    density: 530, eModul: 12000, compressive: 23, tensile: 18, thermalCond: 0.17, thermalExp: 5, heatCap: 1600,
  },
  bsh: {
    name: 'Brettschichtholz (GL24h)', category: 'Holz & Holzwerkstoffe',
    density: 380, eModul: 11500, compressive: 24, tensile: 19.2, thermalCond: 0.13, thermalExp: 5, heatCap: 1600,
  },
  bsp: {
    name: 'Brettsperrholz (BSP)', category: 'Holz & Holzwerkstoffe',
    density: 450, eModul: 11000, compressive: 21, tensile: 14, thermalCond: 0.13, thermalExp: 5, heatCap: 1600,
  },
  osb: {
    name: 'OSB/3-Platte', category: 'Holz & Holzwerkstoffe',
    density: 600, eModul: 3500, compressive: 15, tensile: 9, thermalCond: 0.13, thermalExp: 5, heatCap: 1700,
  },
  spanplatte: {
    name: 'Flachpressplatte (P5)', category: 'Holz & Holzwerkstoffe',
    density: 650, eModul: 2500, compressive: 12, tensile: 8, thermalCond: 0.14, thermalExp: 5, heatCap: 1700,
  },
  mdf: {
    name: 'MDF-Platte', category: 'Holz & Holzwerkstoffe',
    density: 750, eModul: 3000, compressive: 18, tensile: 12, thermalCond: 0.14, thermalExp: 5, heatCap: 1700,
  },
  sperrholz: {
    name: 'Sperrholz (Birke)', category: 'Holz & Holzwerkstoffe',
    density: 700, eModul: 7000, compressive: 30, tensile: 25, thermalCond: 0.15, thermalExp: 5, heatCap: 1600,
  },

  // Dämmstoffe
  eps: {
    name: 'EPS (Styropor)', category: 'Dämmstoffe',
    density: 20, eModul: 5, compressive: 0.1, tensile: 0.15, thermalCond: 0.035, thermalExp: 60, heatCap: 1450,
  },
  xps: {
    name: 'XPS (Styrodur)', category: 'Dämmstoffe',
    density: 35, eModul: 12, compressive: 0.3, tensile: 0.4, thermalCond: 0.035, thermalExp: 60, heatCap: 1450,
  },
  pur: {
    name: 'PUR/PIR-Hartschaum', category: 'Dämmstoffe',
    density: 30, eModul: 8, compressive: 0.15, tensile: 0.2, thermalCond: 0.025, thermalExp: 50, heatCap: 1400,
  },
  mineralwolle: {
    name: 'Mineralwolle (allg.)', category: 'Dämmstoffe',
    density: 50, eModul: 1, compressive: 0.05, tensile: 0.05, thermalCond: 0.035, thermalExp: 0, heatCap: 840,
  },
  steinwolle: {
    name: 'Steinwolle', category: 'Dämmstoffe',
    density: 100, eModul: 1, compressive: 0.05, tensile: 0.05, thermalCond: 0.035, thermalExp: 0, heatCap: 840,
  },
  glaswolle: {
    name: 'Glaswolle', category: 'Dämmstoffe',
    density: 20, eModul: 0.5, compressive: 0.02, tensile: 0.02, thermalCond: 0.035, thermalExp: 0, heatCap: 840,
  },
  holzfaser: {
    name: 'Holzfaserdämmplatte', category: 'Dämmstoffe',
    density: 160, eModul: 2, compressive: 0.05, tensile: 0.05, thermalCond: 0.040, thermalExp: 5, heatCap: 2100,
  },
  zellulose: {
    name: 'Zellulose (Einblasdämmung)', category: 'Dämmstoffe',
    density: 50, eModul: 0.5, compressive: 0.02, tensile: 0.02, thermalCond: 0.040, thermalExp: 5, heatCap: 2100,
  },
  schaumglas: {
    name: 'Schaumglas', category: 'Dämmstoffe',
    density: 120, eModul: 1000, compressive: 0.6, tensile: 0.1, thermalCond: 0.040, thermalExp: 9, heatCap: 840,
  },
  hanffaser: {
    name: 'Hanffaser', category: 'Dämmstoffe',
    density: 40, eModul: 0.5, compressive: 0.02, tensile: 0.02, thermalCond: 0.040, thermalExp: 5, heatCap: 2100,
  },
  schafwolle: {
    name: 'Schafwolle', category: 'Dämmstoffe',
    density: 20, eModul: 0.1, compressive: 0.01, tensile: 0.01, thermalCond: 0.040, thermalExp: 5, heatCap: 1700,
  },
  vip: {
    name: 'Vakuumisolationspaneel (VIP)', category: 'Dämmstoffe',
    density: 180, eModul: 5, compressive: 0.15, tensile: 0.1, thermalCond: 0.007, thermalExp: 0, heatCap: 800,
  },

  // Kunststoffe & Verbundwerkstoffe
  pvc: {
    name: 'PVC (Hart)', category: 'Kunststoffe & Verbundwerkstoffe',
    density: 1400, eModul: 3000, compressive: 80, tensile: 50, thermalCond: 0.16, thermalExp: 80, heatCap: 1000,
  },
  pe: {
    name: 'PE-HD', category: 'Kunststoffe & Verbundwerkstoffe',
    density: 950, eModul: 1000, compressive: 25, tensile: 30, thermalCond: 0.4, thermalExp: 150, heatCap: 1900,
  },
  cfk: {
    name: 'CFK (Carbonfaserverstärkter Kunststoff)', category: 'Kunststoffe & Verbundwerkstoffe',
    density: 1600, eModul: 150000, compressive: 1000, tensile: 1500, thermalCond: 5.0, thermalExp: 0.1, heatCap: 800,
  },
  gfk: {
    name: 'GFK (Glasfaserverstärkter Kunststoff)', category: 'Kunststoffe & Verbundwerkstoffe',
    density: 1800, eModul: 30000, compressive: 300, tensile: 400, thermalCond: 0.3, thermalExp: 15, heatCap: 1200,
  },

  // Glas
  glas: {
    name: 'Floatglas', category: 'Glas',
    density: 2500, eModul: 70000, compressive: 500, tensile: 45, thermalCond: 1.0, thermalExp: 9, heatCap: 720,
  },
  esg: {
    name: 'ESG (Einscheibensicherheitsglas)', category: 'Glas',
    density: 2500, eModul: 70000, compressive: 500, tensile: 120, thermalCond: 1.0, thermalExp: 9, heatCap: 720,
  },
  vsg: {
    name: 'VSG (Verbundsicherheitsglas)', category: 'Glas',
    density: 2500, eModul: 70000, compressive: 500, tensile: 80, thermalCond: 1.0, thermalExp: 9, heatCap: 720,
  },

  // Asphalt & Bitumen
  asphalt: {
    name: 'Walzasphalt', category: 'Asphalt & Bitumen',
    density: 2400, eModul: 5000, compressive: 5, tensile: 1, thermalCond: 1.2, thermalExp: 20, heatCap: 920,
  },
  gussasphalt: {
    name: 'Gussasphalt', category: 'Asphalt & Bitumen',
    density: 2350, eModul: 3000, compressive: 2, tensile: 0.5, thermalCond: 1.0, thermalExp: 30, heatCap: 920,
  },
  bitumen: {
    name: 'Strassenbaubitumen', category: 'Asphalt & Bitumen',
    density: 1040, eModul: 100, compressive: 0, tensile: 0, thermalCond: 0.17, thermalExp: 200, heatCap: 1670,
  },

  // Sonstige
  gipskarton: {
    name: 'Gipskarton', category: 'Sonstige',
    density: 800, eModul: 2500, compressive: 4, tensile: 1.5, thermalCond: 0.25, thermalExp: 15, heatCap: 1000,
  }
};
    const fs = require('fs');
    fs.writeFileSync('materials.json', JSON.stringify(materialsData, null, 2));
  