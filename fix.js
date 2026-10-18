const fs = require('fs');
let text = fs.readFileSync('src/modules/Schadstoffe.tsx', 'utf-8');
text = text.replace("split(\\'-\\')", "split('-')");
fs.writeFileSync('src/modules/Schadstoffe.tsx', text, 'utf-8');
