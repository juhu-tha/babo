// Normen-Check (Umsetzungsplan Phase 6, AP 6.7): Parser und Abgleich offline gegen Fixtures
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import os from 'os';
import {
  parseTdmRep, tdmVorbehalt, tdmAusAntwort, TDMREP_PFAD,
  leseRegistry, normZiele, vergleicheAusgabe, slugVon, normZitate, fundstellen,
  parseRobots, robotsErlaubt, parseSitemapLocs, indexiereDinMedia, parseDinMediaSeite, bewerteNorm,
  deDaten, parseGiiSeite, bewerteGesetz, Abrufer, fuehreCheckAus, berichtMarkdown, aktualisierePruefliste,
  MARKE_START, MARKE_ENDE,
} from '../scripts/qa/normen-check.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const gleich = (ist: unknown, soll: unknown, msg: string) =>
  pruefe(JSON.stringify(ist) === JSON.stringify(soll), `${msg}: ${JSON.stringify(ist)} ≠ ${JSON.stringify(soll)}`);
const FIX = path.join('tests', 'fixtures', 'normen-check');
const fixture = (n: string) => fs.readFileSync(path.join(FIX, n), 'utf8');

console.log('--- Test: Normen-Check ---');

// 1. Registry-Codes zerlegen
const ziele = (c: string, a = '') => normZiele(c, a).map((z: { nummer: string; soll: string | null }) => `${z.nummer}@${z.soll}`);
gleich(ziele('DIN EN 206:2021-06 / DIN 1045-2:2023-08'), ['DIN EN 206@2021-06', 'DIN 1045-2@2023-08'], 'zwei Normen');
gleich(ziele('DIN 18945 / 18946 / 18947:2024-03'), ['DIN 18945@2024-03', 'DIN 18946@2024-03', 'DIN 18947@2024-03'], 'Präfix vererbt, Datum nachgezogen');
gleich(ziele('DIN EN 998-1 / -2:2017-02'), ['DIN EN 998-1@2017-02', 'DIN EN 998-2@2017-02'], 'Teilnummer „-2“');
gleich(ziele('DIN 18040-1:2010-10, -2:2011-09, -3:2014-12'), ['DIN 18040-1@2010-10', 'DIN 18040-2@2011-09', 'DIN 18040-3@2014-12'], 'Teile mit eigenen Ausgaben');
gleich(ziele('DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (eingeführt) / DIN EN 1992-1-1:2025-09 (2. Generation)'), ['DIN EN 1992-1-1@2025-09'], 'zwei Generationen → neueste');
gleich(normZiele('DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA / DIN EN 1992-1-1:2025-09')[0].ausgaben, ['2011-01', '2025-09'], 'beide Ausgaben behalten');
gleich(ziele('DIN EN 15804:2022-03+A2:2019'), ['DIN EN 15804@2022-03'], 'Änderung A2 ignoriert');
gleich(ziele('DIN 4102-1 bis -22', '2016-05'), ['DIN 4102-1@2016-05'], 'ohne Datum → ausgabeStand');
gleich(ziele('DIN EN 771-1 bis -6:2015-11'), ['DIN EN 771-1@2015-11'], 'Bereich „bis -6“');
gleich(ziele('DIN EN 300:2006-09 / DIN EN 310', '2006-09'), ['DIN EN 300@2006-09', 'DIN EN 310@null'], 'zweite Norm ohne Datum');
gleich(ziele('DBV-Merkblatt Nachbehandlung:2020'), [], 'kein DIN-Dokument');
gleich(ziele('Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG)'), [], 'Gesetz');
gleich(ziele('DIN EN ISO 12944-1 bis -9:2018-06'), ['DIN EN ISO 12944-1@2018-06'], 'EN ISO');

const reg = leseRegistry(fs.readFileSync('src/data/centralNormenRegistry.ts', 'utf8'));
pruefe(reg.length >= 50, `Registry: nur ${reg.length} Einträge gelesen`);
const r1045 = reg.find((e: { id: string }) => e.id === 'DIN_1045_3');
gleich(r1045 && { code: r1045.code, stand: r1045.ausgabeStand, mod: r1045.relevanteModule[0] }, { code: 'DIN 1045-3:2023-08', stand: '2023-08', mod: 'nachbehandlung' }, 'Registry-Eintrag');
for (const e of reg) pruefe(!!e.code && !!e.ausgabeStand, `Registry ${e.id}: code/ausgabeStand nicht gelesen`);

// 2. Hilfsfunktionen
gleich([vergleicheAusgabe('2023-08', '2023-08'), vergleicheAusgabe('2021-06', '2023-08'), vergleicheAusgabe('2026-05', '2024-03'), vergleicheAusgabe('2020', '2020-04')], [0, -1, 1, 0], 'Ausgabevergleich');
gleich(slugVon('DIN EN ISO 12944-1'), 'din-en-iso-12944-1', 'Slug');
gleich(normZitate('q_mp_4: „DIN ISO 13528:2025-07“ und DIN 1076:2026-01, DIN SPEC 91525 (2026)').map((z: { nummer: string; ausgabe: string }) => `${z.nummer}:${z.ausgabe}`), ['DIN ISO 13528:2025-07', 'DIN 1076:2026-01'], 'Normzitate');
const fs1 = fundstellen('DIN 1045-3', [
  { pfad: 'src/a.tsx', text: "title: 'DIN 1045-3:2023-08 – Bauausführung', DIN 1045-30:2020" },
  { pfad: 'src/b.tsx', text: 'nach DIN 1045-3:2012-03 und DIN  1045-3 : 2023-08' },
]);
gleich(Object.fromEntries([...fs1].map(([k, v]) => [k, [...v].sort()])), { '2023-08': ['src/a.tsx', 'src/b.tsx'], '2012-03': ['src/b.tsx'] }, 'Fundstellen (ohne DIN 1045-30)');

// 3. robots.txt
const robots = parseRobots(`User-agent: *\nDisallow: /beuth/owa/\nDisallow: /*!suggest\nDisallow: /php/\n\nUser-agent: AhrefsBot\nDisallow: /\n\nUser-agent: babo-normen-check\nUser-agent: other\nDisallow: /de/suche\nAllow: /de/suche/erlaubt$\nCrawl-delay: 5\n\nSitemap: https://www.dinmedia.de/service-sitemap-dinmedia-de-sitemap_index.xml\n`);
gleich([robotsErlaubt(robots, '/de/norm/din-1045-3/369493725'), robotsErlaubt(robots, '/de/suche?q=x'), robotsErlaubt(robots, '/de/suche/erlaubt'), robotsErlaubt(robots, '/beuth/owa/x')], [true, false, true, true], 'eigene Gruppe vor „*“');
gleich(robots.crawlDelay, 5, 'Crawl-delay');
gleich(robots.sitemaps, ['https://www.dinmedia.de/service-sitemap-dinmedia-de-sitemap_index.xml'], 'Sitemaps');
const stern = parseRobots('User-agent: *\nDisallow: /php/\nDisallow: /*!suggest\nDisallow:\n');
gleich([robotsErlaubt(stern, '/php/a'), robotsErlaubt(stern, '/x!suggest'), robotsErlaubt(stern, '/de/norm/a/1')], [false, false, true], '„*“-Gruppe, Wildcard');
gleich(robotsErlaubt(parseRobots('User-agent: *\nDisallow: /\n'), '/de/norm/x/1'), false, 'alles gesperrt');

// 4. DIN Media
const locs = parseSitemapLocs('<urlset><url><loc>https://www.dinmedia.de/de/norm/din-1045-3/369493725</loc></url><url><loc>https://www.dinmedia.de/de/technische-regel/din-1045-3/9</loc></url><url><loc>https://www.dinmedia.de/de/normen-management</loc></url></urlset>');
const idx = indexiereDinMedia(locs);
gleich(idx.get('din-1045-3'), ['https://www.dinmedia.de/de/norm/din-1045-3/369493725', 'https://www.dinmedia.de/de/technische-regel/din-1045-3/9'], 'Sitemap-Index, Norm zuerst');
pruefe(!idx.has('normen-management'), 'Sitemap: Nicht-Produktseite indiziert');

const sAkt = parseDinMediaSeite(fixture('dinmedia-aktuell.html'));
gleich({ n: sAkt.nummer, a: sAkt.ausgabe, z: sAkt.zurueckgezogen, e: sAkt.ersetztDurch.length }, { n: 'DIN 1045-3', a: '2023-08', z: false, e: 0 }, 'aktuelle Seite');
const sErs = parseDinMediaSeite(fixture('dinmedia-ersetzt.html'));
gleich({ a: sErs.ausgabe, z: sErs.zurueckgezogen, t: sErs.teilweise, e: sErs.ersetztDurch.map((x: { code: string; href: string }) => [x.code, x.href]) },
  { a: '2013-02', z: true, t: false, e: [['DIN 4108-2:2026-05', 'https://www.dinmedia.de/de/norm/din-4108-2/401017482']] }, 'ersetzte Seite');
const sTeil = parseDinMediaSeite(fixture('dinmedia-teilweise.html'));
gleich({ t: sTeil.teilweise, e: sTeil.ersetztDurch[0]?.nummer }, { t: true, e: 'DIN EN 13238' }, 'teilweise ersetzt');
const sZur = parseDinMediaSeite(fixture('dinmedia-zurueckgezogen.html'));
gleich({ z: sZur.zurueckgezogen, e: sZur.ersetztDurch.length }, { z: true, e: 0 }, 'zurückgezogen ohne Nachfolger');
gleich(parseDinMediaSeite('<html><title>Fehler</title></html>').lesbar, false, 'unbekannte Seite nicht lesbar');

const z = (c: string, a = '') => normZiele(c, a)[0];
const seite = (nummer: string, ausgabe: string, extra = {}) => ({ nummer, ausgabe, zurueckgezogen: false, teilweise: false, ersetztDurch: [], ...extra });
gleich(bewerteNorm(z('DIN 1045-3:2023-08'), [sAkt]).befund, 'aktuell', 'Befund aktuell');
gleich(bewerteNorm(z('DIN 4108-2:2024-03'), [sErs, seite('DIN 4108-2', '2026-05')]).befund, 'neuere_ausgabe', 'Befund neuere Ausgabe');
gleich(bewerteNorm(z('DIN 4108-2:2026-05'), [sErs, seite('DIN 4108-2', '2026-05')]).befund, 'aktuell', 'Kette bis zur aktuellen Ausgabe');
gleich(bewerteNorm(z('DIN 1045-3:2025-01'), [sAkt]).befund, 'registry_neuer', 'Befund Registry neuer');
gleich(bewerteNorm(z('DIN 1052:2008-12'), [sZur], 'gueltig').befund, 'zurueckgezogen', 'Befund zurückgezogen');
gleich(bewerteNorm(z('DIN 1052:2008-12'), [sZur], 'ersetzt').befund, 'aktuell', 'zurückgezogen und in Registry als ersetzt');
gleich(bewerteNorm(z('DIN 18195:2017-07'), [parseDinMediaSeite(fixture('dinmedia-andere.html')), seite('DIN 18531-1', '2017-07')]).befund, 'ersetzt_durch_andere', 'Befund anderes Dokument');
gleich(bewerteNorm(z('DIN 4102-1 bis -22', '2016-05'), [sTeil]).befund, 'teilweise_ersetzt', 'Befund teilweise');
gleich(bewerteNorm(z('DIN EN 1992-1-1:2011-01 / DIN EN 1992-1-1:2025-09'), [seite('DIN EN 1992-1-1', '2011-01')]).befund, 'aktuell', 'eingeführte Vorgängerausgabe zählt');

// 5. gesetze-im-internet.de
gleich(deDaten('Art. 1 V v. 2.12.2024 I Nr. 384 und vom 26. November 2010'), ['2010-11-26', '2024-12-02'], 'deutsche Datumsangaben');
const gIdx = parseGiiSeite(fixture('gii-index.html'));
gleich({ s: gIdx.standDatum, v: gIdx.volltextHref }, { s: null, v: 'BJNR164400010.html' }, 'Inhaltsübersicht → Volltext-Link');
const gVoll = parseGiiSeite(fixture('gii-volltext.html'));
gleich({ s: gVoll.standDatum, a: gVoll.ausfertigung, t: gVoll.standText, b: gVoll.bgbl }, { s: '2026-06-15', a: '2010-11-26', t: 'Zuletzt geändert durch Art. 1 V v. 2.12.2024 I Nr. 384', b: 'I Nr. 384' }, 'Stand inkl. Hinweis, ohne Normtext/Fußnote');
pruefe(/Gefahrstoffverordnung - GefStoffV/.test(gVoll.titel ?? ''), `gii-Titel: ${gVoll.titel}`);
gleich([bewerteGesetz(null, gVoll), bewerteGesetz('2026-06-15', gVoll), bewerteGesetz('2024-12-02', gVoll), bewerteGesetz('2024-12-02', { standDatum: null })], ['basis_erfasst', 'unveraendert', 'geaendert', 'nicht_lesbar'], 'Gesetzesbefund');

// 6. Gesamtlauf mit simuliertem Netz (kein echter Abruf)
const gz = (s: string) => zlib.gzipSync(Buffer.from(s));
const D = 'https://www.dinmedia.de';
const G = 'https://www.gesetze-im-internet.de';
const netz: Record<string, { status: number; body: Buffer }> = {
  [`${D}/robots.txt`]: { status: 200, body: Buffer.from(`User-agent: *\nDisallow: /php/\nSitemap: ${D}/service-sitemap-dinmedia-de-sitemap_index.xml\n`) },
  [`${D}/service-sitemap-dinmedia-de-sitemap_index.xml`]: { status: 200, body: Buffer.from(`<sitemapindex><sitemap><loc>${D}/service-sitemap-dinmedia-de-sitemap1.xml.gz</loc></sitemap></sitemapindex>`) },
  [`${D}/service-sitemap-dinmedia-de-sitemap1.xml.gz`]: { status: 200, body: gz(`<urlset><url><loc>${D}/de/norm/din-1045-3/1</loc></url><url><loc>${D}/de/norm/din-4108-2/2</loc></url><url><loc>${D}/de/norm/din-1052/3</loc></url></urlset>`) },
  [`${D}/de/norm/din-1045-3/1`]: { status: 200, body: Buffer.from(fixture('dinmedia-aktuell.html')) },
  [`${D}/de/norm/din-4108-2/2`]: { status: 200, body: Buffer.from(fixture('dinmedia-ersetzt.html')) },
  [`${D}/de/norm/din-4108-2/401017482`]: { status: 200, body: Buffer.from(fixture('dinmedia-nachfolger.html')) },
  [`${D}/de/norm/din-1052/3`]: { status: 200, body: Buffer.from(fixture('dinmedia-zurueckgezogen.html')) },
  [`${G}/robots.txt`]: { status: 404, body: Buffer.from('') },
  [`${G}/gefstoffv_2010/index.html`]: { status: 200, body: Buffer.from(fixture('gii-index.html')) },
  [`${G}/gefstoffv_2010/BJNR164400010.html`]: { status: 200, body: Buffer.from(fixture('gii-volltext.html')) },
};
const abgerufen: string[] = [];
const holen = async (url: string) => { abgerufen.push(url); return netz[url] ?? { status: 404, body: Buffer.from('') }; };
const registryText = `export const CENTRAL_NORMEN_REGISTRY = {
  'DIN_1045_3': {
    id: 'DIN_1045_3',
    code: 'DIN 1045-3:2023-08',
    ausgabeStand: '2023-08',
    status: 'gueltig',
    relevanteModule: ['nachbehandlung', 'betonpraxis']
  },
  'DIN_4108_2': {
    id: 'DIN_4108_2',
    code: 'DIN 4108-2:2013-02',
    ausgabeStand: '2013-02',
    status: 'gueltig',
    relevanteModule: ['bauphysik']
  },
  'DIN_1052': {
    id: 'DIN_1052',
    code: 'DIN 1052:2008-12 (zurückgezogen)',
    ausgabeStand: '2008-12',
    status: 'ersetzt',
    relevanteModule: ['holzbau']
  },
  'DIN_18531': {
    id: 'DIN_18531',
    code: 'DIN 18531:2017-07',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    relevanteModule: ['abdichtung']
  },
  'DBV': {
    id: 'DBV',
    code: 'DBV-Merkblatt Nachbehandlung:2020',
    ausgabeStand: '2020-04',
    status: 'gueltig',
    relevanteModule: []
  }
};`;
const gesetze = {
  gesetze: [
    { kurz: 'GefStoffV', titel: 'Gefahrstoffverordnung', gii: 'gefstoffv_2010', suchmuster: '\\bGefStoffV\\b' },
    { kurz: 'XYZV', titel: 'Testverordnung', gii: 'gibtsnicht', suchmuster: '\\bXYZV\\b' },
  ],
  eu: [{ kurz: 'BauPVO', fundstelle: 'VO (EU) 2024/3110', url: 'https://eur-lex.europa.eu/eli/reg/2024/3110/oj' }],
};
const pruefliste = '# Prüfhinweise\n\n- [ ] **q_bp_9**: Ausgabe „DIN 4108-2:2026-05“ prüfen.\n- [ ] **q_x_1**: DIN 1045-3:2012-03 bestätigen.\n';
const srcDateien = [
  { pfad: 'src/modules/Bauphysik.tsx', text: "{ title: 'DIN 4108-2:2013-02 Mindestwärmeschutz' } GefStoffV" },
  { pfad: 'src/modules/Beton.tsx', text: "{ title: 'DIN 1045-3:2023-08' }" },
];

(async () => {
  const abrufer = new Abrufer({ holen, verzoegerungMs: 0, cacheDir: null });
  const e = await fuehreCheckAus({ registryText, gesetze, pruefliste, srcDateien, abrufer, datum: '2027-03-01', vorher: { gesetze: [{ kurz: 'GefStoffV', standDatum: '2024-12-02' }] } });
  const befund = Object.fromEntries(e.normen.map((n: { nummer: string; befund: string }) => [n.nummer, n.befund]));
  gleich(befund, { 'DIN 1045-3': 'aktuell', 'DIN 4108-2': 'neuere_ausgabe', 'DIN 1052': 'aktuell', 'DIN 18531': 'nicht_gefunden' }, 'Gesamtlauf: Normbefunde');
  const n4108 = e.normen.find((n: { nummer: string }) => n.nummer === 'DIN 4108-2');
  gleich(n4108.kette.map((k: { code: string }) => k.code), ['DIN 4108-2:2013-02', 'DIN 4108-2:2026-05'], 'Gesamtlauf: Ersatzkette gefolgt');
  gleich(n4108.fundstellen, { '2013-02': ['src/modules/Bauphysik.tsx'] }, 'Gesamtlauf: Fundstellen');
  gleich(e.gesetze.map((g: { kurz: string; befund: string }) => `${g.kurz}:${g.befund}`), ['GefStoffV:geaendert', 'XYZV:nicht_abrufbar'], 'Gesamtlauf: Gesetze');
  gleich(e.gesetze[0].dateien, ['src/modules/Bauphysik.tsx'], 'Gesamtlauf: Dateien mit Gesetzesbezug');
  gleich(e.manuell.map((m: { code: string }) => m.code), ['DBV-Merkblatt Nachbehandlung:2020', 'BauPVO – VO (EU) 2024/3110'], 'Gesamtlauf: manuelle Punkte');
  gleich(e.zusammenfassung.handlungsbedarf, 2, 'Gesamtlauf: Handlungsbedarf');
  pruefe(e.zusammenfassung.quelleErreicht === true, 'Gesamtlauf: Quelle erreicht');
  pruefe(abgerufen.every(u => u in netz || u.includes('gibtsnicht') || u.endsWith(TDMREP_PFAD)), `Gesamtlauf: unerwartete Abrufe ${abgerufen.filter(u => !(u in netz)).join(', ')}`);
  pruefe(abgerufen.filter(u => u.endsWith(TDMREP_PFAD)).length === 2, 'tdmrep.json je Host genau einmal');
  pruefe(abgerufen.filter(u => u.endsWith('/robots.txt')).length === 2, 'robots.txt je Host genau einmal');

  const md = berichtMarkdown(e);
  pruefe(md.startsWith('# Normen- und Rechtsstand-Check 2027-03'), 'Bericht: Überschrift');
  pruefe(/\| DIN 4108-2 \| 2013-02 \(`DIN_4108_2`\) \| \[DIN 4108-2:2026-05\]/.test(md), 'Bericht: Zeile DIN 4108-2');
  pruefe(md.includes('`bauphysik`') && md.includes('2013-02: `modules/Bauphysik.tsx`'), 'Bericht: Module und Fundstellen');
  pruefe(md.includes('**DIN 18531** (soll 2017-07') && md.includes('[DIN-Media-Suche]'), 'Bericht: manueller Punkt mit Suchlink');
  pruefe(md.includes('| [GefStoffV]') && md.includes('02.12.2024 | 15.06.2026'), 'Bericht: geänderte Verordnung');

  const neu = aktualisierePruefliste(pruefliste, e, 'normen-check/2027-03.md');
  pruefe(neu.startsWith(pruefliste.trimEnd()), 'Prüfliste: bestehende Punkte unverändert');
  pruefe(neu.includes(MARKE_START) && neu.includes(MARKE_ENDE), 'Prüfliste: Markierungen');
  pruefe(neu.includes('- [ ] **DIN 4108-2**: neuere Ausgabe erschienen – soll 2013-02, DIN Media DIN 4108-2:2026-05 – Module: bauphysik'), 'Prüfliste: Punkt DIN 4108-2');
  pruefe(neu.includes('q_bp_9 – DIN 4108-2:2026-05: DIN Media nennt DIN 4108-2:2026-05 → Ausgabe bestätigt'), 'Prüfliste: Abgleich q_bp_9');
  pruefe(neu.includes('q_x_1 – DIN 1045-3:2012-03: DIN Media nennt DIN 1045-3:2023-08 → abweichend'), 'Prüfliste: Abgleich q_x_1');
  const zweimal = aktualisierePruefliste(neu, e, 'normen-check/2027-03.md');
  gleich(zweimal, neu, 'Prüfliste: idempotent');

  // robots.txt nicht erreichbar → keine Abfrage
  const gesperrt: string[] = [];
  const ab2 = new Abrufer({ holen: async (u: string) => { gesperrt.push(u); return { status: 503, body: Buffer.from('') }; }, verzoegerungMs: 0 });
  const e2 = await fuehreCheckAus({ registryText, gesetze, srcDateien, abrufer: ab2, datum: '2027-03-01' });
  pruefe(e2.normen.every((n: { befund: string }) => n.befund === 'uebersprungen'), 'ohne robots.txt: Normen übersprungen');
  pruefe(gesperrt.every(u => u.endsWith('/robots.txt')), `ohne robots.txt: trotzdem abgerufen ${gesperrt.join(', ')}`);
  pruefe(e2.zusammenfassung.quelleErreicht === false, 'ohne robots.txt: quelleErreicht false');

  // 7. TDM-Vorbehalt (§ 44b UrhG): tdmrep.json, Header, Meta
  const regeln = parseTdmRep(fixture('tdmrep-vorbehalt.json'));
  gleich(regeln?.length, 3, 'tdmrep.json gelesen');
  gleich(tdmVorbehalt(regeln, '/de/norm/din-1045-3/1')?.location, '/de/norm/*', 'Vorbehalt für Produktseite');
  gleich(tdmVorbehalt(regeln, '/de/norm/frei/x'), null, 'spezifischere Regel ohne Vorbehalt gewinnt');
  gleich(tdmVorbehalt(regeln, '/service-sitemap-dinmedia-de-sitemap_index.xml'), null, 'Sitemap ohne Vorbehalt');
  gleich(tdmVorbehalt(parseTdmRep('[{"location":"/","tdm-reservation":1}]'), '/gefstoffv_2010/index.html')?.location, '/', '„/“ gilt für alles');
  gleich([parseTdmRep('kein json'), parseTdmRep('{"location":"/"}')], [null, null], 'ungültige tdmrep.json');
  gleich(tdmAusAntwort({ 'TDM-Reservation': '1' }, ''), 'HTTP-Header tdm-reservation: 1', 'Header (Groß-/Kleinschreibung egal)');
  gleich(tdmAusAntwort({ 'tdm-reservation': '0' }, '<meta name="tdm-reservation" content="0">'), null, 'Wert 0 = kein Vorbehalt');
  gleich(tdmAusAntwort({}, fixture('gii-tdm-meta.html')), '<meta name="tdm-reservation" content="1">', 'Meta, Attribute vertauscht');
  gleich(tdmAusAntwort({}, fixture('dinmedia-aktuell.html')), null, 'Seite ohne Vorbehalt');

  const lauf = async (extra: Record<string, { status: number; body: Buffer; headers?: Record<string, string> }>) => {
    const urls: string[] = [];
    const logs: string[] = [];
    const ab = new Abrufer({ holen: async (u: string) => { urls.push(u); return extra[u] ?? netz[u] ?? { status: 404, body: Buffer.from('') }; }, verzoegerungMs: 0, log: (m: string) => logs.push(m) });
    const erg = await fuehreCheckAus({ registryText, gesetze, pruefliste, srcDateien, abrufer: ab, datum: '2027-03-01' });
    return { erg, urls, logs };
  };
  type N = { befund: string; grund?: string; aktuell?: unknown; kette: unknown[] };
  type Gz = { kurz: string; befund: string; standDatum?: string };

  // a) tdmrep.json behält Produktseiten vor → keine Produktseite abgerufen, alles manuell
  const a = await lauf({ [`${D}${TDMREP_PFAD}`]: { status: 200, body: Buffer.from(fixture('tdmrep-vorbehalt.json')) } });
  pruefe(a.erg.normen.every((n: N) => n.befund === 'tdm_vorbehalt' && !n.aktuell && !n.kette.length), `tdmrep.json: Befunde ${a.erg.normen.map((n: N) => n.befund).join(',')}`);
  pruefe(!a.urls.some(u => u.includes('/de/norm/')), 'tdmrep.json: Produktseite trotz Vorbehalt abgerufen');
  pruefe(a.logs.some(l => l.includes('TDM-Vorbehalt laut /.well-known/tdmrep.json')), 'tdmrep.json: Grund protokolliert');
  pruefe(a.erg.gesetze[0].befund === 'basis_erfasst', 'tdmrep.json: andere Quelle unberührt');
  pruefe(berichtMarkdown(a.erg).includes('Nutzungsvorbehalt für Text und Data Mining'), 'tdmrep.json: Bericht nennt Vorbehalt');
  pruefe(a.erg.quellen.dinMedia.startsWith('nicht ausgewertet: TDM-Vorbehalt'), 'tdmrep.json: Quellenangabe');

  // b) Header auf einer Produktseite → ganze Quelle manuell, auch bereits ausgewertete Normen
  const b = await lauf({ [`${D}/de/norm/din-4108-2/2`]: { status: 200, body: Buffer.from(fixture('dinmedia-ersetzt.html')), headers: { 'tdm-reservation': '1' } } });
  pruefe(b.erg.normen.every((n: N) => n.befund === 'tdm_vorbehalt'), `Header: Befunde ${b.erg.normen.map((n: N) => n.befund).join(',')}`);
  pruefe(!b.urls.includes(`${D}/de/norm/din-1052/3`), 'Header: nach Vorbehalt weiter abgerufen');
  pruefe(b.erg.normen.every((n: N) => (n.grund ?? '').includes('HTTP-Header tdm-reservation: 1')), 'Header: Grund je Norm');

  // c) Meta-Angabe bei gesetze-im-internet.de → Gesetze manuell, Normen unberührt
  const c = await lauf({ [`${G}/gefstoffv_2010/index.html`]: { status: 200, body: Buffer.from(fixture('gii-tdm-meta.html')) } });
  gleich(c.erg.gesetze.map((g: Gz) => `${g.kurz}:${g.befund}:${g.standDatum ?? '-'}`), ['GefStoffV:tdm_vorbehalt:-', 'XYZV:tdm_vorbehalt:-'], 'Meta: Gesetze manuell, kein Stand übernommen');
  gleich(c.erg.normen.find((n: { nummer: string }) => n.nummer === 'DIN 1045-3').befund, 'aktuell', 'Meta: DIN Media unberührt');
  pruefe(c.erg.zusammenfassung.gesetzeManuell === 2, 'Meta: Zählung manuell');

  // d) tdmrep.json nicht abrufbar (5xx) → vorsorglich keine automatische Prüfung
  const d = await lauf({ [`${D}${TDMREP_PFAD}`]: { status: 503, body: Buffer.from('') } });
  pruefe(d.erg.normen.every((n: N) => n.befund === 'tdm_vorbehalt' || n.befund === 'uebersprungen'), 'tdmrep.json 503: Normen manuell');
  pruefe(!d.urls.some(u => u.includes('/de/norm/') || u.includes('sitemap')), 'tdmrep.json 503: trotzdem abgerufen');

  // e) kein Seiteninhalt im Cache: nur Sitemaps werden gespeichert
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'normen-cache-'));
  const abC = new Abrufer({ holen: async (u: string) => netz[u] ?? { status: 404, body: Buffer.from('') }, verzoegerungMs: 0, cacheDir });
  await fuehreCheckAus({ registryText, gesetze, srcDateien, abrufer: abC, datum: '2027-03-01' });
  const gespeichert = fs.readdirSync(cacheDir).map(f => fs.readFileSync(path.join(cacheDir, f), 'utf8'));
  pruefe(gespeichert.length === 2 && gespeichert.every(t => /<(urlset|sitemapindex)/.test(t)), `Cache enthält ${gespeichert.length} Dateien, nicht nur Sitemaps`);
  fs.rmSync(cacheDir, { recursive: true, force: true });

  if (fehler.length) {
    for (const f of fehler) console.error(`FAIL: ${f}`);
    process.exit(1);
  }
  console.log('OK: Normen-Check-Parser, robots.txt, TDM-Vorbehalt, Abgleich und Berichte');
})();
