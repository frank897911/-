import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Piske & Usagi Japan Travel Journal" });
  });

  // AI Assistant endpoint using Gemini
  app.post("/api/ai-travel-assistant", async (req, res) => {
    try {
      const { prompt, topic } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          text: "提示：尚未設定 GEMINI_API_KEY，請在系統金鑰設定中輸入 API Key，即可啟用「兔兔&P助 AI 隨行助手」的即時建議喔！ฅ'ω'ฅ"
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      
      let systemInstruction = `你是一個專業、親切且非常可愛的日本旅遊隨行小幫手，名字叫「兔兔與P助旅遊小助手」。
使用繁體中文回答，語氣溫馨可愛、條理清晰。
專長包含：
1. 日本景點、美食、購物免稅及自駕 (MapCode / 導航) 指南。
2. 日常旅遊實用日文翻譯與店家對話句（附上羅馬拼音與繁體中文說明）。
3. 根據天氣或突發狀況給予備案建議。
回答請維持簡潔精準，多利用條點列出重點。`;

      if (topic === "translate") {
        systemInstruction += "\n特別強調：請提供即時日語對話翻譯，包含日文原文、羅馬拼音 (Romaji) 與中文意思，並給予簡單發音技巧。";
      } else if (topic === "driving") {
        systemInstruction += "\n特別強調：請專注於日本自駕注意事項，包含高速公路 ETC、加油站點（無鉛普通/油種）、停車規範與 MapCode 使用說明。";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "兔兔與P助在想事情...請再試一次看看喔！" });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "AI 助手連線發生微小異常",
        text: "抱歉！兔兔和 P助 暫時離線去吃麻糬了 🍡，請稍後再試試看喔！"
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Travel App] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
