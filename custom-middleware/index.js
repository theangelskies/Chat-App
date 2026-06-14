import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("init", messages);

  socket.on("sendMessage", ({ text, username }) => {
    if (!text?.trim() || !username?.trim()) return;

    const msg = {
      id: Date.now(),
      text: text.trim(),
      username: username.trim(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
    };

    messages.push(msg);
    io.emit("newMessage", msg);
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

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
