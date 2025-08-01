const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const http = require("http"); 
const { Server } = require("socket.io");
const { createDefaultSuperadmin } = require("./utils/createSuperadmin");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
  },
});

app.set("io", io);

const PORT = process.env.PORT || 5000;

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json());

createDefaultSuperadmin();

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
