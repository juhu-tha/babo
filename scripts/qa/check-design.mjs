#!/usr/bin/env node
/**
 * Designgrundsatz „keine schwarzen Boxen“ (28.10.2026): Im Hellmodus keine schwarzen/sehr dunklen
 * Hintergründe für Inhaltsboxen, Kopfboxen, Mess-/Ergebnisanzeigen, Code-/Prompt-Blöcke, Schaltflächen
 * und Badges. Erkannt werden Tailwind-Klassen ohne `dark:`-Variante (andere Varianten wie hover: zählen mit):
 *   bg-(slate|gray|zinc|neutral|stone)-(800|850|900|950), bg-black, bg-text-main – ebenso blue/emerald/green/teal/
 *   cyan/sky/indigo/violet/purple/amber/yellow/orange-800…950, weil @theme in src/index.css diese Familien auf Slate abbildet –,
 *   from-/via-/to-…-(800|850|900|950) bzw. -black, bg-[#…] mit relativer Leuchtdichte < 0,04
 *   sowie Inline-Stile `style={{ background(Color): '#…' }}` in derselben Zeile.
 * Transparente Tönungen unter 50 % Deckkraft (bg-black/10, bg-slate-800/10 …) gelten nicht als dunkel.
 * Bewusste Ausnahmen (Overlays/Backdrops, Tooltips, bewusst dunkle Ansichten, Diagramm-Interna,
 * Material- und Gerätedarstellungen) stehen mit Begründung in AUSNAHMEN (Datei|Klasse → Anzahl).
 *   node scripts/qa/check-design.mjs [--liste]   → Exit 1 bei neuen dunklen Hintergründen.
 * tests/designDunkleBoxen.test.ts prüft dieselbe Logik (Grenze 0). Grundsatz: docs/architektur.md, Abschnitt Design.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Zulässige Zahl neuer dunkler Hintergründe außerhalb der Ausnahmeliste (Ratsche, nur nach unten). */
export const GRENZE = 0;

const D = 'Overlay/Backdrop hinter Dialog oder Menü';
const T = 'Tooltip/Hover-Hinweis (kurzzeitig eingeblendet)';
const I = 'Diagramm-Interna (Marker, Zeiger, Balkenfüllung, Legendenpunkt)';
const W = 'Material-/Gerätedarstellung (Stahlplatten, Bitumen, Düse, Messgerät, Schichtfarbe)';

/** Begründete Ausnahmen: 'datei|klasse' → [anzahl, grund]. Klasse inkl. Variantenpräfix (z. B. hover:). */
export const AUSNAHMEN = {
  // (d) Overlays/Backdrops
  'src/App.tsx|bg-black/60': [1, D],
  'src/components/klausur/KlausurSimulator.tsx|bg-black/50': [1, D],
  'src/components/polls/LecturePollSession.tsx|bg-slate-900/60': [1, D],
  'src/components/polls/LecturePollSession.tsx|bg-slate-950/70': [1, D],
  'src/components/seo/MetadataAuditModal.tsx|bg-black/70': [1, D],
  'src/components/ui/ModuleFooter.tsx|bg-black/50': [1, D],
  'src/modules/Materialoptimierung.tsx|bg-slate-950/70': [1, D],
  'src/modules/Materialpaesse.tsx|bg-slate-900/65': [1, D],
  // (d) Tooltips
  'src/components/ui/InfoTooltip.tsx|bg-text-main': [1, T],
  'src/components/ui/Slider.tsx|bg-text-main': [1, T],
  'src/modules/mischungsberechnung/MischungEingaben.tsx|bg-gray-900': [1, T],
  'src/modules/stahlbetoninstandhaltung/hilfen.tsx|bg-text-main': [2, T],
  'src/modules/bpverkehrswegebau/RstoRechnerTab.tsx|bg-black/95': [1, T],
  'src/modules/Analytik.tsx|bg-slate-800': [1, T],
  // (d) Bewusst dunkle Ansichten (REM-Sichtfeld, Nachtvorschau, Schemadarstellung); SVG-Bühnen sind seit 28.10.2026 hell (.svg-buehne in src/index.css)
  'src/modules/Zementchemie.tsx|bg-slate-900': [1, 'REM-Ansicht (Rasterelektronenmikroskop, dunkles Sichtfeld)'],
  'src/modules/MaterialitaetArchitektur.tsx|bg-slate-900': [1, 'Lichtsimulation „Nacht“ (bewusst dunkle Vorschau)'],
  'src/modules/MaterialitaetArchitektur.tsx|bg-slate-950': [1, 'Lichtsimulation „Nacht“ (bewusst dunkle Vorschau)'],
  'src/modules/MaterialitaetArchitektur.tsx|bg-slate-900/90': [1, 'Lichtsimulation „Nacht“ (bewusst dunkle Vorschau)'],
  'src/modules/Bauwerksunters_Monitoring.tsx|bg-[#1e293b]': [1, 'Holzquerschnitt im Bohrwiderstands-Monitor (Schemadarstellung)'],
  'src/modules/Bauwerksunters_Monitoring.tsx|bg-black/90': [1, 'Hohlraum im Holzquerschnitt (Schemadarstellung)'],
  // (d) Diagramm-Interna
  'src/components/korrosion/DeckschichtenVergleich.tsx|bg-black': [1, I],
  'src/components/quiz/InteractiveQuizSystem.tsx|bg-slate-800': [1, I],
  'src/modules/Asphalt.tsx|bg-text-main': [1, I],
  'src/modules/KeramikZiegel.tsx|bg-text-main': [1, I],
  'src/modules/Ressourceneffizienz.tsx|bg-slate-950': [2, I],
  'src/modules/Statistik.tsx|bg-neutral-800': [2, I],
  'src/modules/Statistik.tsx|bg-neutral-900': [1, I],
  'src/modules/WUBauwerke.tsx|bg-slate-800': [1, 'Legendenpunkt „Schwarze Wanne“'],
  'src/modules/Zustandsbewertung.tsx|bg-text-main': [1, I],
  'src/modules/dauerhaftigkeit/BetonDauerhaftigkeitsSimulator.tsx|bg-slate-800': [1, I],
  // (d) Material- und Gerätedarstellungen
  'src/modules/Metallkorrosion.tsx|from-stone-800': [2, W],
  'src/modules/Spritzbeton.tsx|bg-slate-800': [1, 'Spritzdüse (Gerätedarstellung)'],
  'src/modules/abfaelle/Deponie.tsx|bg-slate-800': [1, 'Kunststoffdichtungsbahn im Deponieaufbau (Materialfarbe)'],
  'src/modules/holzbaubeta/HolzbauBauphysik.tsx|bg-stone-900/90': [1, W],
  'src/modules/zfp/ElektromagnetischTab.tsx|bg-gray-800': [1, 'Messsonde (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-gray-900': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-gray-800': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-950': [2, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-900': [2, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-800': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-black': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|from-slate-950': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|to-black': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-950/90': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-950/85': [2, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|bg-slate-850': [2, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/DppEpd.tsx|hover:bg-slate-800': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  'src/modules/Bauwerksunters_Monitoring.tsx|bg-yellow-900/60': [1, 'Fäulniszone im Holzquerschnitt (Schemadarstellung)'],
  'src/modules/Bauwerksunters_Monitoring.tsx|bg-amber-950/70': [1, 'Larvenfraß im Holzquerschnitt (Schemadarstellung)'],
  'src/modules/Bodenmechanik.tsx|bg-amber-800': [1, 'Zustandsfarbe „fest“ der Konsistenzskala (Diagramm-Interna)'],
  'src/modules/KeramikZiegel.tsx|bg-emerald-800': [1, 'Farbskala der Ziegelgruppen (Legende)'],
  'src/modules/MaterialitaetArchitektur.tsx|bg-amber-800': [1, 'Materialmuster (Farbmuster Klinker)'],
  'src/modules/MaterialitaetArchitektur.tsx|bg-amber-900': [1, 'Materialmuster (Farbmuster)'],
  'src/modules/Metallkorrosion.tsx|to-amber-900': [1, W],
  'src/modules/Metallkorrosion.tsx|bg-amber-800/95': [1, 'Beschriftung in der Rostschicht-Grafik (Diagramm-Interna)'],
  'src/modules/Metallkorrosion.tsx|bg-amber-900/90': [1, 'Beschriftung in der Rostschicht-Grafik (Diagramm-Interna)'],
  'src/modules/WUBauwerke.tsx|bg-amber-800': [1, 'Legendenpunkt (Bauweise)'],
  'src/modules/Zementchemie.tsx|bg-sky-900': [1, 'Legendenfeld „Porenlösung“ der REM-Ansicht'],
  'src/modules/DppEpd.tsx|bg-amber-950/95': [1, 'Smartphone-Attrappe mit Kameraansicht (Gerätedarstellung)'],
  // Dokumentation des Grundsatzes selbst (Klassennamen als Text, kein Hintergrund)
  'src/modules/Admin.tsx|bg-slate-900': [1, 'Klassenname im Redaktionshinweis (Text)'],
  'src/modules/Admin.tsx|bg-black': [1, 'Klassenname im Redaktionshinweis (Text)'],
};

// Grautöne sowie die Farbfamilien, die src/index.css (@theme) auf die Slate-Graustufen abbildet
const GRAU = '(?:slate|gray|zinc|neutral|stone|blue|emerald|green|teal|cyan|sky|indigo|violet|purple|amber|yellow|orange)';
const STUFE = '(?:800|850|900|950)';
const RE = new RegExp(String.raw`(?<![\w:\-/\[])((?:[a-z0-9\-\[\]&>=*]+:)*)(bg-${GRAU}-${STUFE}(?:\/\d+)?|bg-black(?:\/\d+)?|bg-text-main(?:\/\d+)?|(?:from|via|to)-${GRAU}-${STUFE}(?:\/\d+)?|(?:from|via|to)-black(?:\/\d+)?|bg-\[#[0-9a-fA-F]{3,6}\])(?![\w\-/\]])`, 'g');

function leuchtdichte(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map(c => c + c).join('');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const deckend = (klasse) => { const m = klasse.match(/\/(\d+)$/); return !m || Number(m[1]) >= 50; };

function* dateien(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') yield* dateien(p); }
    else if (/\.(tsx?|jsx?)$/.test(e.name)) yield p;
  }
}

/** Findet dunkle Hintergründe ohne dark:-Variante in einem Quelltext. Rückgabe: [{zeile, klasse}] */
export function findeDunkle(text) {
  const treffer = [];
  text.split('\n').forEach((l, i) => {
    for (const m of l.matchAll(RE)) {
      const varianten = m[1] ? m[1].slice(0, -1).split(':') : [];
      if (varianten.includes('dark')) continue;
      const k = m[2];
      if (!deckend(k)) continue;
      if (k.startsWith('bg-[#') && leuchtdichte(k.slice(4, -1)) >= 0.04) continue;
      treffer.push({ zeile: i + 1, klasse: m[1] + k });
    }
    if (/\bstyle=/.test(l)) {
      for (const m of l.matchAll(/background(?:Color)?\s*:\s*['"`](#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|black)\b/g)) {
        if (m[1] === 'black' || leuchtdichte(m[1]) < 0.04) treffer.push({ zeile: i + 1, klasse: `style:${m[1]}` });
      }
    }
  });
  return treffer;
}

/** Prüft src/ gegen die Ausnahmeliste. Rückgabe: { alle, neu: [{datei, zeile, klasse}], veraltet: [schluessel] } */
export function pruefeDesign(srcDir = path.join(REPO, 'src')) {
  const alle = [];
  for (const f of dateien(srcDir)) {
    const rel = path.relative(REPO, f).split(path.sep).join('/');
    for (const t of findeDunkle(fs.readFileSync(f, 'utf8'))) alle.push({ datei: rel, ...t });
  }
  const proSchluessel = new Map();
  for (const t of alle) {
    const s = `${t.datei}|${t.klasse}`;
    if (!proSchluessel.has(s)) proSchluessel.set(s, []);
    proSchluessel.get(s).push(t);
  }
  const neu = [];
  for (const [s, liste] of proSchluessel) {
    const erlaubt = AUSNAHMEN[s]?.[0] ?? 0;
    if (liste.length > erlaubt) neu.push(...liste.slice(erlaubt));
  }
  const veraltet = Object.entries(AUSNAHMEN).filter(([s, [n]]) => (proSchluessel.get(s)?.length ?? 0) < n).map(([s]) => s);
  return { alle, neu, veraltet };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { alle, neu, veraltet } = pruefeDesign();
  console.log(`dunkle Hintergründe ohne dark: in src/: ${alle.length} (davon begründete Ausnahmen: ${alle.length - neu.length}, neu: ${neu.length}, Grenze ${GRENZE})`);
  if (process.argv.includes('--liste')) for (const t of alle) console.log(`  ${t.datei}:${t.zeile}  ${t.klasse}`);
  for (const s of veraltet) console.log(`Hinweis: Ausnahme ${s} wird nicht mehr voll genutzt – Anzahl senken.`);
  if (neu.length > GRENZE) {
    for (const t of neu) console.error(`  NEU  ${t.datei}:${t.zeile}  ${t.klasse}`);
    console.error('FEHLER: neue schwarze/sehr dunkle Hintergründe im Hellmodus – helle Gestaltung verwenden (docs/architektur.md, Abschnitt Design) oder Ausnahme begründen.');
    process.exit(1);
  }
}
