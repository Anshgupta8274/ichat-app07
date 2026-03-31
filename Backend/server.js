const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../Frontend")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

let users = {};

// Socket connection
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("receive-message", {
            name: "System",
            message: `${name} joined the chat`
        });
    });

    socket.on("send-message", (data) => {
        socket.broadcast.emit("receive-message", data);
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("receive-message", {
                name: "System",
                message: `${users[socket.id]} left the chat`
            });
            delete users[socket.id];
        }
        console.log("User disconnected");
    });
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
