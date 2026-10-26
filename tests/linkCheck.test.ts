// Linkprüfung (Zwischenreview 10/2026, Z16): Extraktion, Klassifikation und Bericht offline gegen Fixtures
import fs from 'fs';
import path from 'path';
import {
  bereinigeUrl, istAusgeschlossen, extrahiereUrls, sammleUrls, parseRobots, robotsErlaubt,
  istBotSchutz, istWeicheWeiterleitung, istSichereErsetzung, klassifiziere, urlHinweise,
  wikiTitel, wikiUrl, bewerteWikiAntwort, cacheFaehig, LinkPruefer, fuehreLinkCheckAus,
  ersetzeUrls, sichereErsetzungen, berichtMarkdown, berichtJson, prBody, fundstellenText, USER_AGENT,
} from '../scripts/qa/link-check.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const gleich = (ist: unknown, soll: unknown, msg: string) =>
  pruefe(JSON.stringify(ist) === JSON.stringify(soll), `${msg}: ${JSON.stringify(ist)} ≠ ${JSON.stringify(soll)}`);
const FIX = path.join('tests', 'fixtures', 'link-check');
const fixture = (n: string) => fs.readFileSync(path.join(FIX, n), 'utf8');

type Ergebnis = { url: string; klasse: string; grund: string; status: number; vorschlag?: string | null; sicher?: boolean; dauerhaft?: boolean; hinweise: string[]; fundstellen: { datei: string; zeile: number }[] };
type Hop = { url: string; status: number; headers?: Record<string, string>; fehler?: string; gesperrt?: string };

console.log('--- Test: Linkprüfung ---');

// 1. Extraktion
gleich(bereinigeUrl('https://de.wikipedia.org/wiki/Putz_(Baustoff))'), 'https://de.wikipedia.org/wiki/Putz_(Baustoff)', 'Klammer: nur unausgeglichene entfernt');
gleich(bereinigeUrl('https://a.de/x.'), 'https://a.de/x', 'Punkt am Satzende');
gleich(bereinigeUrl('https://a.de/x),'), 'https://a.de/x', 'Klammer + Komma');
gleich(bereinigeUrl('https://a.de/x**'), 'https://a.de/x', 'Markdown-Fett');
gleich(bereinigeUrl('https://a.de/x&quot;y'), 'https://a.de/x', 'HTML-Entität');
gleich([istAusgeschlossen('http://localhost:1234/v1'), istAusgeschlossen('http://www.w3.org/2000/svg'), istAusgeschlossen('https://www.example.com/'), istAusgeschlossen('https://www.w3.org/WAI/'), istAusgeschlossen('https://www.tha.de/')],
  ['lokal', 'XML-Namensraum', 'Beispiel', null, null], 'Ausschlüsse');

const modul = fixture('modul.tsx.txt');
const ex = extrahiereUrls(modul);
const exUrls = ex.map((f: { url: string }) => f.url);
gleich(exUrls, [
  'https://de.wikipedia.org/wiki/Beton',
  'https://de.wikipedia.org/wiki/Karbonatisierung_(Beton)',
  'https://de.wikipedia.org/wiki/Gibtsnicht_Artikel_XYZ',
  'https://de.wikipedia.org/wiki/Zement#Geschichte',
  'https://www.beispiel-verband.de/alt',
  'https://www.beispiel-verband.de/alt.html',
  'http://www.beispiel-verband.de/',
  'https://tot.beispiel-domain.de/seite',
  'https://www.beispiel-verband.de/geschuetzt',
  'https://www.youtube.com/results?search_query=beton+pruefung',
  'https://shop.beispiel-verband.de/norm/123',
  'https://www.beispiel-verband.de/umzug',
  'https://www.beispiel-verband.de/tief/unterseite',
], 'Extraktion: Vorlage, localhost, w3.org, example.com und linkcheck-ignore ausgelassen');
const zeile = (u: string) => ex.find((f: { url: string }) => f.url === u)?.zeile;
gleich([zeile('https://de.wikipedia.org/wiki/Beton'), zeile('https://tot.beispiel-domain.de/seite'), zeile('https://www.beispiel-verband.de/geschuetzt')], [5, 18, 18], 'Zeilennummern');

const dateien = [
  { pfad: 'src/modules/Modul.tsx', text: modul },
  { pfad: 'content/beton/inhalt.md', text: fixture('inhalt.md') },
];
const fund = sammleUrls(dateien);
gleich(fund.get('https://www.beispiel-verband.de/alt'), [{ datei: 'src/modules/Modul.tsx', zeile: 14 }, { datei: 'content/beton/inhalt.md', zeile: 3 }], 'Fundstellen über src/ und content/');
gleich(fund.get('https://de.wikipedia.org/wiki/Putz_(Baustoff)'), [{ datei: 'content/beton/inhalt.md', zeile: 4 }], 'Markdown-Link mit Klammern');
gleich(fund.get('https://www.beispiel-verband.de/umzug')?.length, 2, 'Markdown-Fett um URL');
gleich(fund.size, 14, 'Dubletten zusammengefasst');
pruefe([...fund.keys()].every((u, i, a) => i === 0 || a[i - 1] < u), 'URLs sortiert');

// 2. robots.txt
const robots = parseRobots('User-agent: *\nDisallow: /w/\nAllow: /w/load.php?\n\nUser-agent: babo-link-check\nDisallow: /privat\nCrawl-delay: 4\n');
gleich([robotsErlaubt(robots, '/privat/x'), robotsErlaubt(robots, '/w/api.php'), robots.crawlDelay], [false, true, 4], 'eigene Gruppe vor „*“');
const stern = parseRobots('User-agent: *\nDisallow: /w/\nAllow: /w/load.php?\n');
gleich([robotsErlaubt(stern, '/w/api.php?x'), robotsErlaubt(stern, '/w/load.php?a'), robotsErlaubt(stern, '/wiki/Beton')], [false, true, true], '„*“-Gruppe, längste Regel');

// 3. Klassifikation
gleich([istBotSchutz(403), istBotSchutz(429), istBotSchutz(404), istBotSchutz(503, { server: 'cloudflare' }), istBotSchutz(503, { server: 'nginx' }), istBotSchutz(200, { 'cf-mitigated': 'challenge' })],
  [true, true, false, true, false, true], 'Bot-Schutz');
gleich([istWeicheWeiterleitung('https://a.de/x/y', 'https://a.de/'), istWeicheWeiterleitung('https://a.de/x', 'https://a.de/de/'), istWeicheWeiterleitung('https://a.de/', 'https://a.de/de/'), istWeicheWeiterleitung('https://a.de/x', 'https://a.de/login?next=x'), istWeicheWeiterleitung('https://a.de/x', 'https://a.de/y')],
  [true, true, false, true, false], 'weiche Weiterleitung');
gleich([
  istSichereErsetzung('http://www.a.de/x', 'https://www.a.de/x'),
  istSichereErsetzung('https://a.de/x', 'https://www.a.de/x/'),
  istSichereErsetzung('https://a.de/x', 'https://b.de/x'),
  istSichereErsetzung('https://a.de/x', 'http://a.de/x'),
  istSichereErsetzung('https://a.de/x', 'https://a.de/y?utm_source=z'),
  istSichereErsetzung('https://a.de/x', 'https://a.de/y;jsessionid=1'),
  istSichereErsetzung('https://a.de/', 'https://a.de/de/start'),
  istSichereErsetzung('http://a.de', 'https://www.a.de/'),
], [true, true, false, false, false, false, false, true], 'sichere Ersetzung');

const k = (hops: Hop[], url = hops[0]?.url ?? 'https://a.de/x') => klassifiziere(url, hops);
const A = 'https://a.de';
gleich(k([{ url: `${A}/x`, status: 200 }]).klasse, 'ok', '200 → ok');
const dauer = k([{ url: `${A}/x`, status: 301 }, { url: `${A}/y`, status: 308 }, { url: `${A}/z`, status: 200 }]);
gleich({ k: dauer.klasse, d: dauer.dauerhaft, v: dauer.vorschlag, s: dauer.sicher, g: dauer.grund }, { k: 'weiterleitung', d: true, v: `${A}/z`, s: true, g: '301 → 308 → 200' }, '301/308-Kette → Vorschlag Endziel');
const gemischt = k([{ url: `${A}/x`, status: 301 }, { url: `${A}/y`, status: 302 }, { url: `${A}/z?s=1`, status: 200 }]);
gleich({ d: gemischt.dauerhaft, v: gemischt.vorschlag, s: gemischt.sicher }, { d: true, v: `${A}/y`, s: false }, '301 dann 302 → Vorschlag nach dauerhaftem Teil, nicht sicher');
const temp = k([{ url: `${A}/x`, status: 302 }, { url: `${A}/y`, status: 200 }]);
gleich({ k: temp.klasse, d: temp.dauerhaft, v: temp.vorschlag }, { k: 'weiterleitung', d: false, v: null }, '302 → vorübergehend, kein Vorschlag');
const weich = k([{ url: `${A}/tief/x`, status: 301 }, { url: `${A}/`, status: 200 }]);
gleich({ s: weich.sicher, h: weich.hinweise.length }, { s: false, h: 1 }, 'Weiterleitung auf Startseite: nicht sicher, Hinweis');
gleich([k([{ url: `${A}/x`, status: 404 }]).klasse, k([{ url: `${A}/x`, status: 410 }]).grund, k([{ url: `${A}/x`, status: 500 }]).klasse], ['kaputt', 'HTTP 410', 'kaputt'], '4xx/5xx → kaputt');
gleich(k([{ url: `${A}/x`, status: 0, fehler: 'ENOTFOUND' }]).grund, 'DNS: Host nicht gefunden', 'DNS → kaputt');
gleich([k([{ url: `${A}/x`, status: 403 }]).klasse, k([{ url: `${A}/x`, status: 0, gesperrt: 'durch robots.txt ausgeschlossen' }]).klasse, k([{ url: `${A}/x`, status: 429 }]).grund], ['gesperrt', 'gesperrt', 'HTTP 429 (Rate-Limit)'], '403/robots/429 → manuell');
gleich(k([{ url: `${A}/x`, status: 301 }]).klasse, 'kaputt', 'Weiterleitung ohne Ziel');
gleich(urlHinweise('https://www.youtube.com/results?search_query=x').length, 1, 'YouTube-Suchlink');
gleich(urlHinweise('https://www.youtube.com/watch?v=abc'), [], 'YouTube-Video ohne Hinweis');
gleich([cacheFaehig({ klasse: 'ok', status: 200 }), cacheFaehig({ klasse: 'kaputt', status: 404 }), cacheFaehig({ klasse: 'kaputt', status: 0 }), cacheFaehig({ klasse: 'gesperrt', status: 403 })], [true, true, false, false], 'Cache nur für stabile Befunde');

// 4. Wikipedia
gleich(wikiTitel('https://de.wikipedia.org/wiki/Schwindma%C3%9F_(Holz)#Werte'), { host: 'de.wikipedia.org', titel: 'Schwindmaß (Holz)', fragment: 'Werte' }, 'Wikipedia-Titel dekodiert');
gleich([wikiTitel('https://de.wikipedia.org/'), wikiTitel('https://de.wikipedia.org/wiki/Spezial:Suche'), wikiTitel('https://de.wikipedia.org/w/index.php?title=Beton')], [null, null, null], 'keine Artikel-URL');
gleich(wikiTitel('https://de.m.wikipedia.org/wiki/Beton')?.host, 'de.wikipedia.org', 'Mobil-Host');
gleich(wikiUrl('de.wikipedia.org', 'Schwindmaß (Holz)'), 'https://de.wikipedia.org/wiki/Schwindma%C3%9F_(Holz)', 'Wikipedia-URL im Bestandsformat');
const wjson = JSON.parse(fixture('wiki-antwort.json'));
const wb = bewerteWikiAntwort(wjson, ['Beton', 'Karbonatisierung (Beton)', 'Gibtsnicht Artikel XYZ', 'Zement', 'Putz (Baustoff)', 'Nicht angefragt']);
gleich(Object.fromEntries([...wb].map(([t, b]) => [t, b.status])), { Beton: 'ok', 'Karbonatisierung (Beton)': 'weiterleitung', 'Gibtsnicht Artikel XYZ': 'fehlt', Zement: 'ok', 'Putz (Baustoff)': 'weiterleitung', 'Nicht angefragt': 'ungueltig' }, 'API-Antwort ausgewertet');
gleich([wb.get('Zement').begriffsklaerung, wb.get('Putz (Baustoff)').fragment], [true, 'Baustoff'], 'Begriffsklärung und Abschnittsziel');

// 5. Gesamtlauf mit simuliertem Netz
const V = 'https://www.beispiel-verband.de';
const netz: Record<string, Record<string, { status: number; headers?: Record<string, string>; text?: string } | { fehler: string }>> = {
  [`${V}/robots.txt`]: { ROBOTS: { status: 200, text: 'User-agent: *\nDisallow: /geschuetzt\n' } },
  'http://www.beispiel-verband.de/robots.txt': { ROBOTS: { status: 301, headers: { location: `${V}/robots.txt` } } },
  [`${V}/alt`]: { HEAD: { status: 301, headers: { location: '/neu' } } },
  [`${V}/neu`]: { HEAD: { status: 405 }, GET: { status: 200 } },
  [`${V}/alt.html`]: { HEAD: { status: 404 }, GET: { status: 404 } },
  'http://www.beispiel-verband.de/': { HEAD: { status: 301, headers: { location: `${V}/` } } },
  [`${V}/`]: { HEAD: { status: 200, headers: { 'tdm-reservation': '1' } } },
  [`${V}/umzug`]: { HEAD: { status: 301, headers: { location: 'https://neue-domain.de/umzug' } } },
  'https://neue-domain.de/robots.txt': { ROBOTS: { status: 404 } },
  'https://neue-domain.de/umzug': { HEAD: { status: 200 } },
  [`${V}/tief/unterseite`]: { HEAD: { status: 301, headers: { location: `${V}/` } } },
  'https://tot.beispiel-domain.de/robots.txt': { ROBOTS: { fehler: 'ENOTFOUND' } },
  'https://www.youtube.com/robots.txt': { ROBOTS: { status: 200, text: 'User-agent: *\nDisallow: /comment\n' } },
  'https://www.youtube.com/results?search_query=beton+pruefung': { HEAD: { status: 200 } },
  'https://shop.beispiel-verband.de/robots.txt': { ROBOTS: { status: 200, text: '' } },
  'https://shop.beispiel-verband.de/norm/123': { HEAD: { status: 403, headers: { server: 'cloudflare', 'cf-mitigated': 'challenge' } }, GET: { status: 403, headers: { server: 'cloudflare', 'cf-mitigated': 'challenge' } } },
};
const abgerufen: { url: string; methode: string; zeit: number }[] = [];
const holen = async (url: string, methode: string) => {
  abgerufen.push({ url, methode, zeit: Date.now() });
  const r = netz[url]?.[methode];
  if (!r) return { status: 404, headers: {} };
  if ('fehler' in r) throw Object.assign(new Error('fetch failed'), { cause: { code: r.fehler } });
  return { headers: {}, ...r };
};
const apiAufrufe: string[] = [];
const holenJson = async (url: string) => { apiAufrufe.push(url); return { status: 200, json: wjson, retryAfter: null }; };

(async () => {
  const pruefer = new LinkPruefer({ holen, holenJson, verzoegerungMs: 40, parallel: 4 });
  const cache = new Map();
  const e = await fuehreLinkCheckAus({ dateien, pruefer, datum: '2026-11-01', cache, jetzt: 1_000 });
  const nach = Object.fromEntries(e.ergebnisse.map((x: Ergebnis) => [x.url, x]));
  const kl = (u: string) => nach[u] && `${nach[u].klasse}${nach[u].sicher ? '+sicher' : ''}`;
  gleich({
    alt: kl(`${V}/alt`), html: kl(`${V}/alt.html`), http: kl('http://www.beispiel-verband.de/'), tot: kl('https://tot.beispiel-domain.de/seite'),
    robots: kl(`${V}/geschuetzt`), yt: kl('https://www.youtube.com/results?search_query=beton+pruefung'), shop: kl('https://shop.beispiel-verband.de/norm/123'),
    umzug: kl(`${V}/umzug`), tief: kl(`${V}/tief/unterseite`),
  }, {
    alt: 'weiterleitung+sicher', html: 'kaputt', http: 'weiterleitung+sicher', tot: 'kaputt', robots: 'gesperrt', yt: 'ok', shop: 'gesperrt', umzug: 'weiterleitung', tief: 'weiterleitung',
  }, 'Gesamtlauf: Klassen');
  gleich(nach[`${V}/alt`].vorschlag, `${V}/neu`, 'Gesamtlauf: relative Location aufgelöst');
  gleich(nach['https://tot.beispiel-domain.de/seite'].grund, 'DNS: Host nicht gefunden', 'Gesamtlauf: DNS');
  gleich(nach[`${V}/geschuetzt`].grund, 'durch robots.txt ausgeschlossen', 'Gesamtlauf: robots.txt befolgt');
  pruefe(!abgerufen.some(a => a.url === `${V}/geschuetzt`), 'robots.txt: gesperrte Seite trotzdem abgerufen');
  pruefe(!abgerufen.some(a => a.url.startsWith('https://tot.') && a.methode !== 'ROBOTS'), 'DNS-Fehler: trotzdem Seiten abgerufen');
  gleich([abgerufen.filter(a => a.url === `${V}/robots.txt`).length, abgerufen.filter(a => a.url === 'http://www.beispiel-verband.de/robots.txt').length], [2, 1], 'robots.txt je Origin einmal (https zusätzlich als Ziel der http-Weiterleitung)');
  gleich(abgerufen.filter(a => a.url === `${V}/neu`).map(a => a.methode), ['HEAD', 'GET'], 'HEAD, bei 405 GET');
  gleich(abgerufen.filter(a => a.url === 'https://www.youtube.com/results?search_query=beton+pruefung').map(a => a.methode), ['HEAD'], 'kein GET nach erfolgreichem HEAD');
  pruefe(!abgerufen.some(a => a.url.includes('wikipedia.org')), 'Wikipedia-Artikel einzeln abgerufen statt über die API');

  // Rate-Limit je Host
  const proHost = new Map<string, number[]>();
  for (const a of abgerufen) {
    const h = new URL(a.url).host;
    if (!proHost.has(h)) proHost.set(h, []);
    proHost.get(h)!.push(a.zeit);
  }
  for (const [h, zeiten] of proHost) for (let i = 1; i < zeiten.length; i++) pruefe(zeiten[i] - zeiten[i - 1] >= 35, `Rate-Limit verletzt bei ${h}: ${zeiten[i] - zeiten[i - 1]} ms`);

  // Wikipedia über die API
  gleich(apiAufrufe.length, 1, 'Wikipedia: eine API-Anfrage für alle Titel');
  const api = new URL(apiAufrufe[0]);
  gleich([api.host, api.searchParams.get('maxlag'), api.searchParams.get('formatversion'), api.searchParams.get('titles')?.split('|').length], ['de.wikipedia.org', '5', '2', 5], 'Wikipedia: API-Parameter');
  const W = 'https://de.wikipedia.org/wiki/';
  gleich({ b: kl(`${W}Beton`), k: kl(`${W}Karbonatisierung_(Beton)`), g: kl(`${W}Gibtsnicht_Artikel_XYZ`), z: kl(`${W}Zement#Geschichte`), p: kl(`${W}Putz_(Baustoff)`) },
    { b: 'ok', k: 'weiterleitung+sicher', g: 'kaputt', z: 'ok', p: 'weiterleitung' }, 'Wikipedia: Klassen');
  gleich([nach[`${W}Karbonatisierung_(Beton)`].vorschlag, nach[`${W}Putz_(Baustoff)`].vorschlag], [`${W}Carbonatisierung_(Beton)`, `${W}Putz#Baustoff`], 'Wikipedia: Vorschläge');
  pruefe(nach[`${W}Zement#Geschichte`].hinweise.some(h => /Begriffsklärung/.test(h)), 'Wikipedia: Begriffsklärung als Hinweis');

  // Zusammenfassung
  const z = e.zusammenfassung;
  gleich({ urls: z.urls, ok: z.ok, w: z.weiterleitung, sicher: z.sicherErsetzbar, kaputt: z.kaputt, gesperrt: z.gesperrt, dateien: z.dateien }, { urls: 14, ok: 3, w: 6, sicher: 3, kaputt: 3, gesperrt: 2, dateien: 2 }, 'Zusammenfassung');
  gleich(e.abrufe.tdmVorbehalt, ['www.beispiel-verband.de'], 'TDM-Vorbehalt protokolliert');
  pruefe(z.netzErreicht === true, 'Netz erreicht');
  pruefe(e.agent === USER_AGENT && /babo-link-check\/1\.0 \(\+https:\/\/github\.com\/juhu-tha\/babo/.test(USER_AGENT), 'User-Agent nennt das Repo');

  // Bericht
  const md = berichtMarkdown(e);
  pruefe(md.startsWith('# Linkprüfung 2026-11'), 'Bericht: Überschrift');
  pruefe(md.includes('| https://www.beispiel-verband.de/alt.html | HTTP 404 | `modules/Modul.tsx:15` |'), 'Bericht: kaputter Link mit Datei:Zeile');
  pruefe(md.includes('| https://www.beispiel-verband.de/alt | https://www.beispiel-verband.de/neu | ja | `modules/Modul.tsx:14`, `content/beton/inhalt.md:3` |'), 'Bericht: Weiterleitung mit Vorschlag');
  pruefe(md.includes('| https://www.beispiel-verband.de/umzug | https://neue-domain.de/umzug | nein |'), 'Bericht: fremde Domain nicht sicher');
  pruefe(md.includes('- [ ] https://shop.beispiel-verband.de/norm/123 – HTTP 403 (Bot-Schutz)'), 'Bericht: Bot-Schutz manuell');
  pruefe(md.includes('YouTube-Suchergebnis'), 'Bericht: Hinweis YouTube');
  pruefe(/\| \*\*nicht erreichbar\*\* \| \*\*3\*\* \|/.test(md), 'Bericht: Zusammenfassung');
  const js = JSON.parse(berichtJson(e));
  gleich([js.ergebnisse.length, js.zusammenfassung.kaputt, js.ergebnisse.find((x: Ergebnis) => x.url === `${V}/alt`).fundstellen.length], [14, 3, 2], 'JSON-Bericht lesbar');
  pruefe(!('kette' in js.ergebnisse.find((x: Ergebnis) => x.url === `${W}Beton`)), 'JSON-Bericht: unauffällige Links kompakt');
  const kurz = berichtMarkdown(e, { maxZeichen: 1500 });
  pruefe(kurz.length <= 1500 && kurz.includes('gekürzt'), `Bericht: Kürzung für Issue (${kurz.length})`);
  gleich(fundstellenText([1, 2, 3, 4, 5, 6].map(i => ({ datei: `src/a${i}.tsx`, zeile: i })), 2), '`a1.tsx:1`, `a2.tsx:2` … (+4)', 'Fundstellen gekürzt');

  // Ersetzen: nur sichere Weiterleitungen, exakte Fundstellen
  const ers = sichereErsetzungen(e);
  gleich([...ers.keys()].sort(), ['http://www.beispiel-verband.de/', `${W}Karbonatisierung_(Beton)`, `${V}/alt`], 'Ersetzungen: nur sichere');
  const neu = ersetzeUrls(dateien, ers);
  const neuModul = neu.find((d: { pfad: string }) => d.pfad === 'src/modules/Modul.tsx');
  pruefe(neuModul.text.includes(`href="${V}/neu"`) && neuModul.text.includes(`href="${V}/alt.html"`), 'Ersetzen: /alt ersetzt, /alt.html unverändert');
  pruefe(neuModul.text.includes(`url: '${W}Carbonatisierung_(Beton)'`) && neuModul.text.includes(`href="${V}/"`), 'Ersetzen: Wikipedia und http→https');
  gleich(neuModul.anzahl, 3, 'Ersetzen: Anzahl im Modul');
  const neuMd = neu.find((d: { pfad: string }) => d.pfad === 'content/beton/inhalt.md');
  pruefe(neuMd.text.includes(`[DIN Media](${V}/neu), siehe`), 'Ersetzen: Markdown-Link');
  gleich(neuModul.text.split('\n').length, modul.split('\n').length, 'Ersetzen: Zeilen erhalten');
  gleich(ersetzeUrls(neu.map((d: { pfad: string; text: string }) => ({ pfad: d.pfad, text: d.text })), ers), [], 'Ersetzen: idempotent');
  pruefe(prBody(e, 'docs/linkcheck/2026-11.md', { urls: 3, stellen: 4, dateien: 2 }).includes('**3 URLs** an 4 Stellen in 2 Dateien'), 'PR-Text');

  // Cache: zweiter Lauf ohne erneute Abrufe stabiler Befunde
  const vorher = abgerufen.length;
  const e2 = await fuehreLinkCheckAus({ dateien, pruefer: new LinkPruefer({ holen, holenJson, verzoegerungMs: 40 }), datum: '2026-11-02', cache, jetzt: 2_000 });
  const neuAbgerufen = abgerufen.slice(vorher).filter(a => a.methode !== 'ROBOTS').map(a => a.url);
  gleich(neuAbgerufen, ['https://shop.beispiel-verband.de/norm/123', 'https://shop.beispiel-verband.de/norm/123'], 'Cache: nur gesperrte/Netzfehler erneut (HEAD + GET)');
  gleich(e2.zusammenfassung.ausCache, 11, 'Cache: Treffer');
  gleich(apiAufrufe.length, 1, 'Cache: keine weitere API-Anfrage');

  // Einzelfälle: HEAD auf Fehlerseite umgeleitet (GET klappt), Zeitüberschreitung, Sonderfall DIN-Media-Suche
  const B = 'https://bam.beispiel.de';
  const einzel: string[] = [];
  const holen2 = async (url: string, methode: string) => {
    einzel.push(`${methode} ${url}`);
    if (url.endsWith('/robots.txt')) return { status: 404, headers: {} };
    if (url === `${B}/`) return methode === 'HEAD' ? { status: 303, headers: { location: '/error_path/400.html' } } : { status: 200, headers: {} };
    if (url === `${B}/error_path/400.html`) return { status: 400, headers: {} };
    if (url === 'https://langsam.beispiel.de/x') throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
    return { status: 404, headers: {} };
  };
  const p2 = new LinkPruefer({ holen: holen2, holenJson, verzoegerungMs: 1 });
  const bam = await p2.pruefe(`${B}/`);
  gleich({ k: bam.klasse, s: bam.status }, { k: 'ok', s: 200 }, 'HEAD-Umleitung auf Fehlerseite → Kette mit GET wiederholt');
  gleich((await p2.pruefe('https://langsam.beispiel.de/x')).grund, 'Netz: Zeitüberschreitung', 'Zeitüberschreitung erkannt (nicht „23“)');
  const din = await p2.pruefe('https://www.dinmedia.de/de/suche?q=DIN+1045-2');
  gleich(din.klasse, 'ok', 'DIN-Media-Suche: Sonderfall');
  pruefe(!einzel.some(x => x.includes('dinmedia')), 'DIN-Media-Suche: nicht abgerufen');

  // Ohne Netz: Exit-Signal
  const tot = async () => { throw Object.assign(new Error('fetch failed'), { cause: { code: 'ECONNREFUSED' } }); };
  const e3 = await fuehreLinkCheckAus({ dateien, pruefer: new LinkPruefer({ holen: tot, holenJson: tot, verzoegerungMs: 1 }), datum: '2026-11-03' });
  pruefe(e3.zusammenfassung.netzErreicht === false, 'ohne Netz: netzErreicht false');

  if (fehler.length) {
    for (const f of fehler) console.error(`FAIL: ${f}`);
    process.exit(1);
  }
  console.log('OK: Linkprüfung – Extraktion, robots.txt, Klassifikation, Wikipedia-API, Bericht, Ersetzen, Cache');
})();
