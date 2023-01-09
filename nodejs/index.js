const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

// Cette ligne va nous permettre de recuperer tout les element du dossier static (public)
app.use(express.static(path.join(__dirname + "/public")));

// Lancer lorsque l'utilisateur se connecte
io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    // Broadcast quant l'utilisateur se connecte
    // emit permet à chaque utilisateur de recevoir les messages
    // parcontre broadcast enverrai le message à tout le monde sauf à la personne qui a saisit le message
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
  // on ecoute les messages tapeés
  socket.on("usertyping", function (username) {
    // envoyer de telle sorte que le message que j'envoie qu'on ne me l'envoie pas
    socket.broadcast.emit("usertyping", username + " est en train d'écrire...");
  });
});

server.listen(3000);
