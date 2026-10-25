// Kopfdaten je Fachmodul nachladen (Phase 5, AP 5.5) – siehe scripts/modulKopf.ts.
// Ein Promise je Modul wird zwischengespeichert; geladene Daten stehen danach synchron bereit.
import { ladeKopf } from 'virtual:modul-kopf';
import type { ModulKopfDaten } from 'virtual:modul-kopf';

const LEER: ModulKopfDaten = {};
const geladen = new Map<string, ModulKopfDaten>();
const laufend = new Map<string, Promise<ModulKopfDaten>>();
const hatKopf = (id: string) => Object.prototype.hasOwnProperty.call(ladeKopf, id);

/** Daten, falls schon geladen (bzw. Modul ohne Kopfdaten), sonst undefined */
export function kopfDatenSofort(id: string): ModulKopfDaten | undefined {
  return hatKopf(id) ? geladen.get(id) : LEER;
}

/** Kopfdaten eines Moduls laden (ein Netzabruf je Modul); Fehler → keine Kopfdaten */
export function ladeKopfDaten(id: string): Promise<ModulKopfDaten> {
  if (!hatKopf(id)) return Promise.resolve(LEER);
  let p = laufend.get(id);
  if (!p) {
    p = ladeKopf[id]().then(m => m.default, () => LEER).then(d => { geladen.set(id, d); return d; });
    laufend.set(id, p);
  }
  return p;
}
