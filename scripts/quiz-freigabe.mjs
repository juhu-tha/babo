#!/usr/bin/env node
/**
 * Überträgt einen Export der Fragenfreigabe (Admin → Fragenfreigabe) in src/data/quiz.json (AP 3.5).
 *   node scripts/quiz-freigabe.mjs <export.json> "<Name der prüfenden Person>"
 * Freigegebene Fragen erhalten reviewer, reviewedAt und verified = true. Kommentare werden in
 * docs/quiz-kommentare.md gesammelt und dort abgearbeitet. Die Formatierung von quiz.json bleibt erhalten.
 */
import fs from 'fs';
const [datei, pruefer] = process.argv.slice(2);
if (!datei || !pruefer) { console.error('Aufruf: node scripts/quiz-freigabe.mjs <export.json> "<Name>"'); process.exit(1); }
const exp = JSON.parse(fs.readFileSync(datei, 'utf8'));
if (exp.format !== 'bb-quiz-freigabe-1') { console.error('Unbekanntes Exportformat'); process.exit(1); }
const pfad = 'src/data/quiz.json';
const fragen = JSON.parse(fs.readFileSync(pfad, 'utf8'));
const byId = new Map(fragen.map(q => [q.id, q]));
let frei = 0; const kommentare = [];
for (const [id, e] of Object.entries(exp.entscheidungen)) {
  const q = byId.get(id);
  if (!q) { console.warn(`unbekannte Frage ${id}`); continue; }
  if (e.status === 'freigegeben') { q.reviewer = pruefer; q.reviewedAt = e.datum; q.verified = true; frei++; }
  else if (e.status === 'kommentiert') kommentare.push(`- [ ] **${id}** (${q.moduleTitle}, ${e.datum}): ${e.kommentar}\n  Frage: ${q.question}`);
}
fs.writeFileSync(pfad, JSON.stringify(fragen, null, 2) + '\n');
if (kommentare.length) {
  const k = 'docs/quiz-kommentare.md';
  const alt = fs.existsSync(k) ? fs.readFileSync(k, 'utf8') : '# Kommentare aus der Fragenfreigabe\n\nOffene Punkte werden in einem PR abgearbeitet und dann abgehakt.\n';
  fs.writeFileSync(k, `${alt.trimEnd()}\n\n## Export vom ${exp.exportiert.slice(0, 10)} (${pruefer})\n\n${kommentare.join('\n')}\n`);
}
console.log(`${frei} Fragen freigegeben, ${kommentare.length} Kommentare übernommen.`);
