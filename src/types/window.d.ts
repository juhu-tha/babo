// Globale Fenster-Erweiterungen (AP 5.1: ersetzt `(window as any)`)

/** Ergebnis von public/boot/jsonld-check.js */
interface JsonLdPruefbericht {
  success?: boolean;
  errors?: string[];
  warnings?: string[];
  results?: { name: string; url: string; status: string }[];
}

/** Minimaler Ausschnitt der Google-Translate-Website-Widget-API */
interface GoogleTranslateApi {
  translate?: {
    TranslateElement: new (
      optionen: { pageLanguage: string; includedLanguages?: string; autoDisplay?: boolean },
      elementId: string,
    ) => unknown;
  };
}

interface Window {
  validateJSONLD?: () => JsonLdPruefbericht;
  google?: GoogleTranslateApi;
  googleTranslateElementInit?: () => void;
  /** Safari < 14.1 */
  webkitAudioContext?: typeof AudioContext;
}
