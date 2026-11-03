// Entscheidungen 03.11.2026: (1) Bezeichnung der Professur app-weit „Werkstoffe und Stoffkreisläufe im Bauwesen“;
// (4) Rückmeldeweg im statischen Betrieb per E-Mail-Link (mailto) statt Kurzfragebogen/Live-Abstimmung.
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RUECKMELDUNG_EMAIL, rueckmeldungBetreff, rueckmeldungMailto } from '../src/data/rueckmeldung';
import RueckmeldungPerMail, { RueckmeldungLink } from '../src/components/feedback/RueckmeldungPerMail';
import { SERVER_FUNKTIONEN } from '../src/data/betriebsart';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const lies = (f: string) => fs.readFileSync(f, 'utf8');
console.log('--- Test: Professur-Bezeichnung und Rückmeldung per E-Mail (03.11.2026) ---');

// 1. Keine alte Bezeichnung mehr in App-Quellen, Inhalten, Startseiten-Schale, Metadaten und Suchindex
const ALT = [
  /Baustofftechnologie, Prüfwesen und Kreislaufwirtschaft/i,
  /baustofftechnologie prüfwesen kreislaufwirtschaft/i, // Wortfolge im Suchindex
  /Professur für (?!Werkstoffe und Stoffkreisläufe im Bauwesen)(Baustoffkunde|Bauwerkserhaltung|Nachhaltiges Bauen|Bauschäden|Bautenschutz)/,
  /professur bauwerkserhaltung|professur nachhaltiges bauen|professur bauschäden|professur baustoffkunde|professur bautenschutz/i,
];
function dateien(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? dateien(p) : /\.(tsx?|json|html|webmanifest)$/.test(e.name) ? [p] : [];
  });
}
const quellen = [
  ...dateien('src'), ...dateien('content'), 'index.html', 'scripts/startschale.html',
  'public/manifest.webmanifest', 'public/suchindex.json', 'README.md',
].filter(f => fs.existsSync(f) && !f.endsWith('quiz.json'));
for (const f of quellen) {
  const s = lies(f);
  for (const re of ALT) pruefe(!re.test(s), `${f}: alte Bezeichnung der Professur (${re.source.slice(0, 50)})`);
}
const ft = lies('content/forschungtransfer/ForschungTransfer.json');
pruefe(ft.includes('Professur für **Werkstoffe und Stoffkreisläufe im Bauwesen**'), 'Forschung und Transfer: Professur-Bezeichnung fehlt');
pruefe(lies('src/modules/Impressum.tsx').includes('Professor für Werkstoffe und Stoffkreisläufe im Bauwesen'), 'Impressum: Bezeichnung fehlt');
const vl = JSON.parse(lies('content/vorlesungen/Vorlesungen.json'));
const dozenten = JSON.stringify(vl).match(/"dozent":"[^"]*"/g) ?? [];
pruefe(dozenten.length >= 5 && dozenten.every(d => d === '"dozent":"Professur für Werkstoffe und Stoffkreisläufe im Bauwesen"'), 'Vorlesungen: Feld „Lehrstuhl / Dozentur“ nicht einheitlich');
// Entscheidung 2: Startseiten-Zitat bleibt
pruefe(quellen.some(f => lies(f).includes('Chabos wissen was das BaBo ist')), 'Startseiten-Zitat „Chabos wissen was das BaBo ist“ fehlt');

// 2. mailto: dienstliche Adresse aus Impressum/Kontakt, Betreff URL-kodiert
pruefe(RUECKMELDUNG_EMAIL === 'juergen.huber@tha.de', 'Rückmelde-Adresse ist die Kontakt-Adresse aus dem Impressum');
pruefe(lies('src/modules/Impressum.tsx').includes(`mailto:${RUECKMELDUNG_EMAIL}`), 'Adresse steht im Impressum');
pruefe(rueckmeldungBetreff('Beton  &  Mörtel') === 'BaustoffBoard – Rückmeldung zu Beton & Mörtel', 'Betreff-Wortlaut');
const href = rueckmeldungMailto('Beton & Mörtel?');
pruefe(href === 'mailto:juergen.huber@tha.de?subject=BaustoffBoard%20%E2%80%93%20R%C3%BCckmeldung%20zu%20Beton%20%26%20M%C3%B6rtel%3F', `mailto korrekt kodiert (${href})`);
pruefe(decodeURIComponent(href!.split('subject=')[1]) === 'BaustoffBoard – Rückmeldung zu Beton & Mörtel?', 'Betreff lässt sich verlustfrei dekodieren');
pruefe(rueckmeldungMailto('X', '') === null && rueckmeldungMailto('X', '  ') === null, 'leere Adresse → kein Link');

// Statik-Darstellung (Kern ohne Betriebsart-Prüfung): Linktext nennt Thema und Ziel
const html = renderToStaticMarkup(React.createElement(RueckmeldungLink, { modultitel: 'Betontechnologie' }));
pruefe(html.includes('href="mailto:juergen.huber@tha.de?subject=BaustoffBoard%20%E2%80%93%20R%C3%BCckmeldung%20zu%20Betontechnologie"'), 'Link mit kodiertem Betreff');
pruefe(/Rückmeldung per E-Mail:/.test(html) && /<a [^>]*>Rückmeldung zu „Betontechnologie“ an juergen\.huber@tha\.de senden<\/a>/.test(html), 'Linktext mit Thema und Ziel-Adresse');
pruefe(/<svg[^>]*aria-hidden="true"/.test(html), 'Symbol vor Screenreadern verborgen');

// Verdrahtung an den Stellen, an denen Kurzfragebogen bzw. Live-Abstimmung im Statik-Modus entfallen
const app = lies('src/App.tsx');
pruefe(app.includes('{SERVER_FUNKTIONEN && <React.Suspense fallback={null}><Kurzfragebogen /></React.Suspense>}'), 'App: Kurzfragebogen mit Server unverändert');
pruefe(/\{!SERVER_FUNKTIONEN && activeTab !== 'start' && [\s\S]{0,200}<RueckmeldungPerMail modultitel=\{getTabLabel\(/.test(app), 'App: Rückmeldung per E-Mail im Statik-Modus (Fußzeile, nicht Startseite)');
const vor = lies('src/modules/Vorlesungen.tsx');
pruefe(vor.includes('{SERVER_FUNKTIONEN && <LecturePollSession') && vor.includes('{!SERVER_FUNKTIONEN && <RueckmeldungPerMail modultitel={title}'), 'Vorlesungen: Live-Abstimmung mit Server, sonst Rückmeldung per E-Mail');
pruefe(!/<script/i.test(lies('src/components/feedback/RueckmeldungPerMail.tsx')), 'keine Inline-Skripte');

// 3. Mit Server (tsx ohne BB_STATISCH): Hinweis erscheint nicht – alles wie bisher
pruefe(SERVER_FUNKTIONEN === true, 'Tests laufen im Serverbetrieb');
pruefe(renderToStaticMarkup(React.createElement(RueckmeldungPerMail, { modultitel: 'Betontechnologie' })) === '', 'mit Server kein E-Mail-Hinweis');

if (fehler.length) { fehler.forEach(f => console.log('FAIL: ' + f)); process.exit(1); }
console.log('OK: Professur-Bezeichnung und Rückmeldung per E-Mail');
