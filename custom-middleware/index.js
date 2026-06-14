import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { logger } from "./middlewares/logger.js";
import { validateMessage } from "./middlewares/validateMessage.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let messages = [];

// Use custom logger middleware
io.use(logger);

io.on("connection", (socket) => {
  socket.emit("init", messages);

  socket.on("sendMessage", (data) => {
    // Use validation middleware manually
    validateMessage(data, () => {
      const msg = {
        id: Date.now(),
        text: data.text.trim(),
        username: data.username.trim(),
        timestamp: Date.now(),
        likes: 0,
        dislikes: 0,
      };

      messages.push(msg);
      io.emit("newMessage", msg);
    });
  });

  socket.on("like", (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    msg.likes++;
    io.emit("updateMessage", msg);
  });

  socket.on("dislike", (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    msg.dislikes++;
    io.emit("updateMessage", msg);
  });
});

server.listen(3001, () => console.log("Custom middleware server running"));
