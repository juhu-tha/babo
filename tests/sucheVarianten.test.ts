// Suche mit Schreibvarianten und Synonymen (Gesamtgutachten 03.11.2026, Abschnitt 3.3/5.1; src/utils/suchNormalisierung.ts):
// (1) Normalisierung, (2) Synonymliste (Ziele existieren), (3) 20 typische Suchanfragen gegen den echten Suchindex –
// das richtige Modul steht unter den ersten 3, (4) Menüsuche (modulPasst) mit Varianten.
import fs from 'node:fs';
import { falte, kompakt, stamm, zerlege, modulPasst, SYNONYME } from '../src/utils/suchNormalisierung';
import { suche, type IndexEintrag } from '../src/utils/volltextsuche';
import { MODUL_BY_ID, AKTIVE_MODULE } from '../src/registry/modules';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Suche mit Schreibvarianten ---');

// 1. Normalisierung
pruefe(falte('Wärmeleitfähigkeit') === falte('Waermeleitfaehigkeit'), 'ä/ae gleich');
pruefe(kompakt('w/z-Wert') === 'wzwert' && kompakt('W/Z Wert') === 'wzwert' && kompakt('wz-wert') === 'wzwert', 'w/z-Wert-Varianten kompakt gleich');
pruefe(kompakt('f_ck') === 'fck' && kompakt('f ck') === 'fck', 'f_ck / fck');
pruefe(kompakt('Glaser-Verfahren') === kompakt('Glaser Verfahren') && kompakt('Glaserverfahren') === kompakt('Glaser Verfahren'), 'Bindestrich/Leerzeichen');
pruefe(stamm('expositionsklassen') === 'expositionsklass' && stamm('sieblinien') === 'sieblini' && stamm('glas') === 'glas', 'Stamm (Plural)');
pruefe(zerlege('w z Wert').length === 1 && zerlege('Glaser Verfahren').length === 1 && zerlege('Beton Holz').length === 2, 'Mehrwort-Synonyme bleiben ein Begriff');

// 2. Synonymliste
for (const s of SYNONYME) {
  pruefe(s.formen.length >= 2, `Synonym ${s.formen[0]}: mindestens zwei Formen`);
  for (const z of s.ziele) pruefe(MODUL_BY_ID.has(z) && AKTIVE_MODULE.some(m => m.id === z), `Synonym ${s.formen[0]}: Ziel ${z} ist kein aktives Modul`);
}
const gruppeVon = new Map<string, number>();
SYNONYME.forEach((s, i) => s.formen.map(kompakt).forEach(f => {
  pruefe(!gruppeVon.has(f) || gruppeVon.get(f) === i, `Form „${f}“ in zwei Synonymgruppen`);
  gruppeVon.set(f, i);
}));

// 3. Typische Suchanfragen gegen public/suchindex.json (Titel wie VolltextTreffer: baum.titel, sonst Label)
const index: IndexEintrag[] = JSON.parse(fs.readFileSync('public/suchindex.json', 'utf8')).module;
const titel = (id: string) => MODUL_BY_ID.get(id)?.baum?.titel ?? MODUL_BY_ID.get(id)?.label ?? id;
const FAELLE: [string, string][] = [
  ['w/z-Wert', 'mischungsberechnung'],
  ['W/Z', 'mischungsberechnung'],
  ['Wasserzementwert', 'mischungsberechnung'],
  ['wz wert', 'mischungsberechnung'],
  ['f_ck', 'betonkennwerte'],
  ['fck', 'betonkennwerte'],
  ['Glaser Verfahren', 'feuchteschutz'],
  ['Glaserverfahren', 'feuchteschutz'],
  ['Tauwasser', 'feuchteschutz'],
  ['Expositionsklassen', 'expositionsklassen'],
  ['Ausbreitmass', 'frischbeton'],
  ['Waermeleitfaehigkeit', 'waermeeigenschaften'],
  ['Carbonatisierung', 'dauerhaftigkeit'],
  ['Emodul', 'emodul'],
  ['Uwert', 'rechnung_u_wert'],
  ['Sieblinien', 'mischungsberechnung'],
  ['Schalldaemmmass', 'schallschutz'],
  ['Ersatzbaustoffverordnung', 'abfaelle'],
  ['Oekobilanz', 'oekobilanz_lca'],
  ['Rueckprallhammer', 'zfp'],
];
pruefe(FAELLE.length === 20, '20 Suchanfragen');
for (const [anfrage, soll] of FAELLE) {
  const top = suche(index, anfrage, titel, 3).map(t => t.id);
  pruefe(top.includes(soll), `„${anfrage}“: ${soll} nicht unter den ersten 3 (${top.join(', ') || '–'})`);
}
// keine Verschlechterung für eindeutige Begriffe
pruefe(suche(index, 'Stabdübel', titel, 3).some(t => t.id === 'holzbau_verbindung'), 'Stabdübel → Holzbau-Verbindungen');
pruefe(suche(index, 'PFHxS', titel, 3).some(t => t.id === 'pfas_baustoffe'), 'PFHxS → PFAS');
pruefe(suche(index, 'XC', titel, 3).some(t => t.id === 'expositionsklassen'), 'Kurzform XC → Expositionsklassen');

// 4. Menüsuche
const m = (q: string, id: string) => modulPasst(q, id, [MODUL_BY_ID.get(id)?.label, MODUL_BY_ID.get(id)?.baum?.titel, ...(MODUL_BY_ID.get(id)?.suche ?? [])]);
pruefe(m('w/z-Wert', 'mischungsberechnung') && m('W/Z', 'mischungsberechnung'), 'Menü: w/z → Mischungsberechnung');
pruefe(m('Glaser Verfahren', 'feuchteschutz') && m('glaserverfahren', 'feuchteschutz'), 'Menü: Glaser-Verfahren-Varianten');
pruefe(m('waermeschutz', 'sommerlicher_waermeschutz'), 'Menü: ae statt ä');
pruefe(!m('Glaser Verfahren', 'glas'), 'Menü: Glaser-Verfahren nicht bei Glas');
pruefe(!m('xc', 'mauerwerk'), 'Menü: Kurzform nicht als Teilwort');

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: Suche mit Schreibvarianten (20 Anfragen)');
