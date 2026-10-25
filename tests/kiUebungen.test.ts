// Hands-on-Übungen KI-Master (Umsetzungsplan Phase 6, AP 6.5) – Aufbau, Verweise, Datenschutzhinweise
import fs from 'fs';
import { MODUL_BY_ID, BAUM_GRUPPEN } from '../src/registry/modules';
import { KI_UEBUNGEN, KI_UEBUNG_REGELN } from '../src/data/kiUebungen';
import { LERNZIELE } from '../src/data/lernziele';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: KI-Übungen ---');

const BLOECKE = ['LLM-Grundlagen', 'Prompting im Ingenieurbüro', 'Agenten', 'RAG mit Normtexten', '„sich programmieren lassen“', 'Fehlerbilder und Verifikation'];
pruefe(KI_UEBUNGEN.length === BLOECKE.length, `${KI_UEBUNGEN.length} statt ${BLOECKE.length} Übungen`);
BLOECKE.forEach((b, i) => pruefe(KI_UEBUNGEN[i]?.block.endsWith(b), `Übung ${i + 1}: Block „${b}“ erwartet, „${KI_UEBUNGEN[i]?.block}“ gefunden`));
pruefe(new Set(KI_UEBUNGEN.map(u => u.id)).size === KI_UEBUNGEN.length, 'Übungs-IDs nicht eindeutig');

for (const u of KI_UEBUNGEN) {
  pruefe(u.ziel.length >= 60, `${u.id}: Ziel zu kurz`);
  pruefe(u.minuten >= 30 && u.minuten <= 120, `${u.id}: Zeitbedarf ${u.minuten} min unplausibel`);
  pruefe(u.material.length >= 2, `${u.id}: Material fehlt`);
  pruefe(u.material.some(m => m.includes('Copilot')), `${u.id}: Copilot nicht als Werkzeug genannt`);
  pruefe(u.schritte.length >= 4, `${u.id}: weniger als 4 Schritte`);
  pruefe(u.prompts.length >= 1 && u.prompts.every(p => p.titel && p.text.length >= 20), `${u.id}: Prompt-Vorlage fehlt`);
  pruefe(u.erwartung.length >= 3, `${u.id}: Erwartungshorizont zu knapp`);
  pruefe(u.reflexion.length >= 2, `${u.id}: Reflexionsfragen fehlen`);
  pruefe(u.checkliste.length >= 3, `${u.id}: Verifikations-Checkliste zu knapp`);
  pruefe(u.theorie.length >= 1, `${u.id}: kein Theorieverweis`);
  for (const t of u.theorie) pruefe(MODUL_BY_ID.has(t.ziel), `${u.id}: Theorieverweis ${t.ziel} existiert nicht`);
  const alles = [u.ziel, ...u.material, ...u.schritte, ...u.prompts.map(p => p.text)].join('\n');
  // Hochschul-Copilot statt Gemini, keine API-Schlüssel, keine Programmierung
  pruefe(!/gemini|api[- ]?key|api-schlüssel|python|vba-code/i.test(alles), `${u.id}: Gemini-, API- oder Programmierbezug in der Übung`);
  pruefe(!alles.includes('\\'), `${u.id}: Backslash in Übungstext`);
}

const regeln = KI_UEBUNG_REGELN.join(' ');
pruefe(/personenbezogen/i.test(regeln), 'Regeln: Hinweis auf personenbezogene Daten fehlt');
pruefe(/Normvolltext/i.test(regeln) && /lizen/i.test(regeln), 'Regeln: Hinweis auf Normlizenzen fehlt');
pruefe(/vertraulich/i.test(regeln), 'Regeln: Hinweis auf vertrauliche Unterlagen fehlt');
pruefe(/Copilot/.test(regeln), 'Regeln: Werkzeug Copilot fehlt');

// Einbindung: Registry, Baum, Lernziele, Verweis aus dem KI-Modul
pruefe(MODUL_BY_ID.get('ki_uebungen')?.gruppe === 'KI im Bauwesen', 'ki_uebungen nicht in der Menügruppe KI im Bauwesen');
pruefe(BAUM_GRUPPEN.some(g => g.id === 'grp_ki' && (g.knoten as readonly string[]).includes('ki_uebungen')), 'ki_uebungen fehlt im KI-Baum');
pruefe(!!LERNZIELE.ki_uebungen, 'Lernziele für ki_uebungen fehlen');
pruefe(fs.readFileSync('src/modules/KiBaustoffe.tsx', 'utf8').includes('ziel="ki_uebungen"'), 'KI-Modul verweist nicht auf die Übungen');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${KI_UEBUNGEN.length} Übungen, ${KI_UEBUNGEN.reduce((s, u) => s + u.prompts.length, 0)} Prompt-Vorlagen`);
