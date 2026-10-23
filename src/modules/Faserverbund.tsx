import React from 'react';
import Kombinationen from './Kombinationen';

/**
 * Faserverbundwerkstoffe wurden in das Modul "Werkstoff-Kombinationen" integriert.
 * Diese Komponente dient als abwärtskompatibler Einstiegspunkt und leitet direkt
 * auf den Faserverbund-Mikromechanik-Tab im Modul Kombinationen weiter.
 */
export default function Faserverbund() {
  return <Kombinationen initialTab="faserverbund" />;
}
