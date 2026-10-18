const fs = require('fs');

const files = fs.readdirSync('src/modules').filter(f => f.endsWith('.tsx'));
const literatures = new Set();
const rules = new Set();
for (const file of files) {
    const content = fs.readFileSync('src/modules/' + file, 'utf8');
    const literaturMatch = content.match(/literatur=\{\[\s*([^\]]*)\s*\]\}/s);
    if (literaturMatch) {
       const lits = literaturMatch[1].split(',\n').map(s => s.trim().replace(/^'|'$/g, '')).filter(s => s.length > 0);
       for(const l of lits) literatures.add(l);
    }
    const regelwerkeMatch = content.match(/regelwerke=\{\[\s*([^\]]*)\s*\]\}/s);
    if (regelwerkeMatch) {
       const regs = regelwerkeMatch[1].split(',\n').map(s => s.trim().replace(/^'|'$/g, '')).filter(s => s.length > 0);
       for(const r of regs) rules.add(r);
    }
}
let res = "LITERATUR:\n";
for (const l of literatures) {
   res += l + "\n";
}
res += "\n\nREGELWERKE:\n";
for (const r of rules) {
   res += r + "\n";
}
fs.writeFileSync('lit_list.txt', res);
console.log("Done");
