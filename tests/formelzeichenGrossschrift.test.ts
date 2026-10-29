// Formelzeichen nie in CSS-Großschrift (Befund 28.10.2026: „SPANNUNG Σ“, „DEHNUNG E“, „FLIESSGRENZE Τ0“):
// In Elementen mit der Klasse `uppercase` darf im direkten Text kein griechischer Kleinbuchstabe stehen –
// Formelzeichen gehören in <Fz> (src/components/ui/Formelzeichen.tsx, normal-case).
import fs from 'node:fs';
import path from 'node:path';

const fehler: string[] = [];
console.log('--- Test: Formelzeichen ohne Großschrift ---');

const wurzel = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const dateien: string[] = [];
const lauf = (d: string) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) lauf(p);
    else if (p.endsWith('.tsx')) dateien.push(p);
  }
};
lauf(wurzel);

// Öffnendes Tag mit „uppercase“ in className, danach direkter Text bis zum nächsten Tag oder Ausdruck
const muster = /className=[{"`][^>]*?\buppercase\b[^>]*>([^<{]*)/gs;
const griechisch = /[α-ωϑϕ]/;
for (const datei of dateien) {
  const s = fs.readFileSync(datei, 'utf8');
  for (const m of s.matchAll(muster)) {
    if (griechisch.test(m[1])) {
      const zeile = s.slice(0, m.index).split('\n').length;
      fehler.push(`${path.relative(wurzel, datei)}:${zeile} „${m[1].trim().slice(0, 50)}“`);
    }
  }
}

// Selbsttest des Musters
const probe = '<span className="text-xs uppercase">Spannung σ</span><span className="uppercase">Spannung <Fz>σ</Fz></span>';
const treffer = [...probe.matchAll(muster)].filter(m => griechisch.test(m[1])).length;
if (treffer !== 1) fehler.push(`Selbsttest: ${treffer} statt 1 Treffer`);
if (dateien.length < 50) fehler.push(`zu wenige Dateien gefunden (${dateien.length})`);

if (fehler.length) { fehler.slice(0, 30).forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`alle Prüfungen bestanden (${dateien.length} Dateien)`);
