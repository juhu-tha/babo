// Umbau 02.11.2026 (Auftrag Prof. Huber): Reiter „Kleb- & Dichtstoff-Schäden“ von „Recht & Grundlagen“
// (bauschaeden) nach „Typische Bauschäden (Schadensatlas)“ (schadensbilder) verschoben – samt Beispiel
// Mindestfugenbreite, Fußzeilen-Einträgen, Lernzielen, Kurzfassung, Suchbegriffen und Querverweisen.
import fs from 'node:fs';
import quiz from '../src/data/quiz.json';
import bs from '../content/bauschaeden/Bauschaeden.json';
import tb from '../content/typischebauschaeden/TypischeBauschaeden.json';
import { MODUL_BY_ID } from '../src/registry/modules';
import { LERNZIELE } from '../src/data/lernziele';
import { KURZFASSUNG } from '../src/data/kurzfassung';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Umbau Kleb- & Dichtstoff-Schäden → Typische Bauschäden (02.11.2026) ---');

type Inhalt = { texte: Record<string, string>; werte: Record<string, string>; daten: Record<string, unknown> };
const B = bs as unknown as Inhalt;
const T = tb as unknown as Inhalt;
const bsTsx = fs.readFileSync('src/modules/Bauschaeden.tsx', 'utf8');
const tbTsx = fs.readFileSync('src/modules/TypischeBauschaeden.tsx', 'utf8');

// 1. Reiter: im Schadensatlas vorhanden (vor dem Szenarien-Analysator, höchstens 7 Reiter), in Recht & Grundlagen entfernt
gilt(/\{ id: 'kleb_dicht', label: inhalt\.werte\.klebDichtstoffSchäden/.test(tbTsx) && tbTsx.includes("activeSubTab === 'kleb_dicht'"), 'schadensbilder: Reiter kleb_dicht fehlt');
const reiter = [...tbTsx.matchAll(/^ {4}\{ id: '([a-z_]+)'/gm)].map(m => m[1]);
gilt(reiter.length <= 7 && reiter.indexOf('kleb_dicht') === reiter.length - 2 && reiter.at(-1) === 'analysator', `schadensbilder: Reiterfolge ${reiter.join(', ')}`);
gilt(!/id: 'kleb_dicht'|activeSubTab === 'kleb_dicht'|'haftung' \| 'kleb_dicht'/.test(bsTsx), 'bauschaeden: Reiter kleb_dicht noch vorhanden');

// 2. Texte vollständig übernommen (Schlüssel gleich) und aus bauschaeden entfernt
const TEXTE = [
  'klebUndDichtstoffePraxisleitfaden', 'din18540DinEn', 'fugendichtstoffeUndBauklebstoffeGehören',
  't1AnwendungstippsFürEine', 't1Untergrundprüfung', 'trockenTragfähigTrennmittelfreiBeton',
  'tippAbreißtestGitterschnittVorab', 't2PrimerHaftbrücken', 'systemgerechteVoranstrichePoröseMinerali',
  'ablüftezeiten530Min', 't3Fugendimensionierung', 'b10MmB', 'b10MmB2', 'geometrieZuordnungFugenbreiteDichtstoffd',
  'zB20Mm', 'verhindertUnzulässigeDehnungsspitzen', 't4HinterfüllungGlätten',
  'zweiflankenhaftungSichernGeschlossenzell', 'keineScharfenWerkzeugeZum', 't2HäufigeFehlerquellenIn',
  'dreiflankenhaftungKlassischerKardinalfeh', 'wirdDieFugeOhne', 'präventionPeRundschnurOder',
  'taupunktunterschreitungFeuchtefilm', 'applikationBeiHoherLuftfeuchte', 'präventionOberflächentemperaturMind3',
  'falschePolymerwahlRandzonenverschmutzung', 'verwendungVonStandardEssig',
  'präventionNurWeichmacherfreieNatursteins', 'überschreitungDerOffenenZeit', 'wirdDieDichtstofffugeNach',
  'präventionNurMeterweiseVorgehen', 'hausmittelAlsGlättmittelSpülmittel',
  'verwendungHandelsüblicherGeschirrspülmit', 'präventionAusschließlichAbgestimmteSyste',
  'unzureichendeFugenbreiteÜberdehnung', 'fugenbreiteZuSchmalBemessen', 'präventionThermischeLängenänderungRechne',
  't3AlterungsmechanismenChemischPhysikalisc', 'polymernetzwerkeVonDichtUnd', 'photooxidationUvStrahlung',
  'kurzwelligeUvPhotonenSpalten', 'silikoneSiOBindung', 'hydrolytischerAbbauFeuchte',
  'permanenteWassereinwirkungSpaltetHydroly', 'kritischBeiStehendemWasser', 'weichmacherMigrationVerflüchtigung',
  'niedermolekulareWeichmacherDiffundierenB', 'folgeMassiverVolumenschwundErhöhung',
  'mikrobiellerBefallSchimmelbildung', 'inFeuchträumenNutzenPilzsporen', 'fungizideZusätzeWerdenMit',
  't4TypischeSchadensbilderIm', 'flankenabrissAdhäsionsbruch', 'häufigstesSchadensbild',
  'erscheinungsbildDerDichtstoffstrangLöst', 'hauptursachenFehlenderOderUngeeigneter',
  'sanierungKomplettHerausschneidenFlanken', 'kohäsionsbruchMittenrissMaterialriss',
  'erscheinungsbildLängsrissMittigIm', 'hauptursachenFugeZuSchmal', 'sanierungRechnerischeFugenbreitePrüfen',
  'blasenbildungAufschäumen', 'polyurethan2k', 'erscheinungsbildSichtbarePorenBlasen', 'rNcoHO',
  'hauptursachenFeuchtigkeitImMineralischen', 'starkeSonneneinstrahlungBeiFrischer',
  'sanierungAufgeschäumtesMaterialVollständ', 'randzonenverschmutzungVerfärbung', 'natursteinFassade',
  'erscheinungsbildDunkleFeuchtWirkende', 'hauptursachenNichtWeichmacherfreieSiliko',
  'sanierungMeistIrreparabelChemische', 'juristischerHinweisNachDin', 'häufigDeklarierenVerarbeiterSilikonfugen',
];
const WERTE = ['klebDichtstoffSchäden', 'anwendungstippsFehlerquellenAlterungsmec', 'zuSchmaleFugenÜberdehnen', 'din18540DinEn'];
gilt(TEXTE.length === 76 && WERTE.length === 4, 'Schlüsselliste unvollständig');
for (const k of TEXTE) {
  gilt(typeof T.texte[k] === 'string' && T.texte[k].length > 0, `texte.${k} fehlt in schadensbilder`);
  gilt(!(k in B.texte), `texte.${k} noch in bauschaeden`);
  gilt(tbTsx.includes(`inhalt.texte.${k}`), `texte.${k} wird im Schadensatlas nicht angezeigt`);
}
for (const k of WERTE) gilt(typeof T.werte[k] === 'string' && !(k in B.werte) && tbTsx.includes(`inhalt.werte.${k}`), `werte.${k} nicht verschoben`);
gilt(/Dreiflanken/.test(T.texte.dreiflankenhaftungKlassischerKardinalfeh), 'Fehlerquelle Dreiflankenhaftung fehlt');
gilt(/DIN 52460/.test(T.texte.juristischerHinweisNachDin), 'Rechtshinweis Wartungsfugen (DIN 52460) fehlt');

// 3. Beispiel Mindestfugenbreite: im Schadensatlas als Beispiel 3, in bauschaeden nicht mehr
const s3 = T.daten['TypischeBauschaeden.schritte_3'] as { titel: string; formel: string }[];
gilt(Array.isArray(s3) && s3.length === 3 && s3[2].formel.includes('19{,}2') && !('Bauschaeden.schritte_2' in B.daten), 'Beispiel Fugenbreite nicht verschoben');
gilt(!!T.werte.beispiel3MindestbreiteEiner?.startsWith('Beispiel 3:') && tbTsx.includes('TypischeBauschaeden.schritte_3')
  && !bsTsx.includes('schritte_2') && !('beispiel2MindestbreiteEiner' in B.werte), 'Beispiel 3 nicht eingebunden');
const nachrechnung = 6000 * 10e-6 * 80 / 0.25;                       // b_erf = L · α_T · ΔT / ZGV in mm
gilt(Math.abs(nachrechnung - 19.2) < 1e-9, 'Nachrechnung Fugenbreite');

// 4. Fußzeile: Regelwerke, Literatur, Weblinks, Formel und Wikipedia-Verweise zu Dichtstoffen mitgezogen
const txt = (x: unknown) => JSON.stringify(x);
for (const n of ['DIN 18540', 'DIN EN 15651', 'DIN 52460']) {
  gilt(txt(T.daten['TypischeBauschaeden.regelwerke']).includes(n) && !txt(B.daten['Bauschaeden.regelwerke']).includes(n), `Regelwerk ${n} nicht verschoben`);
}
gilt(txt(T.daten['TypischeBauschaeden.literatur']).includes('IVD-Merkblatt Nr. 1') && !txt(B.daten['Bauschaeden.literatur']).includes('IVD'), 'IVD-Merkblätter nicht verschoben');
gilt(txt(T.daten['TypischeBauschaeden.weblinks']).includes('ivd-ev.de') && !txt(B.daten['Bauschaeden.weblinks']).includes('ivd-ev.de'), 'Weblink IVD nicht verschoben');
gilt(txt(T.daten['TypischeBauschaeden.formeln']).includes('ZGV') && !txt(B.daten['Bauschaeden.formeln']).includes('ZGV'), 'Formel b_erf nicht verschoben');
gilt(tbTsx.includes('wiki/Dichtstoff') && !bsTsx.includes('wiki/Dichtstoff') && !bsTsx.includes('wiki/Klebstoff'), 'Wikipedia-Verweise nicht verschoben');

// 5. Verweis in Recht & Grundlagen mit Direktsprung in den Reiter; Querverweise auf den Schadensatlas
gilt(B.texte.verweisKlebDichtTitel === 'Kleb- und Dichtstoffschäden → Typische Bauschäden', 'Verweis in bauschaeden fehlt');
gilt(/setTypischeBauschaedenSubTab\('kleb_dicht'\); setActiveTab\('schadensbilder'\)/.test(bsTsx), 'Verweisknopf springt nicht in den Reiter');
gilt(/'tief_ingenieurbau' \| 'kleb_dicht' \| 'analysator'/.test(fs.readFileSync('src/contexts/TabContext.tsx', 'utf8')), 'TabContext kennt kleb_dicht nicht');
const bwu = fs.readFileSync('src/modules/Bauwerksuntersuchung.tsx', 'utf8');
gilt(!/linkTab: "bauschaeden"|setActiveTab\('bauschaeden'\)/.test(bwu), 'Bauwerksuntersuchung: „Schadensbilder“ zeigt noch auf Recht & Grundlagen');

// 6. Registry: Suchbegriffe und Beschreibung beim Schadensatlas
const sb = MODUL_BY_ID.get('schadensbilder')!, rg = MODUL_BY_ID.get('bauschaeden')!;
gilt(!!sb.suche?.includes('dichtstoffschäden') && !!sb.suche?.includes('klebstoffschäden') && !rg.suche?.some(s => /kleb|dicht/.test(s)), 'Suchbegriffe nicht verschoben');
gilt(/Kleb- und Dichtstoffschäden/.test(sb.meta ?? ''), 'Meta schadensbilder ohne Kleb- und Dichtstoffschäden');

// 7. Lernziele und Kurzfassung („Das Wichtigste“): Fugenanteil nur noch im Schadensatlas
const lz = (id: string) => LERNZIELE[id].ziele.map(z => z.text).join(' ');
gilt(!/Fuge|Dichtstoff/.test(lz('bauschaeden')) && /Fassadenfuge/.test(lz('schadensbilder')) && /Flankenabriss/.test(lz('schadensbilder')), 'Lernziele nicht verschoben');
gilt(!/Fuge|Dichtstoff|Dreiflanken/.test(KURZFASSUNG.bauschaeden.join(' ')) && /Dreiflankenhaftung/.test(KURZFASSUNG.schadensbilder.join(' ')), 'Kurzfassung nicht verschoben');

// 8. Quiz: keine Frage zu Kleb- und Dichtstoffen hängt an bauschaeden (Stand 02.11.: es gab keine, Zuordnung unverändert)
type Frage = { id: string; moduleId: string; topic: string; question: string };
const qs = quiz as unknown as Frage[];
const kd = (q: Frage) => /dichtstoff|klebstoff|fuge|flanke/i.test(q.topic + ' ' + q.question);
gilt(!qs.some(q => q.moduleId === 'bauschaeden' && kd(q)), 'Quizfrage zu Kleb-/Dichtstoffen noch bei bauschaeden');
// ohne die Lernziel-Fragen qlz_* (Kleinpunkte 04.11.2026: qlz_bauschaeden_1 zu Mangel/Schaden, kein Kleb-/Dichtstoffthema)
gilt(qs.filter(q => q.moduleId === 'bauschaeden' && !q.id.startsWith('qlz_')).length === 6, 'Anzahl Fragen bauschaeden geändert');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: Reiter, ${TEXTE.length + WERTE.length} Schlüssel, Beispiel, Fußzeile, Verweise, Lernziele, Kurzfassung und Quiz geprüft`);
