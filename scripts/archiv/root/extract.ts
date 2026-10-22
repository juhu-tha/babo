import fs from 'fs';
import path from 'path';

const file = fs.readFileSync('src/modules/Materialkennwerte.tsx', 'utf-8');

const matDataMatch = file.match(/const materialsData[^=]+=\s*({[\s\S]*?});\n\nconst properties/);
if (matDataMatch) {
  let jsonString = matDataMatch[1];
  // Convert JS object to JSON. This might be tricky with regex, we can try evaluating it.
  
  // Create a temporary file to export it
  const tempFile = 'temp_extract.cjs';
  fs.writeFileSync(tempFile, `
    const materialsData = ${jsonString};
    const fs = require('fs');
    fs.writeFileSync('materials.json', JSON.stringify(materialsData, null, 2));
  `);
  
  // We'll execute it in shell
}
