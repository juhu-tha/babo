import fs from 'fs';
import path from 'path';

function analyzeMissingTabs() {
  const tabContextPath = path.join(process.cwd(), 'src/contexts/TabContext.tsx');
  const tabContextContent = fs.readFileSync(tabContextPath, 'utf8');
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  // Routen liegen seit Phase 5 (AP 5.2) in src/routing/ModulInhalt.tsx
  const appContent = fs.readFileSync(appPath, 'utf8') + '\n' + fs.readFileSync(path.join(process.cwd(), 'src/routing/ModulInhalt.tsx'), 'utf8');

  // get all activeTab === '...'
  const matches = [...appContent.matchAll(/activeTab === '([a-zA-Z0-9_\-]+)'/g)].map(m => m[1]);
  const uniqueRenderedTabs = new Set(matches);

  // also get startswith
  // activeTab.startsWith('aufgaben')
  // activeTab === 'weiter_...'

  // TabIds from TabContext
  const matchTabId = tabContextContent.match(/export type TabId\s*=([\s\S]*?);/);
  const tabIds: string[] = [];
  if (matchTabId) {
    matchTabId[1].split('|').forEach(part => {
      const clean = part.trim().replace(/['"]/g, '').trim();
      if (clean && !clean.startsWith('//') && !clean.includes('\n')) {
        tabIds.push(clean);
      }
    });
  }

  console.log('Total TabIds:', tabIds.length);
  console.log('Directly rendered activeTab === ids in App.tsx:', uniqueRenderedTabs.size);

  const unhandled = tabIds.filter(id => {
    if (uniqueRenderedTabs.has(id)) return false;
    if (id.startsWith('aufgaben_')) return false; // Handled by activeTab.startsWith('aufgaben')
    if (id.startsWith('weiter_')) return false; // Handled by WeiterTHA
    if (id === 'aufgaben') return false;
    return true;
  });

  console.log('Truly unhandled TabIds:', unhandled);
}

analyzeMissingTabs();
