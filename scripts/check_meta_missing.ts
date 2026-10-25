import fs from 'fs';
import path from 'path';

function findMissingDescriptions() {
  const metaPath = path.join(process.cwd(), 'src/metaDescriptions.ts');
  const metaContent = fs.readFileSync(metaPath, 'utf8');
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  // Routen liegen seit Phase 5 (AP 5.2) in src/routing/ModulInhalt.tsx
  const appContent = fs.readFileSync(appPath, 'utf8') + '\n' + fs.readFileSync(path.join(process.cwd(), 'src/routing/ModulInhalt.tsx'), 'utf8');

  // Find all activeTab === '...'
  const matches = [...appContent.matchAll(/activeTab === '([a-zA-Z0-9_\-]+)'/g)].map(m => m[1]);
  const renderedTabs = Array.from(new Set(matches));

  const missing: string[] = [];
  renderedTabs.forEach(id => {
    // check if key exists in metaDescriptions
    const regex = new RegExp(`['"]?${id}['"]?\\s*:`);
    if (!regex.test(metaContent)) {
      missing.push(id);
    }
  });

  console.log(`Rendered tabs count: ${renderedTabs.length}`);
  console.log(`Missing in metaDescriptions (${missing.length}):`, missing);
}

findMissingDescriptions();
