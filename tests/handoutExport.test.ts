// Versuchs-Handouts (AP 6.4): Schema der fünf Handouts, Zahleneingabe, CSV und Druck-HTML
import fs from 'fs';
import { zahlAus, leeresProtokoll, protokollCsv, handoutHtml, escapeHtml, istGleich, kopie, zeileBelegt } from '../src/utils/handoutExport';
import { LABOR_ANPASSEN, type VersuchsHandoutDaten } from '../src/components/handout/handoutTypen';
import { MODUL_BY_ID } from '../src/registry/modules';
import { LERNZIELE } from '../src/data/lernziele';
import { PRUEFVERMERKE } from '../src/data/pruefvermerke';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Versuchs-Handouts ---');

// 1. Zahleneingabe
pruefe(zahlAus('12,5') === 12.5 && zahlAus('12.5') === 12.5 && zahlAus(' -250 ') === -250 && zahlAus('−80') === -80, 'Dezimalkomma/-punkt, Minuszeichen');
pruefe(Number.isNaN(zahlAus('')) && Number.isNaN(zahlAus('abc')) && Number.isNaN(zahlAus(undefined)), 'leer/Text → NaN');
pruefe(zahlAus('7,85 g/cm³') === 7.85, 'Einheitenrest toleriert');

// 2. Escape
pruefe(escapeHtml('<b>"A&B"</b>') === '&lt;b&gt;&quot;A&amp;B&quot;&lt;/b&gt;', 'escapeHtml');

// 3. Schema der Handouts (Daten aus den Modulen; React wird nur für die Typen importiert)
const QUELLEN: Record<string, [string, string]> = {
  labor_potentialmessung: ['src/data/laborhandouts/potentialmessung.ts', 'POTENTIAL_HANDOUT'],
  labor_auslagerung: ['src/data/laborhandouts/auslagerung.ts', 'AUSLAGERUNG_HANDOUT'],
  labor_frischbeton: ['src/data/laborhandouts/frischbeton.ts', 'FRISCHBETON_HANDOUT'],
  labor_druckfestigkeit: ['src/data/laborhandouts/druckfestigkeit.ts', 'DRUCK_HANDOUT'],
  labor_moertelprismen: ['src/data/laborhandouts/moertelprismen.ts', 'MOERTEL_HANDOUT'],
};

async function main() {
  for (const [id, [datei, name]] of Object.entries(QUELLEN)) {
    const mod = (await import(`../${datei}`)) as Record<string, unknown>;
    const d = mod[name] as VersuchsHandoutDaten;
    pruefe(!!d && d.id === id, `${id}: Handout-Daten ${name} fehlen`);
    if (!d) continue;
    pruefe(MODUL_BY_ID.get(id)?.baum?.typ === 'calculator' && !!LERNZIELE[id] && !!PRUEFVERMERKE[id],`${id}: Registry, Lernziele oder Prüfvermerk fehlen`);
    pruefe(d.ziel.length >= 2 && d.geraete.length >= 2 && d.material.length >= 1 && d.sicherheit.length >= 3 && d.ablauf.length >= 4, `${id}: Abschnitte unvollständig`);
    pruefe(d.fehlerquellen.length >= 4 && d.fragen.length >= 4, `${id}: Fehlerquellen/Fragen zu wenige`);
    pruefe([...d.geraete, ...d.material, ...d.ablauf, ...d.protokoll.kopf].some(x => x.laborAnpassen), `${id}: keine Angabe „${LABOR_ANPASSEN}“`);
    const spalten = new Set(d.protokoll.spalten.map(s => s.id));
    pruefe(spalten.size === d.protokoll.spalten.length, `${id}: doppelte Spalten-IDs`);
    pruefe(d.protokoll.beispiel.zeilen.every(z => Object.keys(z).every(k => spalten.has(k))), `${id}: Lehrwerte mit unbekannter Spalte`);
    pruefe(d.protokoll.kopf.every(k => k.typ !== 'auswahl' || (k.optionen?.length ?? 0) >= 2), `${id}: Auswahl ohne Optionen`);
    const leer = leeresProtokoll(d);
    pruefe(leer.zeilen.length === d.protokoll.zeilen && !leer.zeilen.some(zeileBelegt), `${id}: leeres Protokoll`);
    pruefe(istGleich(kopie(d.protokoll.beispiel), d.protokoll.beispiel), `${id}: Kopie ungleich`);
    // CSV: Kopfzeile + Messzeilen, Dezimalkomma
    const csv = protokollCsv(d, d.protokoll.beispiel, [{ label: 'Ergebnis', wert: '1,0 MPa' }]);
    pruefe(csv.headers.length === d.protokoll.spalten.length + 1, `${id}: CSV-Spalten`);
    pruefe(csv.rows.slice(0, d.protokoll.beispiel.zeilen.length).every(r => r.length === csv.headers.length), `${id}: CSV-Zeilenlänge`);
    pruefe(!csv.rows.flat().some(v => /^-?\d+\.\d+$/.test(v)), `${id}: CSV mit Dezimalpunkt`);
    pruefe(csv.rows.some(r => r[0] === 'Auswertung'), `${id}: CSV ohne Auswertung`);
    // Druck: Tabellen mit Spaltenköpfen, leeres Handout mit Leerzeilen, Eingaben escaped
    const html = handoutHtml(d, { ...d.protokoll.beispiel, kopf: { ...d.protokoll.beispiel.kopf, [d.protokoll.kopf[0].id]: '<script>x</script>' } }, []);
    pruefe(html.includes('<th scope="col">') && html.includes(d.protokoll.titel) && !html.includes('<script>'), `${id}: Druck-HTML`);
    const leerHtml = handoutHtml(d, null, []);
    pruefe((leerHtml.match(/<tr><td>\d+<\/td>/g) ?? []).length === d.protokoll.zeilen, `${id}: leeres Handout ohne ${d.protokoll.zeilen} Leerzeilen`);
  }

  // 4. Konventionen im Quelltext: Live-Rechenweg, ModulTest, keine THA-Projektdaten oder Firmennamen
  const MODULE_DATEIEN: Record<string, string> = {
    labor_potentialmessung: 'Potentialmessung', labor_auslagerung: 'Auslagerung', labor_frischbeton: 'FrischbetonHandout',
    labor_druckfestigkeit: 'DruckfestigkeitWuerfel', labor_moertelprismen: 'Moertelprismen',
  };
  for (const [id, [datei]] of Object.entries(QUELLEN)) {
    const s = fs.readFileSync(`src/modules/laborhandouts/${MODULE_DATEIEN[id]}.tsx`, 'utf8');
    const daten = fs.readFileSync(datei, 'utf8');
    pruefe(/<FormulaDerivationBox\s+live\s/.test(s), `${id}: kein Live-Rechenweg`);
    pruefe(s.includes(`<ModulTest moduleId="${id}"`), `${id}: ModulTest fehlt`);
    pruefe(!/Projektbericht|\bT9\b|WS 2024|Heidelberg|Holcim|Dyckerhoff|Schwenk|Cemex|Testo|Hilti/i.test(s + daten), `${id}: interne Projekt- oder Firmenangabe`);
  }

  if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
  console.log(`OK: ${Object.keys(QUELLEN).length} Versuchs-Handouts`);
}
main();
