/** Erkundungsaufträge „Ausprobieren“ je Rechner-Modul (Umsetzungsplan Phase 3, AP 3.7) – Inhalte folgen */
export interface ErkundungsAuftragDaten { frage: string; hinweis?: string; aufloesung: string }
export interface Erkundung { auftraege: ErkundungsAuftragDaten[] }

export const ERKUNDUNG: Record<string, Erkundung> = {};
