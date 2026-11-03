import React from 'react';
import { Querverweis } from './Querverweis';
import { MdText } from '@/src/components/inhalt/MdText';
import verweis from '@/content/eckennwerte/Verweis.json';

/**
 * Querverweis der Fachmodule (Betonkennwerte, Stahlbeton, Holzbau, Stahlbau, Mauerwerk, Statistik, Festbeton-Statistik,
 * Sicherheitskonzept) auf das Modul „Kennwerte und Bemessungswerte nach Eurocode“ (Bestandsaufnahme 02.11.2026).
 * Eigene kleine Textdatei, damit die Fachmodule nicht den ganzen Modulinhalt laden.
 */
export function EcKennwerteVerweis({ className = '' }: { className?: string }) {
  return (
    <Querverweis ziel="ec_kennwerte" titel={verweis.werte.titel} linkText={verweis.werte.link} className={className}>
      <p><MdText text={verweis.texte.text} /></p>
    </Querverweis>
  );
}
