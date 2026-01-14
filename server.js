import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Call updated Flask backend
    const response = await fetch("http://localhost:5001/chat_api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query_text: message }), // <-- must match Flask
    });

    const data = await response.json();

    if (data.bot_response === "ASK_ADMIN") {           // <-- updated key
      return res.json({ reply: "I can't answer this. The admin will get back to you." });
    }

    res.json({ reply: data.bot_response });           // <-- updated key
  } catch (error) {
    console.error("Error communicating with NLP backend:", error);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
