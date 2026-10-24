// Volltextsuche: Bewertung und Ausschnitte (Phase 2, AP 2.9)
import { suche, type IndexEintrag } from '../src/utils/volltextsuche';
const fehler: string[] = [];
const pruefe = (ok: boolean, m: string) => { if (!ok) fehler.push(m); };
console.log('--- Test: Volltextsuche ---');
const index: IndexEintrag[] = [
  { id: 'zfp', h: ['Rückprallhammer (Schmidt-Hammer)'], w: 'rückprallhammer schmidt-hammer prüfung beton', t: 'Der Rückprallhammer nach Schmidt-Hammer-Prinzip misst die Oberflächenhärte von Beton.' },
  { id: 'beton', h: ['Beton'], w: 'beton zement wasser', t: 'Beton besteht aus Zement, Wasser und Gesteinskörnung.' },
  { id: 'holz', h: ['Holz'], w: 'holz feuchte', t: 'Holz quillt und schwindet.' },
];
const titel = (id: string) => ({ zfp: 'Zerstörungsfreie Prüfung', beton: 'Beton', holz: 'Holz' } as Record<string, string>)[id];
const a = suche(index, 'Schmidt-Hammer', titel);
pruefe(a.length === 1 && a[0].id === 'zfp', 'Schmidt-Hammer findet ZfP');
pruefe(a[0]?.ausschnitt.includes('Schmidt-Hammer'), 'Ausschnitt enthält Begriff');
const b = suche(index, 'beton', titel);
pruefe(b[0]?.id === 'beton' && b.length === 2, 'Titeltreffer zuerst');
pruefe(suche(index, 'beton holz', titel).length === 0, 'Alle Begriffe müssen vorkommen');
pruefe(suche(index, 'x', titel).length === 0, 'Ein Zeichen ergibt nichts');
if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: Volltextsuche');
