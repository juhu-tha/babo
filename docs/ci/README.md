# CI (vorübergehend deaktiviert)

`qa.yml` war unter `.github/workflows/` aktiv. Es wurde zur Fehlersuche beim Import in Google AI Studio deaktiviert. Zum Reaktivieren die Datei zurück nach `.github/workflows/qa.yml` verschieben.

## ESLint und package-lock (vorübergehend entfernt)

Zur Fehlersuche beim Import in Google AI Studio wurden `package-lock.json`, die ESLint-Entwicklungsabhängigkeiten und `eslint.config.js` entfernt (Stand wie vor Phase 0b, mit `bun.lock`). Die Konfiguration liegt unter `docs/ci/eslint.config.js`. Wiederherstellen:

```
npm i -D eslint@9 typescript-eslint eslint-plugin-react-hooks eslint-plugin-unused-imports globals
git mv docs/ci/eslint.config.js eslint.config.js
```
