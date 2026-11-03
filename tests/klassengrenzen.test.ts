// Zentrale Klassengrenzen (src/data/klassengrenzen.ts) und Abgleich (scripts/qa/klassengrenzen-abgleich.mjs),
// Gesamtgutachten 03.11.2026 Abschnitt 5.1: (1) Daten mit Quelle je Grenze, (2) Rechenkern liest die Grenze,
// (3) Erkennung an Beispielsätzen, (4) Ratsche: 0 Abweichungen und 0 falsche Einstufungen in content/, quiz.json und Fachtexten.
import { PFAS_KETTENLAENGE, pfasIstKurzkettig, LAGA_M20, EBV_MATERIALKLASSEN, EBV_MATERIALWERTE, KLASSEN_AUSSAGEN } from '../src/data/klassengrenzen';
import { PFAS20, istKurzkettig, pfasSummenbewertung } from '../src/calc/pfas';
import { abgleich, pruefeAussagen, NACH } from '../scripts/qa/klassengrenzen-abgleich.mjs';
import { bereite, pruefeText } from '../scripts/qa/fristen-abgleich.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Klassengrenzen ---');

// 1. Daten
const https = (q: string) => /^https:\/\/[^\s]+$/.test(q);
pruefe(https(PFAS_KETTENLAENGE.quelle) && https(LAGA_M20.quelle) && https(EBV_MATERIALKLASSEN.quelle), 'Quelle je Block als https-URL');
pruefe(PFAS_KETTENLAENGE.carbonsaeureKurzBis === 7 && PFAS_KETTENLAENGE.sulfonsaeureKurzBis === 5, 'PFAS: Carbonsäuren bis C7, Sulfonsäuren bis C5 kurzkettig (OECD/UBA)');
pruefe(LAGA_M20.klassen.map(k => k.klasse).join('|') === 'Z 0|Z 1.1|Z 1.2|Z 2|> Z 2', 'LAGA M 20: Klassen Z 0 bis > Z 2');
pruefe(/technischen Sicherungsmaßnahmen/.test(LAGA_M20.klassen[3].einbau) && /Deponierung/.test(LAGA_M20.klassen[4].einbau), 'LAGA: Z 2 = Einbau mit Sicherung, > Z 2 = Deponie');
const ids = new Set<string>();
for (const e of EBV_MATERIALWERTE) {
  pruefe(!ids.has(e.id), `doppelte ID ${e.id}`); ids.add(e.id);
  pruefe(https(e.quelle) && /^\d{4}-\d{2}-\d{2}$/.test(e.stand) && Number.isFinite(e.wert) && !!e.einheit && /Anlage 1 Tabelle [13]/.test(e.fundstelle), `${e.id}: Pflichtfelder`);
  pruefe([...EBV_MATERIALKLASSEN.recycling, ...EBV_MATERIALKLASSEN.boden].includes(e.klasse as never), `${e.id}: unbekannte Klasse ${e.klasse}`);
  pruefe(!/claude/i.test(JSON.stringify(e)), `${e.id}: unzulässiger Name`);
}
const w = (id: string) => EBV_MATERIALWERTE.find(e => e.id === id)?.wert;
pruefe(w('EBV_RC1_SULFAT') === 600 && w('EBV_RC2_SULFAT') === 1000 && w('EBV_RC3_SULFAT') === 3500 && w('EBV_RC1_KUPFER') === 110 && w('EBV_RC2_KUPFER') === 250 && w('EBV_RC1_LEITF') === 2500 && w('EBV_BM0_PAK16') === 3,
  'EBV Kernwerte (Sulfat 600/1000/3500 mg/l, Cu 110/250 µg/l, LF 2500 µS/cm, BM-0 PAK16 3 mg/kg)');
// RC-Klassen steigen monoton (je Parameter RC-1 < RC-2 < RC-3)
for (const p of ['SULFAT', 'LEITF', 'PAK15', 'PAK16', 'CHROM', 'KUPFER', 'VANADIUM']) {
  const [a, b, c] = ['RC1', 'RC2', 'RC3'].map(k => w(`EBV_${k}_${p}`) as number);
  pruefe(a < b && b < c, `EBV ${p}: RC-1 < RC-2 < RC-3`);
}

// 2. Rechenkern liest die zentrale Grenze
for (const s of PFAS20) pruefe(istKurzkettig(s) === pfasIstKurzkettig(s), `pfas.ts: ${s.id} wie zentrale Grenze`);
const kurz = PFAS20.filter(istKurzkettig).map(s => s.id).join(',');
pruefe(kurz === 'PFBA,PFPeA,PFHxA,PFHpA,PFBS,PFPeS', `kurzkettige PFAS: ${kurz}`);
const erg = pfasSummenbewertung({ werte: { PFBA: 10, PFHxS: 10 }, bg: 1, ansatz: 'null' });
pruefe(Math.abs(erg.anteilKurzkettig - 0.5) < 1e-12, 'Anteil kurzkettig: PFBA kurz, PFHxS lang → 50 %');

// 3. Erkennung
const E = bereite(EBV_MATERIALWERTE as never);
const erk = (t: string) => pruefeText(t, E, NACH).map((x: { id: string; ok: boolean }) => `${x.id}:${x.ok ? 'ok' : 'ABW'}`);
const hat = (t: string, soll: string, msg: string) => pruefe(erk(t).includes(soll), `${msg}: erwartet ${soll}, erkannt ${erk(t).join(', ') || '–'}`);
hat('Sulfat (RC-1: ≤ 600 mg/l, RC-2: ≤ 1000 mg/l)', 'EBV_RC2_SULFAT:ok', 'Sulfat RC-2 richtig');
hat('Sulfat (RC-1: ≤ 600 mg/l, RC-2: ≤ 1500 mg/l)', 'EBV_RC2_SULFAT:ABW', 'Sulfat RC-2 falsch');
hat('Kupfer (RC-1: ≤ 110 µg/l, RC-2: ≤ 170 µg/l), Chrom (RC-1: ≤ 150 µg/l)', 'EBV_RC2_KUPFER:ABW', 'Kupfer RC-2 falsch');
hat('Kupfer (RC-1: ≤ 110 µg/l, RC-2: ≤ 170 µg/l), Chrom (RC-1: ≤ 150 µg/l)', 'EBV_RC1_CHROM:ok', 'Chrom: nächster Anker');
hat('ab BM-0* Eluatwerte, z. B. BM-0*: Arsen ≤ 8 µg/l, Blei ≤ 25 µg/l', 'EBV_BM0S_BLEI_P:ABW', 'BM-0* Blei falsch');
pruefe(!erk('BM-0*: Sulfat ≤ 250 mg/l').some(x => x.startsWith('EBV_BM0_')), 'BM-0* nicht als BM-0 werten');
const ein = (t: string) => pruefeAussagen([{ ort: 'x', text: t }], KLASSEN_AUSSAGEN).map((a: { id: string }) => a.id);
pruefe(ein('Kurzkettige PFAS (C4–C7) sind mobil.').includes('PFAS_SULFON_KURZ'), 'PFAS: „kurzkettig (C4–C7)“ ohne Säuregruppe');
pruefe(ein('PFHxS gilt als kurzkettig.').includes('PFAS_SULFON_KURZ'), 'PFAS: PFHxS kurzkettig');
pruefe(ein('Kurzkettige PFAS (Carbonsäuren C4–C7, Sulfonsäuren C4–C5) sind mobil.').length === 0, 'PFAS: richtige Angabe');
pruefe(ein('Z2 = deponierungsbedürftig').includes('LAGA_Z2_DEPONIE'), 'LAGA: Z 2 = Deponie');
pruefe(ein('> Z 2: Deponierung auf DK I').length === 0 && ein('oberhalb von Z 2 Deponierung').length === 0, 'LAGA: > Z 2 Deponie richtig');
pruefe(ein('Z 0: eingeschränkter Einbau').includes('LAGA_Z0_EINGESCHRAENKT') && ein('Z 0 *: eingeschränkt').length === 0, 'LAGA: Z 0 eingeschränkt falsch, Z 0* nicht erfasst');
pruefe(ein('Einstufung in Einbauklassen nach ErsatzbaustoffV').includes('EBV_EINBAUKLASSEN') && ein('Einbauklassen Z 0 bis Z 2 der LAGA M 20').length === 0, 'EBV: Einbauklassen falsch, LAGA richtig');
pruefe(ein("id: 't_ebv_einbauklassen'").length === 0, 'EBV: Bezeichner nicht als Text werten');

// 4. Ratsche
const r = await abgleich();
pruefe(r.abweichungen.length === 0, `Materialwerte: ${r.abweichungen.length} Abweichung(en): ${r.abweichungen.map((t: { id: string; ort: string; wert: number }) => `${t.id} ${t.wert} (${t.ort})`).join('; ')}`);
pruefe(r.aussagen.length === 0, `Einstufungen: ${r.aussagen.length} falsch: ${r.aussagen.map((a: { id: string; ort: string }) => `${a.id} (${a.ort})`).join('; ')}`);
pruefe(r.treffer.length >= 10, `Erkennung findet die Materialwerte im Inhalt (${r.treffer.length} ≥ 10)`);

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: Klassengrenzen');
