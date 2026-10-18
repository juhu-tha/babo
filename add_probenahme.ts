import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert tab
if (!content.includes("id: 'probenahme'")) {
  content = content.replace(
    "{ id: 'labor', label: 'Virtuelle Versuche', icon: Beaker },",
    "{ id: 'probenahme', label: 'Probenahme & Erkundung', icon: FileSearch },\n      { id: 'labor', label: 'Virtuelle Versuche', icon: Beaker },"
  );
}

// Insert Component import
if (!content.includes("const Probenahme = React.lazy")) {
  content = content.replace(
    "const Labor = React.lazy(() => import('./modules/Labor'));",
    "const Labor = React.lazy(() => import('./modules/Labor'));\nconst Probenahme = React.lazy(() => import('./modules/Probenahme'));"
  );
}

// Insert Route
if (!content.includes("<Probenahme />")) {
  content = content.replace(
    "{activeTab === 'labor' && <Labor />}",
    "{activeTab === 'labor' && <Labor />}\n          {activeTab === 'probenahme' && <Probenahme />}"
  );
}

// Ensure icon is imported
if (!content.match(/import \{[^}]*FileSearch[^}]*\} from 'lucide-react';/)) {
  content = content.replace(
    /import \{([^\}]*)\}\s*from\s*'lucide-react';/,
    (match, p1) => `import { ${p1.trim()}, FileSearch } from 'lucide-react';`
  );
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
