import React from 'react';
import { Mail } from 'lucide-react';
import { SERVER_FUNKTIONEN } from '@/src/data/betriebsart';
import { RUECKMELDUNG_EMAIL, rueckmeldungMailto } from '@/src/data/rueckmeldung';

/**
 * Dezenter Hinweis „Rückmeldung per E-Mail“ (Entscheidung 03.11.2026) an den Stellen, an denen im statischen
 * Betrieb Kurzfragebogen und Live-Abstimmung entfallen. Der Linktext nennt Thema und Ziel-Adresse
 * (barrierefrei ohne Zusatz-Beschriftung). Ohne hinterlegte Adresse erscheint nichts.
 */
export function RueckmeldungLink({ modultitel, className = '' }: { modultitel: string; className?: string }) {
  const href = rueckmeldungMailto(modultitel);
  if (!href) return null;
  return (
    <p className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-text-main/70 dark:text-slate-400 ${className}`}>
      <Mail size={14} className="text-shiraz dark:text-rose-400 shrink-0" aria-hidden="true" />
      <span>Rückmeldung per E-Mail:</span>
      <a href={href} className="text-shiraz dark:text-rose-400 underline underline-offset-2 hover:no-underline">
        Rückmeldung zu „{modultitel}“ an {RUECKMELDUNG_EMAIL} senden
      </a>
    </p>
  );
}

/** Nur im statischen Betrieb; mit Server bleibt alles wie bisher (Kurzfragebogen, Live-Abstimmung) */
export default function RueckmeldungPerMail(props: { modultitel: string; className?: string }) {
  if (SERVER_FUNKTIONEN) return null;
  return <RueckmeldungLink {...props} />;
}
