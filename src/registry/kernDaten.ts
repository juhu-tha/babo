/**
 * Schlanker Auszug der Modul-Registry für den Einstiegs-Chunk (Umsetzungsplan Phase 5, AP 5.5 Nachtrag).
 *
 * Quelle bleibt ausschließlich ./modules.ts. Diese Datei leitet daraus nur die Felder ab, die Menü,
 * Kopfzeile und Routing beim ersten Rendern brauchen (id, label, icon, gruppe, Titel/Typ aus `baum`).
 * Im Build ersetzt das Vite-Plugin scripts/registryKern.ts diese Datei durch die fertig ausgewerteten
 * Daten (JSON), sodass modules.ts mit Meta-Beschreibungen, Suchbegriffen und Baum-Kurztexten (~30 kB gzip)
 * nicht mehr im Einstieg liegt (Beschreibungen und Suchbegriffe als eigene Auszüge, s. ./kern.ts).
 * tests/registryKern.test.ts prüft die Gleichheit beider Wege.
 */
import { AKTIVE_MODULE, AKTIVE_ALIASE, NAV_GRUPPEN, INAKTIVE_GRUPPEN } from './modules';

/** [id, label, icon, gruppe, baum.titel, baum.typ] – leere Felder als null */
export type KernZeile = [string, string, string, string | null, string | null, string | null];

// nur aktive Seiten (INAKTIVE_GRUPPEN in ./modules.ts): inaktive gelten in der App als unbekannt → Startseite
export const KERN_ZEILEN: readonly KernZeile[] = AKTIVE_MODULE.map(m => [m.id, m.label, m.icon, m.gruppe ?? null, m.baum?.titel ?? null, m.baum?.typ ?? null]);
export const KERN_ALIASE: Readonly<Record<string, string>> = AKTIVE_ALIASE;
export const KERN_GRUPPEN: readonly string[] = NAV_GRUPPEN.filter(g => !INAKTIVE_GRUPPEN.includes(g));
