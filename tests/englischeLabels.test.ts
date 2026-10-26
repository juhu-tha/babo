// Englische Menütexte: jeder Registry-Eintrag und jede Menügruppe hat eine Übersetzung (src/i18n/translations.ts)
import { MODULE, NAV_GRUPPEN, type ModulEintrag } from '../src/registry/modules';
import { TAB_EN, GROUP_EN } from '../src/i18n/translations';

const fehler: string[] = [];
const pruefe = (ok: boolean, m: string) => { if (!ok) fehler.push(m); };
console.log('--- Test: Englische Menütexte ---');
const alle: readonly ModulEintrag[] = MODULE;
for (const m of alle) pruefe(!!TAB_EN[m.id]?.trim(), `${m.id} („${m.label}“): englische Beschriftung fehlt in TAB_EN`);
for (const g of NAV_GRUPPEN) pruefe(!!GROUP_EN[g]?.trim(), `Menügruppe „${g}“: englischer Name fehlt in GROUP_EN`);
if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log(`OK: ${alle.length} Einträge, ${NAV_GRUPPEN.length} Gruppen mit englischer Beschriftung`);
