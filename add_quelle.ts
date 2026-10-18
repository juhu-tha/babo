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
  const regex = /(erklaerung:\s*['"`][\s\S]*?(?:(?<!\\)['"`]|(?<=\\\\)(['"`])))(\s*\n?\s*})/g;

  let newContent = content;
  if (content.includes('formeln={[')) {
      // simpler regex just looking for "erklaerung:" up to next property or bracket
      // actually, since we have JSX, the string might have commas.
      // let's try a safer replace just on the erklaerungs string end
      newContent = content.replace(/(erklaerung:\s*['"`][^`'"]*?['"`])(\s*\n?\s*})/g, `$1,\n              quelle: '${source.replace(/'/g, "\\'")}'$2`);
  }

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${file} with source: ${source}`);
  }
}
