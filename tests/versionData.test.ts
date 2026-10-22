import { VERSION_HISTORY, CURRENT_VERSION, CURRENT_VERSION_NUMBER, CURRENT_RELEASE_DATE } from '../src/data/versionData';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

console.log('--- Test: Version Data & Changelog Consistency ---');

// 1. History nicht leer
assert(VERSION_HISTORY.length > 0, 'VERSION_HISTORY darf nicht leer sein');

// 2. Aktuelle Version ist erstes Element
assert(CURRENT_VERSION === VERSION_HISTORY[0], 'CURRENT_VERSION muss das erste Element sein');
assert(CURRENT_VERSION_NUMBER === CURRENT_VERSION.version, 'CURRENT_VERSION_NUMBER muss mit CURRENT_VERSION übereinstimmen');
assert(CURRENT_RELEASE_DATE === CURRENT_VERSION.date, 'CURRENT_RELEASE_DATE muss mit CURRENT_VERSION übereinstimmen');

// 3. Versions- und Datumsformat
const semverRegex = /^v\d+\.\d+\.\d+$/;
const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

assert(semverRegex.test(CURRENT_VERSION.version), `Ungültiges Versionsformat: ${CURRENT_VERSION.version}`);
assert(dateRegex.test(CURRENT_VERSION.date), `Ungültiges Datumsformat: ${CURRENT_VERSION.date}`);

// 4. Struktur aller Einträge prüfen
for (const entry of VERSION_HISTORY) {
  assert(semverRegex.test(entry.version), `Ungültiges Versionsformat in Eintrag ${entry.version}`);
  assert(dateRegex.test(entry.date), `Ungültiges Datumsformat in Eintrag ${entry.version}`);
  assert(entry.title.trim().length > 5, `Titel zu kurz in Eintrag ${entry.version}`);
  assert(['major', 'minor', 'patch'].includes(entry.badge), `Ungültiges Badge in Eintrag ${entry.version}`);
  assert(Array.isArray(entry.changes) && entry.changes.length > 0, `Änderungsliste leer in Eintrag ${entry.version}`);
}

// 5. Abgleich mit package.json
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const expectedPkgVersion = CURRENT_VERSION.version.replace(/^v/, '');
assert(pkg.version === expectedPkgVersion, `package.json Version (${pkg.version}) stimmt nicht mit versionData (${expectedPkgVersion}) überein`);

console.log(`PASS: Version Data konsistent (Stand: ${CURRENT_VERSION.version}, ${CURRENT_VERSION.date}, ${VERSION_HISTORY.length} Revisions-Einträge).`);
