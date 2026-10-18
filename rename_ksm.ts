import fs from 'fs';
const filePath = 'src/modules/Mischungsberechnung.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace ksm with hues in variable names
content = content.replace(/\bksm\b/g, 'hues');
content = content.replace(/\bKsm\b/g, 'Hues');
content = content.replace(/\bKSM\b/g, 'HÜS');

fs.writeFileSync(filePath, content);
console.log('Done');
