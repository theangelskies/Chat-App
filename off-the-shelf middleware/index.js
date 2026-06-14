import express from "express";
import cors from "cors";
import morgan from "morgan";
import { body, validationResult } from "express-validator";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.json());

// Third-party logger
app.use(morgan("dev"));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let messages = [];

io.on("connection", (socket) => {
  socket.emit("init", messages);

  socket.on("sendMessage", (data) => {
    // Third-party validation
    const errors = [];
    if (!data.text) errors.push("text required");
    if (!data.username) errors.push("username required");

    if (errors.length) return;

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

server.listen(3002, () => console.log("Third-party middleware server running"));
