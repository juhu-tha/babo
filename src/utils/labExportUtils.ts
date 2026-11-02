import { formatDeZahl } from '@/src/utils/numberFormat';
// Utility functions for lab protocols, test verification hashes, and report exports (CSV, JSON, Printable Report)

export interface LabProtocolRecord {
  id: string;
  timestamp: string;
  testTitle: string;
  norm: string;
  operator: string;
  specimen: {
    material: string;
    geometry: string;
    dimensions: string;
    conditioning?: string;
  };
  parameters: Record<string, string | number>;
  metrics: Record<string, string | number>;
  dataPointsCount: number;
  integrityHash: string; // deterministische, nicht kryptografische Prüfsumme (FNV-1a-Hybrid)
  status: 'Gültig' | 'Ungültig' | 'Plausibel';
  validationNotes: string[];
}

/**
 * Deterministic checksum/hash for test data integrity (CRC32/FNV-1a hybrid formatted in hex)
 */
export function generateIntegrityChecksum(payload: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x55555555;
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i);
    hash1 ^= code;
    hash1 = Math.imul(hash1, 0x01000193);
    hash2 = (hash2 << 5) - hash2 + code;
    hash2 |= 0;
  }
  const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `THA-LAB-SEC-${h1.toUpperCase()}-${h2.toUpperCase()}`;
}

/**
 * Validates physical plausibility and norm bounds of laboratory results
 */
export function validateMechanicalTestIntegrity(
  material: string,
  testType: string,
  maxStress: number,
  modulusGPa: number,
  failureStrain: number
): { status: 'Gültig' | 'Plausibel' | 'Ungültig'; notes: string[]; hash: string } {
  const notes: string[] = [];
  let status: 'Gültig' | 'Plausibel' | 'Ungültig' = 'Gültig';

  // Physical plausibility checks
  if (maxStress <= 0) {
    status = 'Ungültig';
    notes.push('Maximale Spannung muss größer als 0 sein (Messzellen-Nullpunktdrift prüfen).');
  }

  if (modulusGPa <= 0 && testType === 'emodul') {
    status = 'Ungültig';
    notes.push('E-Modul kann nicht negativ oder null sein.');
  }

  if (material === 'beton') {
    if (testType === 'druck' && (maxStress < 5 || maxStress > 150)) {
      status = 'Plausibel';
      notes.push(`Beton-Druckfestigkeit ${formatDeZahl(maxStress, 1)} MPa liegt außerhalb des Bereichs der Festigkeitsklassen C8/10 bis C100/115 nach DIN EN 206.`);
    }
    if (testType === 'zug' && maxStress > 10) {
      status = 'Plausibel';
      notes.push('Zentrische Betonzugfestigkeit liegt selten über 6 bis 8 MPa (Prüfkörpereinspannung bzw. Versagensart prüfen).');
    }
    if (testType === 'haftzug') {
      if (maxStress < 0.5) {
        status = 'Plausibel';
        notes.push('Haftzugfestigkeit fh < 0,5 MPa ist kritisch niedrig (mangelhafte Untergrundvorbereitung oder Schlämmeanhaftung).');
      } else if (maxStress >= 1.5) {
        notes.push('Haftzugfestigkeit fh ≥ 1,5 MPa erreicht den häufig geforderten Mittelwert (z. B. für Instandsetzungsmörtel und befahrene Oberflächenschutzsysteme); maßgebend sind die objektspezifischen Anforderungen nach TR Instandhaltung bzw. ZTV-ING einschließlich Einzelwertkriterium.');
      } else {
        notes.push('Haftzugfestigkeit liegt zwischen 0,5 und 1,5 MPa (Prüfung auf Einzelwertkriterium erforderlich).');
      }
    }
    if (testType !== 'haftzug' && (failureStrain < 1.0 || failureStrain > 8.0)) {
      notes.push(`Bruchstauchung ${formatDeZahl(failureStrain, 2)} ‰ liegt außerhalb des üblichen Bereichs von ε_c1 bis ε_cu1 (etwa 1,8 bis 3,5 ‰ nach DIN EN 1992-1-1, Tab. 3.1).`);
    }
  } else if (material === 'stahl') {
    if (modulusGPa < 180 || modulusGPa > 230) {
      status = 'Plausibel';
      notes.push(`Stahl-E-Modul ${formatDeZahl(modulusGPa, 1)} GPa weicht deutlich vom Rechenwert ab (Betonstahl 200 GPa nach DIN EN 1992-1-1, Baustahl 210 GPa nach DIN EN 1993-1-1).`);
    }
    if (failureStrain < 10) {
      status = 'Plausibel';
      notes.push('Geringe Dehnung für Betonstahl (Duktilität nach DIN 488-1 über A_gt und R_m/R_e prüfen).');
    }
  } else if (material === 'holz') {
    notes.push('Prüfbedingungen nach DIN EN 408: Normalklima 20 °C / 65 % r. F.; Faserrichtung (Anisotropie) und Holzfeuchte im Protokoll angeben.');
  }

  if (notes.length === 0) {
    notes.push('Die Kennwerte liegen in den hinterlegten Plausibilitätsbereichen (keine normative Konformitätsbewertung).');
  }

  const payload = `${material}|${testType}|${maxStress.toFixed(3)}|${modulusGPa.toFixed(2)}|${failureStrain.toFixed(3)}|${Date.now()}`;
  const hash = generateIntegrityChecksum(payload);

  return { status, notes, hash };
}

/**
 * Trigger browser CSV download
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    // kein Zahlenergebnis (NaN/∞, auch als Text aus toFixed) → leeres Feld statt „NaN“ (Prüfung 02.11.2026)
    if (typeof val === 'number' && !Number.isFinite(val)) return '';
    if (typeof val === 'string' && /^-?(NaN|Infinity)$/.test(val.trim())) return '';
    const s = String(val ?? '');
    if (s.includes(';') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const csvContent = '\uFEFF' + [
    headers.map(escapeCell).join(';'),
    ...rows.map(row => row.map(escapeCell).join(';'))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger browser JSON download
 */
export function exportToJSON(filename: string, data: unknown): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger clean browser printing (Print to PDF) with dedicated printable styles
 */
export function openPrintableReport(reportHtml: string, title = 'Labor-Prüfbericht'): void {
  // Use a hidden iframe to trigger print safely in iframe environments without window.open/alert
  let iframe = document.getElementById('printable-report-frame') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'printable-report-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }

  const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          line-height: 1.5;
          margin: 0;
          padding: 24px;
          background: #ffffff;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
        .header-bar {
          border-bottom: 2px solid #a3113e;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .header-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .header-sub {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }
        .badge {
          display: inline-block;
          font-size: 11px;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
        }
        .badge-success { background: #dcfce7; color: #166534; border-color: #86efac; }
        .badge-warning { background: #fef3c7; color: #92400e; border-color: #fde68a; }
        .badge-danger { background: #ffe4e6; color: #9f1239; border-color: #fca5a5; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 12px;
        }
        th, td {
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
          text-align: left;
        }
        th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #475569;
        }
        .metric-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .hash-code {
          font-family: monospace;
          font-size: 11px;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #cbd5e1;
          display: inline-block;
          color: #0f172a;
        }
        .btn-print {
          background: #a3113e;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          margin-bottom: 16px;
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 16px; text-align: right;">
        <button class="btn-print" onclick="window.print()">🖨️ Drucken / Als PDF speichern</button>
      </div>
      ${reportHtml}
    </body>
    </html>
  `);
  iframeDoc.close();
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }, 250);
}
