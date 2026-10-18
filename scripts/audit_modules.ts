import fs from 'fs';
import path from 'path';

function runDetailedAudit() {
  const tabContextPath = path.join(process.cwd(), 'src/contexts/TabContext.tsx');
  const tabContextContent = fs.readFileSync(tabContextPath, 'utf8');

  // match type TabId
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

  const appPath = path.join(process.cwd(), 'src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  const metaDescPath = path.join(process.cwd(), 'src/metaDescriptions.ts');
  const metaDescContent = fs.readFileSync(metaDescPath, 'utf8');

  const modulstrukturPath = path.join(process.cwd(), 'src/modules/Modulstruktur.tsx');
  const modulstrukturContent = fs.existsSync(modulstrukturPath) ? fs.readFileSync(modulstrukturPath, 'utf8') : '';

  console.log('Total unique TabIds in TabContext:', tabIds.length);

  // 1. Check if rendered in App.tsx
  const notRenderedInApp: string[] = [];
  tabIds.forEach(id => {
    // Check either activeTab === 'id' or activeTab === "id"
    if (!appContent.includes(`activeTab === '${id}'`) && !appContent.includes(`activeTab === "${id}"`)) {
      notRenderedInApp.push(id);
    }
  });

  // 2. Check if present in metaDescriptions
  const missingMeta: string[] = [];
  tabIds.forEach(id => {
    if (!metaDescContent.includes(`'${id}'`) && !metaDescContent.includes(`"${id}"`) && !metaDescContent.includes(`${id}:`)) {
      missingMeta.push(id);
    }
  });

  // 3. Check if present in Modulstruktur
  const missingModulstruktur: string[] = [];
  tabIds.forEach(id => {
    if (!modulstrukturContent.includes(`'${id}'`) && !modulstrukturContent.includes(`"${id}"`)) {
      missingModulstruktur.push(id);
    }
  });

  console.log('--- AUDIT RESULTS ---');
  console.log('TabIds NOT handled in App.tsx (Dead Tabs?):', notRenderedInApp.length, notRenderedInApp);
  console.log('TabIds missing in metaDescriptions.ts:', missingMeta.length, missingMeta);
  console.log('TabIds missing in Modulstruktur.tsx (Not in syllabus):', missingModulstruktur.length, missingModulstruktur);

  // 4. Module files in src/modules/ that might not be used anywhere
  const modulesDir = path.join(process.cwd(), 'src/modules');
  const allModuleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  
  const unusedFiles: string[] = [];
  allModuleFiles.forEach(file => {
    const baseName = file.replace(/\.(tsx|ts)$/, '');
    if (!appContent.includes(baseName) && !modulstrukturContent.includes(baseName)) {
      // check if imported by any other file
      const isImported = checkImported(baseName);
      if (!isImported) {
        unusedFiles.push(file);
      }
    }
  });
  console.log('Unused or isolated module files:', unusedFiles.length, unusedFiles);
}

function checkImported(moduleName: string): boolean {
  const srcDir = path.join(process.cwd(), 'src');
  const allFiles = getAllFiles(srcDir);
  for (const file of allFiles) {
    const c = fs.readFileSync(file, 'utf8');
    if (c.includes(`/${moduleName}'`) || c.includes(`/${moduleName}"`) || c.includes(`{ ${moduleName} }`)) {
      return true;
    }
  }
  return false;
}

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

runDetailedAudit();
