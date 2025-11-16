import express from "express";
import http from "http";
import { Server } from "socket.io";
import pool from "./DB.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();


const PORT = process.env.PORT || 3000;


app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chatMessage", async (data) => {
    const { username, message } = data;

    try {
      await pool.query(
        "INSERT INTO chats (username, message) VALUES ($1, $2)",
        [username, message]
      );

      io.emit("chatMessage", data);
    } catch (err) {
      console.error("DB insert error:", err);
    }
  });
});


app.get("/", (req, res) => {
  res.send("Chat Server Running...");
});


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
