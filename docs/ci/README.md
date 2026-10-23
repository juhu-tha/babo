# CI

`qa.yml` ist seit 23.10.2026 wieder unter `.github/workflows/` aktiv (Phase 0, AP 0.1). Es installiert vorerst mit `npm install` ohne Lockfile, damit der AI-Studio-Abgleich unverändert bleibt. AI Studio wird nur noch zum Pull von main und zum Veröffentlichen genutzt (Entscheidung E1).

## ESLint und package-lock (vorübergehend entfernt)

Zur Fehlersuche beim Import in Google AI Studio wurden `package-lock.json`, die ESLint-Entwicklungsabhängigkeiten und `eslint.config.js` entfernt (Stand wie vor Phase 0b, mit `bun.lock`). Die Konfiguration liegt unter `docs/ci/eslint.config.js`. Wiederherstellen:

```
npm i -D eslint@9 typescript-eslint eslint-plugin-react-hooks eslint-plugin-unused-imports globals
git mv docs/ci/eslint.config.js eslint.config.js
```
