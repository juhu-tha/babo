import fs from 'fs';
import path from 'path';

function checkModulstrukturNodes() {
  const modulPath = path.join(process.cwd(), 'src/modules/Modulstruktur.tsx');
  const modulContent = fs.readFileSync(modulPath, 'utf8');
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  // get all rendered tabs in App.tsx
  const matches = [...appContent.matchAll(/activeTab === '([a-zA-Z0-9_\-]+)'/g)].map(m => m[1]);
  const renderedTabs = Array.from(new Set(matches));

  // get all node IDs in Modulstruktur.tsx
  const nodeMatches = [...modulContent.matchAll(/id:\s*'([a-zA-Z0-9_\-]+)'/g)].map(m => m[1]);
  const modulNodes = new Set(nodeMatches);

  const missingFromModulstruktur = renderedTabs.filter(id => !modulNodes.has(id));
  console.log(`Rendered tabs count: ${renderedTabs.length}`);
  console.log(`Modulstruktur node count: ${modulNodes.size}`);
  console.log(`Missing from Modulstruktur (${missingFromModulstruktur.length}):`, missingFromModulstruktur);
}

checkModulstrukturNodes();
