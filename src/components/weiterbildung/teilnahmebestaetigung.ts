/**
 * Teilnahmebestätigung als PDF (AP 6.3) – wird vollständig im Browser erzeugt (jsPDF, bereits im Projekt).
 * Der eingegebene Name gelangt nur in das erzeugte PDF; er wird weder gespeichert noch übertragen.
 * Nur per dynamischem import() laden, damit jsPDF nicht im Seiten-Chunk landet.
 */
import { jsPDF } from 'jspdf';
import { BESTAETIGUNG_HINWEIS, type TtzKurs } from '@/src/data/ttzKurse';

export interface BestaetigungDaten {
  kurs: Pick<TtzKurs, 'titel' | 'module' | 'umfang'>;
  name: string;
  datum: Date;
  richtig: number;
  gesamt: number;
  /** Modulbezeichnungen für die Inhaltsliste (Standard: Modul-IDs) */
  modulTitel?: readonly string[];
}

const ERSATZ: Record<string, string> = { '\u202F': '\u00A0', '\u2009': ' ', '–': '-', '—': '-', '„': '"', '“': '"', '”': '"', '‚': "'", '‘': "'", '’': "'", '…': '...', '₂': '2', '≥': '>=', '≤': '<=', '•': '·', 'Ł': 'L', 'ł': 'l', 'Đ': 'D', 'đ': 'd', 'Œ': 'OE', 'œ': 'oe', 'ı': 'i' };

/** Text auf den Latin-1-Zeichensatz der PDF-Standardschriften abbilden (Diakritika notfalls entfernen) */
export function pdfText(s: string): string {
  let aus = '';
  for (const z of s.normalize('NFC')) {
    if (ERSATZ[z]) { aus += ERSATZ[z]; continue; }
    if (z.charCodeAt(0) <= 0xff) { aus += z; continue; }
    const basis = z.normalize('NFD').replace(/[̀-ͯ]/g, '');
    aus += basis.length && [...basis].every(b => b.charCodeAt(0) <= 0xff) ? basis : '?';
  }
  return aus;
}

/** Name bereinigen: Steuerzeichen entfernen, Leerraum zusammenfassen, höchstens 80 Zeichen */
export function bereinigeName(name: string): string {
  return name.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
}

export function datumText(d: Date): string {
  const zz = (n: number) => String(n).padStart(2, '0');
  return `${zz(d.getDate())}.${zz(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** erzeugt die Teilnahmebestätigung; Rückgabe: PDF-Bytes (beginnen mit %PDF) */
export function erzeugeTeilnahmebestaetigung(d: BestaetigungDaten): Uint8Array<ArrayBuffer> {
  const name = bereinigeName(d.name);
  if (!name) throw new Error('Name fehlt');
  const prozent = d.gesamt > 0 ? Math.round((d.richtig / d.gesamt) * 100) : 0;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: pdfText(`Teilnahmebestätigung – ${d.kurs.titel}`), creator: 'BaustoffBoard (baustoffboard.de)' });
  const links = 25;
  const breite = 160;
  const shiraz: [number, number, number] = [163, 17, 62];

  doc.setFillColor(...shiraz);
  doc.rect(0, 0, 210, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...shiraz);
  doc.text(pdfText('BaustoffBoard · TTZ-Weiterbildungspfad'), links, 24);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(24);
  doc.text(pdfText('Teilnahmebestätigung'), links, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  let y = 62;
  doc.text(pdfText('Hiermit wird bestätigt, dass'), links, y);
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(pdfText(name), links, y);
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(pdfText('das Selbstlernangebot'), links, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const titel = doc.splitTextToSize(pdfText(d.kurs.titel), breite) as string[];
  doc.text(titel, links, y);
  y += titel.length * 7 + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const satz = `bearbeitet und das abschließende Kursquiz am ${datumText(d.datum)} mit ${d.richtig} von ${d.gesamt} richtigen Antworten (${prozent} %) abgeschlossen hat.`;
  const satzZeilen = doc.splitTextToSize(pdfText(satz), breite) as string[];
  doc.text(satzZeilen, links, y);
  y += satzZeilen.length * 6 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfText(`Inhalte (Umfang: ${d.kurs.umfang})`), links, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  for (const m of d.modulTitel ?? d.kurs.module) {
    const z = doc.splitTextToSize(pdfText(`· ${m}`), breite) as string[];
    doc.text(z, links + 2, y);
    y += z.length * 5.5;
  }

  // Hinweisbox
  y = Math.max(y + 12, 215);
  doc.setDrawColor(...shiraz);
  doc.setLineWidth(0.6);
  doc.rect(links, y, breite, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...shiraz);
  doc.text(pdfText(BESTAETIGUNG_HINWEIS), links + 5, y + 9, { maxWidth: breite - 10 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(pdfText('Die Bestätigung wurde lokal im Browser erzeugt. Name und Ergebnis wurden nicht übermittelt oder gespeichert und sind daher nicht überprüfbar.'), links + 5, y + 16, { maxWidth: breite - 10 });

  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(pdfText('Technische Hochschule Augsburg · TTZ Aichach · baustoffboard.de'), links, 285);
  return new Uint8Array(doc.output('arraybuffer'));
}
