import fs from 'fs';
import path from 'path';

const modulesDir = path.join(process.cwd(), 'src', 'modules');
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(modulesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Try to find literatur or regelwerke
  let literaturMatch = content.match(/literatur=\{\[\s*(['"`].*?['"`])/);
  let regelwerkeMatch = content.match(/regelwerke=\{\[\s*(['"`].*?['"`])/);
  
  let source = "Allgemeine Fachliteratur";
  if (literaturMatch && literaturMatch[1]) {
    source = literaturMatch[1].replace(/['"`]/g, '').trim();
  } else if (regelwerkeMatch && regelwerkeMatch[1]) {
    source = regelwerkeMatch[1].replace(/['"`]/g, '').trim();
  }
  
  if (source.length > 50) {
    source = source.substring(0, 50) + "...";
  }

  // Regex to match erklaerung line inside formeln array and add quelle after it
  // This is a naive replacement, but should work for most files
  const regex = /(erklaerung:\s*['"`][\s\S]*?['"`])(\s*\n?\s*})/g;

  let newContent = content;
  if (content.includes('formeln={[')) {
      newContent = content.replace(regex, `$1,\n              quelle: '${source}'$2`);
  }

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${file} with source: ${source}`);
  }
}
