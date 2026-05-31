/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("⚠️ GEMINI_API_KEY is not defined in environment variables.");
  }
} catch (error) {
  console.error("❌ Failed to initialize GoogleGenAI SDK:", error);
}

// API endpoint for AI Voice Agent conversation simulation
app.post("/api/chat-simulation", async (req, res) => {
  const { 
    message, 
    chatHistory, 
    agentName, 
    organizationName, 
    industry, 
    conversationTone, 
    language, 
    instructions,
    personaAccent,
    personaTone,
    customerContext
  } = req.body;

  if (!ai) {
    // Return an intelligent context-aware mock reply in case Gemini is not active
    const msgLower = (message || "").toLowerCase();
    const custName = customerContext?.currentUser || "Valued Caller";
    const priorSummary = customerContext?.lastCallSummary || "";
    const hasContext = customerContext?.useContext;
    
    let mockReply = "";
    
    if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("namaste") || msgLower.includes("hey") || !chatHistory || chatHistory.length === 0) {
      if (hasContext && priorSummary) {
        mockReply = `Namaste ${custName}! Great to hear from you again. I recall we helped you with locking in "${priorSummary.replace(/\.$/, "")}" on your previous call. Has that resolved everything, or is there another task today?`;
      } else {
        mockReply = `Namaste! Thank you for calling ${organizationName || 'Rachit FinFirm'}. I am ${agentName || 'Sangeeta'}, how can I help you today?`;
      }
    } else if (msgLower.includes("premium") || msgLower.includes("unlock") || msgLower.includes("blocked") || msgLower.includes("benefit")) {
      mockReply = `Haan ${custName}, main double-check kar pa rahi hoon. Aapka premium package unlock ho gaya tha as mentioned in our last session. Kya dashboard normal load ho raha hai?`;
    } else if (msgLower.includes("loan") || msgLower.includes("interest") || msgLower.includes("rate") || msgLower.includes("flat")) {
      mockReply = `Ji, for first-time premium buyers like yourself, starting housing rates are indeed locked at 8.4% flat. Secure documents tab active hai, please upload salary slips.`;
    } else if (msgLower.includes("phone") || msgLower.includes("update") || msgLower.includes("number")) {
      mockReply = `Bilkul safe hai. Phone number change update registered status standard verification complete ho chuka hai. Change immediately visible on app settings!`;
    } else if (msgLower.includes("thank") || msgLower.includes("done") || msgLower.includes("perfect") || msgLower.includes("great")) {
      mockReply = `Aapka customer partner bank trust are always prime! Bahut khushi hui aapse baat karke. Any other items to store in context, ${custName}?`;
    } else {
      mockReply = `Understood perfectly, ${custName}! I have recalled our active memory fact logs. Main secure databases check update processed list me add kar deti hoon. Is there any additional query?`;
    }

    return res.json({ 
      text: mockReply,
      isDemo: true
    });
  }

  try {
    const formattedHistory = (chatHistory || []).map((chat: any) => {
      return {
        role: chat.sender === 'agent' ? 'model' : 'user',
        parts: [{ text: chat.text }]
      };
    });

    let contextSection = "";
    if (customerContext && customerContext.useContext) {
      contextSection = `
CUSTOMER INTERACTION EXPERIENCE CONTEXT (RECALLED ACTIVE MEMORIES):
- Current Caller Name: ${customerContext.currentUser}
- Active Caller Phone: ${customerContext.phone}
- Previous Call Summary Option: "${customerContext.lastCallSummary || 'No previous history recorded.'}"
- Known Corporate Memories about Caller:
${(customerContext.memories || []).map((m: string) => `  * Recalled Fact: ${m}`).join("\n")}

ROLEPLAY MANDATE (COGNITIVE RECALL):
This customer has previous calls with your system. You have active recall memory.
Acknowledge they are a returning caller by name ("Namaste ${customerContext.currentUser}..." or "Hi ${customerContext.currentUser}...") and refer to or follow up on their previous transaction summary ("I hope everything is working with the premium package..." etc.) during the opening greeting or naturally in dialogue to make the experience seamless.
`;
    }

    const systemPrompt = `
You are ${agentName || 'Sangeeta'}, a simulated real-time conversational AI Voice Agent for ${organizationName || 'our business'}.
Your profile traits:
- Business/Industry: ${industry || 'General Business'}
- Language: ${language || 'Hinglish — Hinglish'}
- Conversational Tone Style: ${conversationTone || 'Balanced'}
- Accent Profile: ${personaAccent || 'Indian English'}
- Persona Tone Style: ${personaTone || 'Warm & Professional'}
${contextSection}

Design instructions you MUST follow:
${instructions || ''}

CRITICAL RULES FOR VOICE CONVERSATION ROLEPLAY:
1. Speak in a concise, natural, and hyper-realistic conversational phone manner. Keep responses strictly short (1 to 2 sentences max) as this simulates a real-time voice call.
2. NEVER mention any tech jargon, prompt limits, or that you are an AI model. Be 100% human-like in your simulated phone dialogue.
3. Match the chosen language perfectly. If the language is "Hinglish — Hinglish", blend simple Hindi and English words naturally. E.g. "Bilkul, main check karti hoon! Kya aap mujhe apna account number bata sakte hain?" or "Aapka payment receive ho gaya hai, don't worry."
4. If the conversation tone is "Formal", speak very politely and respectfully. If "Casual", be very friendly, warm, and approachable. If "Balanced", maintain a standard professional yet easygoing demeanor.
5. Do not include markdown emojis, asterisk styles (like *chuckles*), or sub-headings. Output ONLY pure spoken text.
`;

    // We can use ai.models.generateContent containing the chat history and newest message
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    res.json({ text: response.text || "I'm sorry, I encountered an issue speaking. Could you please repeat that?" });
  } catch (error: any) {
    console.error("❌ Gemini API simulation error:", error);
    res.status(500).json({ error: error.message || "Gemini conversation generation failed" });
  }
});

// Start server and handle Vite development middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 VocalLabs Server running on http://localhost:${PORT}`);
  });
}

startServer();
