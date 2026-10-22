import fs from 'fs';
import path from 'path';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert tab
if (!appContent.includes("id: 'energieausweis'")) {
  appContent = appContent.replace(
    "{ id: 'brandschutz', label: 'Brandschutz', icon: Flame },",
    "{ id: 'brandschutz', label: 'Brandschutz', icon: Flame },\n      { id: 'energieausweis', label: 'Energieausweis', icon: FileCheck },"
  );
}

// Ensure icon is imported
if (!appContent.match(/import \{[^}]*FileCheck[^}]*\} from 'lucide-react';/)) {
  appContent = appContent.replace(
    /import \{([^\}]*)\}\s*from\s*'lucide-react';/,
    (match, p1) => `import { ${p1.trim()}, FileCheck } from 'lucide-react';`
  );
}

// Insert Component import
if (!appContent.includes("const Energieausweis = React.lazy")) {
  appContent = appContent.replace(
    "const Brandschutz = React.lazy(() => import('./modules/Brandschutz'));",
    "const Brandschutz = React.lazy(() => import('./modules/Brandschutz'));\nconst Energieausweis = React.lazy(() => import('./modules/Energieausweis'));"
  );
}

// Insert Route
if (!appContent.includes("<Energieausweis />")) {
  appContent = appContent.replace(
    "{activeTab === 'brandschutz' && <Brandschutz />}",
    "{activeTab === 'brandschutz' && <Brandschutz />}\n          {activeTab === 'energieausweis' && <Energieausweis />}"
  );
}

fs.writeFileSync('src/App.tsx', appContent, 'utf-8');
