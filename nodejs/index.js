const express = require('express')
const app = express()
//const port = 3000;
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('connecté');
   // socket.on('deconnecté', () => {
       // console.log('deconnecté');
   // });
});

server.listen(3000, () => {
  console.log('ecoute le port *:3000');
});
