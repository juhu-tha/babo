import fs from 'fs';

let content = fs.readFileSync('src/modules/Labor.tsx', 'utf-8');

// Remove import
content = content.replace("import Probenahme from './Probenahme';\n", "");

// Change default state if it was 'probenahme'
content = content.replace("useState<'probenahme' | 'frischbeton' | 'biegezugversuch' | 'bitumen_versuche'>('probenahme')", "useState<'frischbeton' | 'biegezugversuch' | 'bitumen_versuche'>('frischbeton')");

// Change type
content = content.replace("type LabMode = 'probenahme' | 'frischbeton' | 'biegezugversuch' | 'bitumen_versuche';", "type LabMode = 'frischbeton' | 'biegezugversuch' | 'bitumen_versuche';");


// Remove button and tab content
const buttonRegex = /<button[^>]*>\s*<Beaker size=\{16\} \/> Probenahme\s*<\/button>\s*/;
content = content.replace(buttonRegex, "");

// Remove tab condition
const tabContentRegex = /\{labMode === 'probenahme' \? \(\s*<Probenahme \/>\s*\) : labMode === 'frischbeton' \? \(/;
content = content.replace(tabContentRegex, "{labMode === 'frischbeton' ? (");

fs.writeFileSync('src/modules/Labor.tsx', content, 'utf-8');
