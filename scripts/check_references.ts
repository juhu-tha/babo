import fs from 'fs';
import path from 'path';

function findOccurrences(term: string) {
  const srcDir = path.join(process.cwd(), 'src');
  const results: { file: string; line: number; text: string }[] = [];

  function search(dir: string) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        search(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(`'${term}'`) || line.includes(`"${term}"`)) {
            // ignore TabContext definition itself
            if (!fullPath.includes('TabContext.tsx')) {
              results.push({
                file: path.relative(process.cwd(), fullPath),
                line: idx + 1,
                text: line.trim()
              });
            }
          }
        });
      }
    });
  }

  search(srcDir);
  return results;
}

const unhandled = [
  'infos_info',
  'dpp_epd',
  'digitales_gesamt',
  'divider_digitales',
  'biegezugversuch',
  'frischbetontemperatur',
  'hydratation',
  'nachhaltigkeit',
  'zertifizierung',
  'produktsiegel',
  'porositaet',
  'ermuedung',
  'zementchemie',
  'baubetrieb',
  'statistische_versuchsplanung',
  'praxisbeispiele',
  'kreislaufwirtschaft',
  'preisentwicklung',
  'lebensdauern',
  'stahlbau',
  'festigkeitsberechnungen',
  'obsoleted_ref',
  'lokales',
  'steifigkeit',
  'lca',
  'ressourcen_emissionen',
  'lcc',
  'stahlbeton',
  'bauprodukte',
  'sonderbeton'
];

unhandled.forEach(term => {
  const occ = findOccurrences(term);
  console.log(`\n=== Term: "${term}" (${occ.length} usages outside TabContext) ===`);
  occ.slice(0, 5).forEach(o => {
    console.log(`  ${o.file}:${o.line} -> ${o.text}`);
  });
});
