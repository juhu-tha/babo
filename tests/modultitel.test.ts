// Einheitliche Modultitel (Gesamtgutachten 03.11.2026, Abschnitt 3.3; Regel in scripts/qa/modultitel.mjs und
// docs/architektur.md „Modultitel“): (1) Label im Titel erkennbar, (2) Oberflächen nutzen Titel bzw. Label nach der
// Regel, (3) Feuchteschutz hat einen Namen, (4) mit Build: Modulüberschrift nennt das Modul (Ratsche mit Ausnahmen).
import fs from 'node:fs';
import { abgleich, fehlendeWoerter, AUSNAHMEN_UEBERSCHRIFT } from '../scripts/qa/modultitel.mjs';
import * as h from '../src/utils/suchNormalisierung';
import { MODUL_BY_ID, AKTIVE_MODULE } from '../src/registry/modules';
import { mitZuordnung, type RohFrage } from '../src/data/quizModell';
import roh from '../src/data/quiz.json' with { type: 'json' };

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Modultitel ---');

// 1. Regel 3: Label im Titel
pruefe(fehlendeWoerter('Feuchteschutz & Tauwasser', 'Feuchteschutz & Tauwasser (Glaser-Verfahren)', h).length === 0, 'Regel: Label + Klammerzusatz');
pruefe(fehlendeWoerter('Feuchteschutz & Tauwasser', 'Feuchteschutz & Glaser-Verfahren', h).join() === 'tauwasser', 'Regel erkennt fehlendes Wort');
pruefe(fehlendeWoerter('Hydratation & Folgen', 'Hydratationswärme & Rissrisiko', h).join() === 'folgen', 'Regel: Wortanfang genügt („Hydratation…“)');
const r = await abgleich({ dist: fs.existsSync('dist/modul') ? 'dist' : '/kein-build' });
pruefe(r.labelFehler.length === 0, `Label nicht im Titel: ${r.labelFehler.map((f: { id: string; fehlt: string[] }) => `${f.id} (${f.fehlt.join(',')})`).join('; ')}`);
pruefe(AKTIVE_MODULE.filter(m => m.gruppe && m.id !== 'start' && !m.id.startsWith('divider_')).every(m => !!m.baum?.titel), 'jedes Menümodul (außer Trennzeilen) hat einen Titel');
for (const id of Object.keys(AUSNAHMEN_UEBERSCHRIFT)) pruefe(MODUL_BY_ID.has(id), `Ausnahme ${id}: kein Modul`);
pruefe(Object.keys(AUSNAHMEN_UEBERSCHRIFT).length <= 62, `Ausnahmen Überschrift: ${Object.keys(AUSNAHMEN_UEBERSCHRIFT).length} > 62 (Ratsche, Stand 03.11.2026)`);

// 2. Oberflächen
const app = fs.readFileSync('src/App.tsx', 'utf8');
pruefe(/getTabLabel\(m\.id, m\.titel \?\? m\.label\) : 'BaustoffBoard'/.test(app), 'h1: Titel');
pruefe(/tabLabel = m\?\.titel \?\? m\?\.label/.test(app), 'Fenstertitel: Titel');
pruefe(/return m \? getTabLabel\(m\.id, m\.titel \?\? m\.label\) : activeTab;/.test(app), 'PDF-Kopf: Titel');
pruefe(/getTabLabel\(m\.id, m\.label\) : 'BaustoffBoard'/.test(app), 'Mobil-Kopfleiste: Label (Kurzform)');
pruefe(/BaustoffBoard THA - \$\{route\.titel \?\? route\.label\}/.test(fs.readFileSync('scripts/vorrendern.ts', 'utf8')), 'vorgerenderte Seite: <title> mit Titel');
pruefe(/MODUL_KERN\.get\(id\)\?\.titel \?\? MODUL_KERN\.get\(id\)\?\.label/.test(fs.readFileSync('src/components/navigation/VolltextTreffer.tsx', 'utf8')), 'Volltexttreffer: Titel');
pruefe(/MODUL_KERN\.get\(v\)\?\.titel \?\? MODUL_KERN\.get\(v\)\?\.label/.test(fs.readFileSync('src/components/ui/ModulLernziele.tsx', 'utf8')), 'Lernziel-Querverweise: Titel');
pruefe(/MODUL_KERN\.get\(tab\.id\)\?\.titel \?\? tab\.label/.test(fs.readFileSync('src/components/seo/MetadataAuditModal.tsx', 'utf8')), 'SEO-Prüfung: Titel');
// Quiz: Modulname und Sprungziel aus der Registry (quiz.json unverändert)
const fragen = (roh as RohFrage[]).map(mitZuordnung);
const abw = fragen.filter(q => MODUL_BY_ID.has(q.moduleId) && AKTIVE_MODULE.some(m => m.id === q.moduleId) && q.moduleTitle !== (MODUL_BY_ID.get(q.moduleId)!.baum?.titel ?? MODUL_BY_ID.get(q.moduleId)!.label));
pruefe(abw.length === 0, `Quiz: ${abw.length} Modulnamen weichen vom Titel ab (${abw.slice(0, 3).map(q => q.id).join(', ')})`);
const ziel = fragen.filter(q => q.gapAnalysis && MODUL_BY_ID.has(q.gapAnalysis.targetModuleTab) && AKTIVE_MODULE.some(m => m.id === q.gapAnalysis!.targetModuleTab)
  && q.gapAnalysis.targetModuleLabel !== (MODUL_BY_ID.get(q.gapAnalysis.targetModuleTab)!.baum?.titel ?? MODUL_BY_ID.get(q.gapAnalysis.targetModuleTab)!.label));
pruefe(ziel.length === 0, `Quiz: ${ziel.length} Sprungziele mit abweichendem Namen`);

// 3. Feuchteschutz: ein Name (Menü = Kurzform, Übersicht/Überschrift/Fenstertitel = Titel)
const fs_ = MODUL_BY_ID.get('feuchteschutz')!;
pruefe(fs_.label === 'Feuchteschutz & Tauwasser' && fs_.baum?.titel === 'Feuchteschutz & Tauwasser (Glaser-Verfahren)', 'feuchteschutz: Label und Titel');
const inhalt = JSON.parse(fs.readFileSync('content/feuchteschutz/Feuchteschutz.json', 'utf8'));
pruefe(inhalt.texte.feuchteschutzWasserdampfTaupunkt === fs_.baum?.titel, 'feuchteschutz: sichtbare Überschrift = Titel');

// 4. Mit Build: Modulüberschriften
if (r.geprueft > 0) {
  pruefe(r.kopfFehler.length === 0, `Modulüberschrift nennt das Modul nicht: ${r.kopfFehler.map((f: { id: string; ueberschrift: string }) => `${f.id} („${f.ueberschrift}“)`).join('; ')}`);
  pruefe(r.ausnahmenUngenutzt.length === 0, `Ausnahmen nicht mehr nötig: ${r.ausnahmenUngenutzt.join(', ')}`);
} else console.log('  (dist/modul fehlt – Modulüberschriften nur nach einem Build geprüft)');

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log(`OK: Modultitel (${AKTIVE_MODULE.length} Module${r.geprueft ? `, ${r.geprueft} Überschriften` : ''})`);
