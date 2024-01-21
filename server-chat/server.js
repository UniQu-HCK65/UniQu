if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");
const http = require("http");
const express = require("express");
const multer = require("multer");
const path = require("path");

const PORT = 4000;
const clientOrigins = "exp://192.168.68.168:8081";
const mongoUri = process.env.CHAT_DB_URI;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientOrigins,
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

let db;

const startServer = async () => {
  try {
    const client = await MongoClient.connect(mongoUri);
    console.log("Connected to MongoDB");
    db = client.db();

    app.use(express.json());

    app.post("/upload", upload.single("image"), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }
      
      const imageUrl = req.file.path;
      const message = req.body.message;
    
      res.json({ imageUrl, message });
    });

    app.get("/get-messages", async (req, res) => {
      const { room } = req.query;
      const messageCollection = db.collection("messages");

      try {
        const messages = await messageCollection.find({ room }).toArray();
        res.json({ messages });
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

io.on("connect", (socket) => {
  console.log(`${socket.id} just connected`);
  socket.broadcast.emit("user-joined", { userId: socket.id });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("send-message", async (data) => {
    const messageCollection = db.collection("messages");
    await messageCollection.insertOne({
      username: data.username,
      message: data.message || "",
      imageUrl: data.imageUrl || "",
      room: data.room,
    });
    io.to(data.room).emit("new-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} just disconnected`);
  });

  socket.on("set-username", (username) => {
    console.log(username, socket.id);
    io.emit("new-user", username);
  });

  io.use(function (socket, next) {
    socket.room = socket.handshake.query.room;
    return next();
  })
  .on("connection", function(socket) {
    socket.on('private', (msg) => {
        socket.broadcast
        .to(socket.room)
        .emit("chat", msg)
    });
  });

});

startServer();