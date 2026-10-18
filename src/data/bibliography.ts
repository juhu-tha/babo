export interface BibliographyEntry {
  id: string;
  autoren: string;
  titel: string;
  auflage?: string;
  jahr: string;
  verlag: string;
  verified: boolean;
}

export const BIBLIOGRAPHY: Record<string, BibliographyEntry> = {
  wendehorst: {
    id: 'wendehorst',
    autoren: 'Neroth, G.; Vollenschaar, D. (Hrsg.)',
    titel: 'Wendehorst Baustoffkunde',
    auflage: '27. Aufl.',
    jahr: '2011',
    verlag: 'Wiesbaden: Vieweg+Teubner',
    verified: true,
  },
  schneider: {
    id: 'schneider',
    autoren: 'Albert, A. (Hrsg.)',
    titel: 'Schneider – Bautabellen für Ingenieure',
    auflage: '26. Aufl.',
    jahr: '2024',
    verlag: 'Köln: Reguvis',
    verified: true,
  },
  gruebl_weigler_karl: {
    id: 'gruebl_weigler_karl',
    autoren: 'Grübl, P.; Weigler, H.; Karl, S.',
    titel: 'Beton – Arten, Herstellung und Eigenschaften',
    auflage: '2. Aufl.',
    jahr: '2001',
    verlag: 'Berlin: Ernst & Sohn',
    verified: true,
  },
  zilch_zehetmaier: {
    id: 'zilch_zehetmaier',
    autoren: 'Zilch, K.; Zehetmaier, G.',
    titel: 'Bemessung im konstruktiven Betonbau',
    auflage: '2. Aufl.',
    jahr: '2010',
    verlag: 'Berlin/Heidelberg: Springer Vieweg',
    verified: true,
  },
  raupach_orlowsky: {
    id: 'raupach_orlowsky',
    autoren: 'Raupach, M.; Orlowsky, J.',
    titel: 'Schutz und Instandsetzung von Stahlbetonbauten',
    auflage: '2. Aufl.',
    jahr: '2018',
    verlag: 'Berlin: Ernst & Sohn',
    verified: true,
  },
  willems: {
    id: 'willems',
    autoren: 'Willems, W. M.',
    titel: 'Lehrbuch der Bauphysik',
    auflage: '8. Aufl.',
    jahr: '2018',
    verlag: 'Wiesbaden: Springer Vieweg',
    verified: true,
  },
  stark_wicht: {
    id: 'stark_wicht',
    autoren: 'Stark, J.; Wicht, B.',
    titel: 'Dauerhaftigkeit von Beton',
    auflage: '2. Aufl.',
    jahr: '2013',
    verlag: 'Berlin/Heidelberg: Springer Vieweg',
    verified: true,
  },
  goris: {
    id: 'goris',
    autoren: 'Goris, A.',
    titel: 'Stahlbetonbau kompakt nach Eurocode 2',
    auflage: '1. Aufl.',
    jahr: '2021',
    verlag: 'Köln: Werner Verlag',
    verified: true,
  },
  fingerloos_hegger_zilch: {
    id: 'fingerloos_hegger_zilch',
    autoren: 'Fingerloos, F.; Hegger, J.; Zilch, K.',
    titel: 'Eurocode 2 für Deutschland',
    auflage: '3. Aufl.',
    jahr: '2016',
    verlag: 'Berlin: Ernst & Sohn / DIN Media',
    verified: true,
  },
  // Unverifizierte Werke gemäß P21 (werden in docs/literatur_pruefen.md verwaltet und in der UI ausgeblendet)
  gruebl_schiessl_schnell: {
    id: 'gruebl_schiessl_schnell',
    autoren: 'H. Grübl, P. Schießl, J. Schnell',
    titel: 'Baustoffkunde für Studium und Praxis',
    auflage: '18. Auflage',
    jahr: '2016',
    verlag: 'Düsseldorf: Werner Verlag',
    verified: false,
  },
  adolf_peter_moehler: {
    id: 'adolf_peter_moehler',
    autoren: 'Adolf-Peter-Möhler-Archiv',
    titel: 'Römische Pozzolan-Technologien',
    jahr: '',
    verlag: 'Archivbestand',
    verified: false,
  },
  harald_s: {
    id: 'harald_s',
    autoren: 'Prof. Dr.-Ing. Harald S.',
    titel: 'Übungsbuch Baustoffkunde',
    jahr: '2023',
    verlag: '',
    verified: false,
  },
  dahlmann_gross_hauger: {
    id: 'dahlmann_gross_hauger',
    autoren: 'Dahlmann, J.; Groß, D.; Hauger, W.',
    titel: 'Technische Mechanik 1 & 2: Statik und Elastostatik',
    jahr: '2020',
    verlag: 'Springer-Verlag',
    verified: false,
  },
  huber_j: {
    id: 'huber_j',
    autoren: 'Huber, J.',
    titel: 'Spezielle Bauchemie und organische Werkstoffe im Bauwesen',
    jahr: '',
    verlag: 'Springer Vieweg',
    verified: false,
  },
  karkuzi: {
    id: 'karkuzi',
    autoren: 'Karkuzi, M.',
    titel: 'Bindemittel der Bauwirtschaft - Chemie, Ökologie, Anwendung (Kalk & Gips)',
    jahr: '2021',
    verlag: '',
    verified: false,
  },
  karkut: {
    id: 'karkut',
    autoren: 'Karkut, M.',
    titel: 'Mechanische Baustoffprüfungen im Konstruktiven Ingenieurbau',
    jahr: '2021',
    verlag: '',
    verified: false,
  },
};

export function formatBibEntry(entry: BibliographyEntry): string {
  const parts = [entry.autoren, entry.titel];
  if (entry.auflage) parts.push(entry.auflage);
  if (entry.verlag) parts.push(entry.verlag);
  return parts.filter(Boolean).join('. ');
}

export function resolveBibReference(idOrText: string): string | null {
  const trimmed = idOrText.trim();
  // Check direct key
  if (BIBLIOGRAPHY[trimmed]) {
    const entry = BIBLIOGRAPHY[trimmed];
    return entry.verified ? formatBibEntry(entry) : null;
  }

  // Canonical Wendehorst mapping
  if (/Wendehorst/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.wendehorst);
  }

  // Canonical Schneider Bautabellen mapping
  if (/Schneider/i.test(trimmed) && /Bautabellen/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.schneider);
  }

  // Goris -> Goris normalization
  if (/Goris/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.goris);
  }

  // Unverified checks
  if (
    /Grübl.*Schießl/i.test(trimmed) ||
    /Möhler/i.test(trimmed) ||
    /Harald S/i.test(trimmed) ||
    /Dahlmann/i.test(trimmed) ||
    /Huber,\s*J/i.test(trimmed) ||
    /Karkuzi/i.test(trimmed) ||
    /Karkut/i.test(trimmed)
  ) {
    return null; // Do not display unverified entries
  }

  // Grübl/Weigler/Karl duplicate normalization
  if (/Grübl/i.test(trimmed) && /Weigler/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.gruebl_weigler_karl);
  }

  // Zilch/Zehetmaier duplicate normalization
  if (/Zilch/i.test(trimmed) && /Zehetmaier/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.zilch_zehetmaier);
  }

  // Raupach/Orlowsky duplicate normalization
  if (/Raupach/i.test(trimmed) && /Orlowsky/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.raupach_orlowsky);
  }

  // Willems duplicate normalization
  if (/Willems/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.willems);
  }

  // Stark/Wicht duplicate normalization
  if (/Stark/i.test(trimmed) && /Wicht/i.test(trimmed)) {
    return formatBibEntry(BIBLIOGRAPHY.stark_wicht);
  }

  // Check if string contains known unverified indicator
  return trimmed;
}
