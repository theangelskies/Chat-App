import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let messages = [{ id: 1, text: "Welcome to the chat!", timestamp: Date.now() }];

// GET all messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// POST a new message
app.post("/messages", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const newMessage = {
    id: messages.length + 1,
    text,
    timestamp: Date.now(),
  };

  messages.push(newMessage);

  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
