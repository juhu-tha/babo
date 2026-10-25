/** Virtuelles Modul des Vite-Plugins scripts/modulKopf.ts (Kopfdaten je Fachmodul, AP 5.5) */
declare module 'virtual:modul-kopf' {
  export interface ModulKopfDaten {
    lernziele?: import('../data/lernziele').ModulLernziele;
    kurzfassung?: readonly string[];
    erkundung?: import('../data/erkundung').Erkundung;
    grenzen?: import('../data/rechnerGrenzen').RechnerGrenzen;
  }
  /** Kopfdaten eines Moduls nachladen (nur Module mit mindestens einem Eintrag) */
  export const ladeKopf: Readonly<Record<string, () => Promise<{ default: ModulKopfDaten }>>>;
}
