// Lizenzhinweis (AP 6.8): vorbereitet, inaktiv bis zur Klärung der Rechteinhaberschaft mit der THA.
import fs from 'node:fs';
import { h, rendere, text, kompakt, sicher, testlauf } from './hilfen/komponenten';
const { LicenseNotice } = await import('../src/components/ui/LicenseNotice');
const { LIZENZ_AKTIV, LIZENZ, NAMENSNENNUNG, IMPRESSUM_URHEBERRECHT_OFFEN } = await import('../src/data/lizenz');

const t = testlauf('Lizenzhinweis');

t.test('Schalter steht auf false (Freigabe der THA fehlt noch)', () => {
  sicher(LIZENZ_AKTIV === false, 'LIZENZ_AKTIV darf erst nach Freigabe true werden – docs/lizenz-ablauf.md');
});
t.test('inaktiv: LicenseNotice rendert nichts', () => {
  sicher(rendere(h(LicenseNotice, {})) === '', 'Ausgabe muss leer sein');
  sicher(rendere(h(LicenseNotice, { aktiv: false })) === '', 'Ausgabe muss leer sein');
});
t.test('aktiv: Namensnennung, CC BY-SA 4.0, MIT und Ausnahmen für Inhalte Dritter', () => {
  const html = rendere(h(LicenseNotice, { aktiv: true }));
  const s = kompakt(text(html));
  sicher(s.includes('Inhalte: BaustoffBoard von Prof. Dr.-Ing. Jürgen Huber (Technische Hochschule Augsburg), lizenziert unter CC BY-SA 4.0'), `Namensnennung fehlt: ${s.slice(0, 160)}`);
  sicher(/Code: MIT\b/.test(s), `Code-Lizenz fehlt: ${s}`);
  sicher(s.includes('Ausgenommen sind Inhalte Dritter') && s.includes('Normen') && s.includes('Open Font License'), 'Ausnahmehinweis fehlt');
  sicher(html.includes('href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"') && html.includes('rel="license'), 'CC-Link/rel=license fehlt');
  sicher(html.includes('href="https://opensource.org/license/mit"'), 'MIT-Link fehlt');
});
t.test('Namensnennung und Impressumstext nennen Werk, Urheber, Lizenz und Link', () => {
  for (const s of [NAMENSNENNUNG, IMPRESSUM_URHEBERRECHT_OFFEN]) sicher(s.includes(LIZENZ.inhalte.kurz), 'Lizenzkürzel fehlt');
  sicher(NAMENSNENNUNG.includes(LIZENZ.werkUrl) && NAMENSNENNUNG.includes('Jürgen Huber'), 'Namensnennung unvollständig');
  sicher(!IMPRESSUM_URHEBERRECHT_OFFEN.includes('schriftlichen Zustimmung'), 'offener Text darf keinen Zustimmungsvorbehalt enthalten');
});
t.test('Lizenzdateien: vor der Freigabe nur Entwurf, danach im Wurzelverzeichnis', () => {
  const ort = LIZENZ_AKTIV ? '.' : 'docs/lizenz-entwurf';
  if (!LIZENZ_AKTIV) for (const f of ['LICENSE', 'LICENSE.md', 'LICENSE-CONTENT.md', 'CITATION.cff', '.zenodo.json']) {
    sicher(!fs.existsSync(f), `${f} darf vor der Freigabe nicht im Wurzelverzeichnis liegen`);
  }
  for (const f of [LIZENZ_AKTIV ? 'LICENSE' : 'LICENSE.md', 'LICENSE-CONTENT.md', 'CITATION.cff', '.zenodo.json']) {
    sicher(fs.existsSync(`${ort}/${f}`), `${ort}/${f} fehlt`);
  }
  const zenodo = JSON.parse(fs.readFileSync(`${ort}/.zenodo.json`, 'utf8')) as { creators: { name: string; affiliation: string }[]; license: string };
  sicher(zenodo.creators[0].name === 'Huber, Jürgen' && zenodo.creators[0].affiliation === 'Technische Hochschule Augsburg', 'Zenodo-Urheber falsch');
});

t.ende();
