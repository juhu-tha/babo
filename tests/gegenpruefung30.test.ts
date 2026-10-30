// Gegenprüfung 30.10.2026 der gewichtigen Korrekturen der Durchsicht vom 29.10.2026 (docs/pruefung/gegenpruefung-2026-10-30.md).
// Sollwerte aus eigenen Prüfskripten (Excel-Mappe mit LibreOffice neu berechnet; eigene Tabelle Tab. 4.4DE für Spannstahl).
import excel from '../content/lca/TransportbetonExcelExport.json';
import boden from '../content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json';
import schadstoffe from '../content/schadstoffe/Schadstoffe.json';
import bim from '../content/bimbaustoffe/BimBaustoffe.json';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import { spanngliedDeckung } from '../src/calc/spannbeton';
import { readFileSync } from 'node:fs';

const fehler: string[] = [];
const pruefe = (fall: string, ist: number, soll: number, tol = 1e-6) => { if (!(Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll)))) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

// ---------------------------------------------------------------- 1. lca_rechner, Blatt „Aufgabe_Studierende“ (DSB-LC-1)
type Zelle = string | number | { f: string } | undefined;
const ws3 = excel.daten['generateTransportbetonExcel.ws3_data'] as Zelle[][];
const spalte = (c: string) => c.charCodeAt(0) - 65;
const roh = (ref: string): Zelle => { const m = /^([A-Z])(\d+)$/.exec(ref)!; return ws3[Number(m[2]) - 1]?.[spalte(m[1])]; };
// jede Produktformel Menge · Faktor bezieht sich auf die eigene Zeile und auf Zahlenzellen
for (let i = 0; i < ws3.length; i++) for (let j = 0; j < (ws3[i]?.length ?? 0); j++) {
  const z = ws3[i][j];
  if (z && typeof z === 'object') {
    const m = /^C(\d+)\*([DF])(\d+)$/.exec(z.f);
    if (m) {
      gilt(Number(m[1]) === i + 1 && Number(m[3]) === i + 1, `LC-1: ${String.fromCharCode(65 + j)}${i + 1} = ${z.f} nicht in Zeile ${i + 1}`);
      gilt(typeof roh(`C${m[1]}`) === 'number' && typeof roh(`${m[2]}${m[3]}`) === 'number', `LC-1: ${z.f} verweist auf Nicht-Zahl`);
    }
  }
}
// eigene Auswertung (nur die im Blatt verwendeten Formeltypen)
const wert = (ref: string): number => {
  const z = roh(ref);
  if (typeof z === 'number') return z;
  if (z && typeof z === 'object') return formel(z.f);
  return 0;
};
function formel(f: string): number {
  const sum = /^SUM\(([A-Z])(\d+):\1(\d+)\)$/.exec(f);
  if (sum) { let s = 0; for (let r = Number(sum[2]); r <= Number(sum[3]); r++) s += wert(`${sum[1]}${r}`); return s; }
  const ausdruck = f.replace(/[A-Z]\d+/g, r => `(${wert(r)})`);
  if (!/^[\d.()+\-*/ ]+$/.test(ausdruck)) throw new Error(`Formel nicht auswertbar: ${f}`);
  return Function(`return ${ausdruck}`)() as number;
}
pruefe('LC-1 Referenz E32 (LibreOffice 247,921)', wert('E32'), 247.921);
pruefe('LC-1 Entwurf G32 (LibreOffice 139,5965)', wert('G32'), 139.5965);
pruefe('LC-1 Minderung G33 (LibreOffice 43,693 %)', wert('G33'), 43.6931522541455);
pruefe('LC-1 Ersparnis G38 (LibreOffice 92,076 t)', wert('G38'), 92.075825);
// unabhängige Handrechnung
pruefe('LC-1 Handrechnung Referenz', 340 * 0.665 + 700 * 0.0035 + 1140 * 0.0035 + 2 * 1.65 + 170 * 0.0003 + 5.2 + 18 * 0.185 + 3.5, 247.921);
pruefe('LC-1 Handrechnung Entwurf', 290 * 0.4 + 40 * 0.015 + 680 * 0.0035 + 700 * 0.0035 + 450 * 0.0018 + 3.2 * 1.65 + 155 * 0.0003 + 5.2 + 18 * 0.185 + 3.5, 139.5965);

// ---------------------------------------------------------------- 2. boden_materialaufbereitung, Asbest (DSB-BM-1)
// GefStoffV seit 05.12.2024: Verbote in § 11 (Anhang II Nr. 1 weggefallen), Anforderungen an Tätigkeiten § 11a mit Anhang I Nr. 3
// Doppelkopie in schadstoffe entfernt (DSB-SS-1, Umsetzung 30.10.2026): nur noch eine Quelle
gilt(!('TREATMENT_OPTIONS' in (schadstoffe.daten as Record<string, unknown>)), 'BM-1: keine zweite Kopie in schadstoffe');
const bodenText = JSON.stringify(boden);
gilt(!/§ 11a und Anhang II Nr\. 1/.test(bodenText), 'BM-1: „§ 11a und Anhang II Nr. 1“ als geltende Fundstelle entfernt');
gilt(/§ 11 Abs\. 1 Nr\. 1 und 2/.test(boden.daten.TREATMENT_OPTIONS.erdaushub_sand.asbest_faser.rules), 'BM-1: Verbot nach § 11 Abs. 1 GefStoffV');
gilt(!/gem\. TRGS 519 eine/.test(boden.texte.hinweisZuAsbestFasern) && /§ 11 Abs\. 1 GefStoffV/.test(boden.texte.hinweisZuAsbestFasern), 'BM-1: Hinweis nennt GefStoffV statt TRGS 519 als Verbotsgrundlage');
gilt(/§ 11a mit Anhang I Nr\. 3/.test(schadstoffe.texte.anforderungenAktuellerStandDie), 'Schadstoffe: § 11a mit Anhang I Nr. 3');

// ---------------------------------------------------------------- 3. bim_baustoffe, S355 (DSB-BIM-1)
const stahl = (bim.daten.ARCHETYPES as { id: string; defaultGwp: number; defaultDensity: number }[]).find(a => a.id === 'stahl')!;
pruefe('BIM-1 Rohdichte', stahl.defaultDensity, 7850);
pruefe('BIM-1 GWP je m³ = 1,1 · 7850', stahl.defaultGwp, 8635);
pruefe('BIM-1 wie zentraler Lehrwert', Math.round(GWP_LEHRWERTE.profilstahl.gwp / 1000 * stahl.defaultDensity), stahl.defaultGwp);
gilt(stahl.defaultGwp >= 2000 && stahl.defaultGwp <= 10000 && (stahl.defaultGwp - 2000) % 5 === 0, 'BIM-1: Wert liegt im Regler (2000–10 000, Schritt 5)');

// ---------------------------------------------------------------- 4. spannbeton, spanngliedDeckung (DSA-SB-2)
// eigene Tabelle Spannstahl (= Betonstahl Tab. 4.4DE + 10 mm), Hochbau, C30/37, Hüllrohr klein (c_min,dur maßgebend)
const SPANNSTAHL = { XC1: 20, XC2: 30, XC3: 30, XC4: 35, XD1: 50, XD2: 50, XD3: 50 } as const;
for (const [k, soll] of Object.entries(SPANNSTAHL)) {
  const xc = (k.startsWith('XC') ? k : 'XC1') as 'XC1';
  const xd = (k.startsWith('XD') ? k : 'XD0') as 'XD0';
  const r = spanngliedDeckung({ bauwerk: 'hochbau', verfahren: 'post_tensioned', huellrohrMm: 20, litzeMm: 15.7, xc, xd, betonklasse: 'C30/37' });
  pruefe(`SB-2 c_min,dur Spannstahl ${k}`, r.c_min_dur, soll);
}
const basis = { bauwerk: 'hochbau', verfahren: 'post_tensioned', huellrohrMm: 75, litzeMm: 15.7, xc: 'XC4', xd: 'XD0', betonklasse: 'C35/45' } as const;
pruefe('SB-2 Hüllrohr 81 → c_min,b 80', spanngliedDeckung({ ...basis, huellrohrMm: 81 }).c_min_b, 80);
pruefe('SB-2 ohne Verbund XC4: Betonstahlwert 25', spanngliedDeckung({ ...basis, verfahren: 'unbonded' }).c_min_dur, 25);
// ungültige Eingabe: kein Ergebnis mehr (vorher c_nom = 30 mm bei gueltig = false)
for (const h of [0, -5, NaN]) {
  const r = spanngliedDeckung({ ...basis, huellrohrMm: h });
  gilt(!r.gueltig && Number.isNaN(r.c_nom) && Number.isNaN(r.c_min), `SB-2 ungültiger Hüllrohrdurchmesser ${h} ohne Ergebnis`);
}

// ---------------------------------------------------------------- Stichprobe: DSB-LC-6 (QNG-Praxisbeispiel)
const tsx = readFileSync(new URL('../src/modules/nachhaltigkeit/AnhangPraxisbeispiele.tsx', import.meta.url), 'utf8');
pruefe('LC-6 B6 = 18 · 0,43', 18 * 0.43, 7.74);
gilt(!tsx.includes('>7,75<') && tsx.includes('>7,74<'), 'LC-6: Tabelle zeigt B6 = 7,74 wie Text und Summe 22,49');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Gegenprüfung 30.10.2026');
