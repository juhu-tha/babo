import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

let aiClient: any = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  app.use(express.json());

  // Simple file-based analytics store
  const analyticsFile = path.join(process.cwd(), "analytics.json");
  
  // Initialize file if it doesn't exist
  if (!fs.existsSync(analyticsFile)) {
    fs.writeFileSync(analyticsFile, JSON.stringify({ visits: 0 }), "utf-8");
  }

  // --- API Routes ---

  // POST endpoint for Gemini AI analyses in Civil Engineering
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Kein Prompt übermittelt." });
      }

      // Check key presence before initializing
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          status: "simulated",
          text: `### ⚠️ Keine Live-Verbindung zum KI-Dienst (GEMINI_API_KEY fehlt)

Dieses BaustoffBoard-Modul besitzt regulär eine **vollwertige Live-Anbindung an Google Gemini**, um dynamische Gutachten, Baustoffprüfungsberichte, Rissanalysen und Normenprüfungen in Echtzeit zu generieren. 

Da derzeit kein **GEMINI_API_KEY** als Umgebungsvariable im System hinterlegt ist, läuft die Bereitstellung im **simulierten Übungsmodus**.

---

### Generierter Prompt für Copy-Paste (bereit für Ihr LLM):
\`\`\`text
${prompt}
\`\`\`

---

### 💡 So aktivieren Sie den Echtzeit-Modus im BaustoffBoard:
1. Öffnen Sie links oben das Hauptmenü der Arbeitsumgebung (Zahnrad-Symbol für **Settings**).
2. Wählen Sie den Reiter **Secrets**.
3. Fügen Sie einen Eintrag hinzu mit:
   - **Key:** \`GEMINI_API_KEY\`
   - **Value:** *Ihr persönlicher Gemini API-Key (kostenlos bei Google AI Studio erhältlich)*
4. Nach dem Speichern lädt sich das Board neu und Sie können die KI direkt interaktiv im Vorlesungsmodul befragen!`,
          isDemo: true
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Du bist ein erfahrener Professor und Dr.-Ing. für Baustoffkunde und Bauchemie an der TH Augsburg.",
          temperature: 0.7,
        }
      });

      res.json({
        status: "live",
        text: response.text || "Keine Antwort von Gemini erhalten.",
        isDemo: false
      });

    } catch (error: any) {
      console.error("Gemini-API Fehler:", error);
      res.status(500).json({
        error: "Fehler bei der Kommunikation mit dem KI-Kernel.",
        details: error.message
      });
    }
  });
  
  // GET analytics (protected - basic check or just open for the frontend, but we'll secure it slightly)
  app.get("/api/analytics", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(analyticsFile, "utf-8"));
      res.json(data);
    } catch (e) {
      res.json({ visits: 0 });
    }
  });

  // POST visit (track a page view)
  app.post("/api/analytics/visit", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(analyticsFile, "utf-8"));
      data.visits += 1;
      fs.writeFileSync(analyticsFile, JSON.stringify(data), "utf-8");
      res.json({ success: true, visits: data.visits });
    } catch (e) {
      res.status(500).json({ error: "Could not track visit" });
    }
  });

  // --- Live Lecture Polling Store & Endpoints ---
  const pollStore: Record<string, Record<string, number[]>> = {};

  // GET live votes for a lecture module
  app.get("/api/polls/:lectureId", (req, res) => {
    const { lectureId } = req.params;
    const votes = pollStore[lectureId] || {};
    res.json({ lectureId, votes });
  });

  // POST vote from a student
  app.post("/api/polls/:lectureId/vote", (req, res) => {
    const { lectureId } = req.params;
    const { questionId, optionIndex } = req.body;

    if (!questionId || typeof optionIndex !== "number") {
      return res.status(400).json({ error: "questionId und optionIndex erforderlich." });
    }

    if (!pollStore[lectureId]) {
      pollStore[lectureId] = {};
    }
    if (!pollStore[lectureId][questionId]) {
      pollStore[lectureId][questionId] = [0, 0, 0, 0];
    }

    const currentCounts = pollStore[lectureId][questionId];
    if (optionIndex >= 0 && optionIndex < currentCounts.length) {
      currentCounts[optionIndex] += 1;
    }

    res.json({ success: true, votes: pollStore[lectureId] });
  });

  // POST simulate cohort votes (for lecture demos)
  app.post("/api/polls/:lectureId/simulate", (req, res) => {
    const { lectureId } = req.params;
    const { questionId, count = 10, correctIndex = 1 } = req.body;

    if (!pollStore[lectureId]) {
      pollStore[lectureId] = {};
    }
    if (!pollStore[lectureId][questionId]) {
      pollStore[lectureId][questionId] = [0, 0, 0, 0];
    }

    const counts = pollStore[lectureId][questionId];
    const n = Math.min(Math.max(1, count), 50);

    for (let i = 0; i < n; i++) {
      // 55% chance for correct answer, rest distributed
      const rand = Math.random();
      if (rand < 0.55 && correctIndex < counts.length) {
        counts[correctIndex] += 1;
      } else {
        const otherIndex = Math.floor(Math.random() * counts.length);
        counts[otherIndex] += 1;
      }
    }

    res.json({ success: true, votes: pollStore[lectureId] });
  });

  // POST reset votes for a question or lecture (requires password 'admin')
  app.post("/api/polls/:lectureId/reset", (req, res) => {
    const { lectureId } = req.params;
    const { questionId, password } = req.body;

    if (password !== "admin") {
      return res.status(403).json({ error: "Passwort 'admin' erforderlich zum Zurücksetzen der Umfrage." });
    }

    if (questionId && pollStore[lectureId]) {
      delete pollStore[lectureId][questionId];
    } else {
      delete pollStore[lectureId];
    }

    res.json({ success: true, votes: pollStore[lectureId] || {} });
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: process.cwd(),
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
