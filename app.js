import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import http from "node:http";
import axios from "axios";
import "./db.js";

import chatsRouter from "./routes/chatRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Налаштування CORS
  },
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/chats", chatsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (messageData) => {
    try {
      // Розсилаємо отримане повідомлення всім підключеним клієнтам
      io.emit("message", messageData);

      // Отримання випадкової цитати
      const response = await axios.get("https://api.quotable.io/random");
      const quote = response.data.content;

      // Відправка автоматичної відповіді
      const autoResponse = {
        sender: "AutoResponder",
        text: quote,
        createdAt: new Date(),
      };
      io.emit("message", autoResponse);
    } catch (error) {
      console.error("Error fetching quote: ", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});
