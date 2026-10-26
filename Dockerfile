# BaustoffBoard – Container für Google Cloud Run (kontinuierliche Bereitstellung aus GitHub, Branch main)
# Anleitung für den Betrieb: docs/betrieb-cloud-run.md
#
# Start: gebautes Server-Bundle dist/server.cjs (entsteht durch "npm run build", siehe package.json).
# "npm start" (= node server.ts) funktioniert ebenfalls, bräuchte im Container aber die Quelltexte;
# das Bundle hält das Laufzeit-Image klein und ist unabhängig von der TypeScript-Unterstützung von Node.

# --- Stufe 1: Bauen (Frontend mit Vite + Server-Bundle mit esbuild) ---------------------------------
FROM node:22-slim AS builder
WORKDIR /app

# Abhängigkeiten zuerst (Docker-Cache). Liegt eine package-lock.json im Repository, wird reproduzierbar
# mit "npm ci" installiert; derzeit gibt es nur bun.lock (AI Studio), daher sonst "npm install".
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

COPY . .
RUN npm run build

# --- Stufe 2: nur die Laufzeit-Pakete des Server-Bundles ---------------------------------------------
# dist/server.cjs bündelt den eigenen Code; nur die mit --external: ausgenommenen Pakete müssen zur
# Laufzeit installiert sein. Die Liste wird aus dem build-Skript in package.json gelesen (Versionen
# ebenfalls aus package.json), damit sie nicht doppelt gepflegt wird. vite wird nur in der Entwicklung
# geladen (NODE_ENV != production) und fehlt deshalb bewusst. package.json selbst bleibt unverändert.
FROM node:22-slim AS deps
WORKDIR /deps
COPY package.json /tmp/package.json
RUN node -e ' \
  const p = require("/tmp/package.json"); \
  const ext = [...p.scripts.build.matchAll(/--external:(\S+)/g)].map(m => m[1]).filter(n => n !== "vite"); \
  const fehlt = ext.filter(n => !p.dependencies[n]); \
  if (fehlt.length) { console.error("Nicht in dependencies: " + fehlt.join(", ")); process.exit(1); } \
  const dependencies = Object.fromEntries(ext.map(n => [n, p.dependencies[n]])); \
  require("fs").writeFileSync("package.json", JSON.stringify({ name: "baustoffboard-laufzeit", private: true, dependencies }, null, 2)); \
  console.log("Laufzeit-Pakete:", Object.keys(dependencies).join(", ")); \
  ' \
 && npm install --omit=dev --no-audit --no-fund \
 && npm cache clean --force

# --- Stufe 3: Laufzeit ---------------------------------------------------------------------------------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Cloud Run setzt PORT selbst (Standard 8080); der Server liest process.env.PORT.
ENV PORT=8080
# Kurzfragebogen (Entscheidung Z43): Datei im Verzeichnis /app/laufzeitdaten. Auf Cloud Run dort ein
# Cloud-Storage-Volume einhängen, sonst gehen die Daten bei Neustart/neuer Revision verloren.
ENV FEEDBACK_DATEI=/app/laufzeitdaten/kurzfragebogen.json

COPY --from=deps /deps/node_modules ./node_modules
# package.json liefert die Versionsangabe für /api/health
COPY package.json ./
COPY --from=builder /app/dist ./dist

# Schreibrechte für den Benutzer "node" (UID/GID 1000): analytics.json entsteht in /app,
# der Kurzfragebogen in /app/laufzeitdaten (bzw. im dort eingehängten Volume).
RUN mkdir -p /app/laufzeitdaten && chown node:node /app /app/laufzeitdaten

USER node
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
