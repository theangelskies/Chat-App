import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];
app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { text, username } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Message text is required" });
  }

  if (!username || !username.trim()) {
    return res.status(400).json({ error: "Username is required" });
  }

  const newMessage = {
    id: Date.now(),
    text: text.trim(),
    username: username.trim(),
    timestamp: Date.now(),
    likes: 0,
    dislikes: 0,
  };

  messages.push(newMessage);

  res.status(201).json(newMessage);
});

app.post("/messages/:id/like", (req, res) => {
  const message = messages.find((m) => m.id === parseInt(req.params.id));

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.likes++;
  res.json(message);
});

app.post("/messages/:id/dislike", (req, res) => {
  const message = messages.find((m) => m.id === parseInt(req.params.id));

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.dislikes++;
  res.json(message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
