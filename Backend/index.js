import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;
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

    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      username: username.trim(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
    };

    messages.push(newMessage);

    io.emit("newMessage", newMessage);
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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
