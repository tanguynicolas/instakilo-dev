const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    // envoyer de telle sorte que le message que j'envoie qu'on ne me l'envoie pas
    socket.broadcast.emit("update", username + " à rejoint la conversation");
  });
  socket.on("exituser", function (username) {
    // envoyer de telle sorte que le message que j'envoie qu'on ne me l'envoie pas
    socket.broadcast.emit("update", username + " à quitté la conversation");
  });
  socket.on("chat", function (message) {
    // envoyer de telle sorte que le message que j'envoie qu'on ne me l'envoie pas
    socket.broadcast.emit("chat", message);
  });
});

server.listen(3000);
