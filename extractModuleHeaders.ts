import * as fs from 'fs';
import * as path from 'path';

const modulesDir = path.join(process.cwd(), 'src', 'modules');

interface ModuleHeaderInfo {
  file: string;
  firstH2orH3Line: string;
  followingBlock: string;
  hasGrayBox: boolean;
  hasStudierendeText: boolean;
}

function analyze() {
  const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.tsx'));
  const results: ModuleHeaderInfo[] = [];

  files.forEach(file => {
    const filePath = path.join(modulesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let firstH2orH3Line = '';
    let followingBlock = '';
    let hasGrayBox = false;
    let hasStudierendeText = content.match(/Studierende/gi) !== null;

    // Find the first occurrence of <h2 or <h3
    let matchIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('<h2') || line.includes('<h3')) {
        firstH2orH3Line = line.trim();
        matchIndex = i;
        break;
      }
    }

    if (matchIndex !== -1) {
      // Look at the next few lines (up to 15) to see the description block
      const followingLines = lines.slice(matchIndex + 1, matchIndex + 25);
      followingBlock = followingLines.map(l => l.trim()).join(' ');
      
      // Let's refine check for gray box right after header
      const chunk = followingLines.join('\n');
      if (chunk.includes('bg-off-white') && chunk.includes('rounded-xl') && chunk.includes('border')) {
        hasGrayBox = true;
      }
    }

    results.push({
      file,
      firstH2orH3Line,
      followingBlock: followingBlock.substring(0, 150),
      hasGrayBox,
      hasStudierendeText,
    });
  });

  fs.writeFileSync('moduleHeaders.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`Analyzed ${files.length} files. Saved to moduleHeaders.json.`);
}

analyze();
