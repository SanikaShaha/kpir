import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing for our API routes
  app.use(express.json());

  // API endpoint for AI assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in the environment. Please set it in Settings > Secrets."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Map roles to GoogleGenAI expected format ('user' and 'model')
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: `You are the K J Somaiya Robotics Virtual Lab AI Research Assistant. You assist engineering students and faculty of K J Somaiya School of Engineering with robotics concepts, simulation problems, and academic practicals.
Your knowledge includes:
- Robotic Kinematics (Forward & Inverse Kinematics, Denavit-Hartenberg parameters)
- Control Systems (PID controllers, Arduino, ESP32 programming for robots)
- ROS 2 (Robot Operating System), Gazebo, Urdf, RViz
- Kuka, UR5, Fanuc, and custom 2-DOF, 3-DOF articulated robotic arms
- Somaiya lab specific codes and standard setups.

Provide helpful, technical, yet highly pedagogical and structured feedback. When explaining robotics kinematics or coding, use markdown, equations, or code blocks as appropriate. Keep answers relevant, engaging, and structured.`,
        },
      });

      res.json({ text: response.text || "No response generated." });
    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "An error occurred with the AI assistant." });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Serve static client assets or integrate Vite in dev mode
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting Express server:", err);
});
