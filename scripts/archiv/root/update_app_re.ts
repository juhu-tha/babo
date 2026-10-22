import fs from 'fs';

let appStr = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importStatement = "import RessourcenEmissionen from './modules/RessourcenEmissionen';\n";
appStr = appStr.replace(/import LCA from '\.\/modules\/LCA';/, "import LCA from './modules/LCA';\n" + importStatement);

// Add Tab
const tabStatement = "      { id: 'ressourcen_emissionen', label: 'Ressourcen & Emissionen', icon: Factory },";
appStr = appStr.replace(/\{ id: 'lca', label: 'Ökobilanzierung \(LCA\)', icon: Leaf \},/, "{ id: 'lca', label: 'Ökobilanzierung (LCA)', icon: Leaf },\n" + tabStatement);

// Add component render
const renderStatement = "          {activeTab === 'ressourcen_emissionen' && <RessourcenEmissionen />}";
appStr = appStr.replace(/\{activeTab === 'lca' && <LCA \/>\}/, "{activeTab === 'lca' && <LCA />}\n" + renderStatement);

fs.writeFileSync('src/App.tsx', appStr);

let ctxStr = fs.readFileSync('src/contexts/TabContext.tsx', 'utf8');
ctxStr = ctxStr.replace(/\| 'lca'/, "| 'lca'\n  | 'ressourcen_emissionen'");
fs.writeFileSync('src/contexts/TabContext.tsx', ctxStr);
console.log('App and TabContext updated');
