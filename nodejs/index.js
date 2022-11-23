//Instanciations
const app = require('express')();

const server = require('http').createServer(app);

const io = require("socket.io")(server);


//Création de la route /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//Ecoute de l'event "connection"
io.on('connection', (socket) => {
    console.log("Une connection s'active");

    //Ecoute de la deconnexion
   socket.on('disconnect', () => {
        console.log("Un utilisateur s'est deconnecté");
   });

   //Gestion du tchat
   socket.on('chat_message', (msg) => {
        //Envoi du message aux utilisateurs connectés
        io.emit("chat_message", msg);
   })
});

//Ecoute sur le port 3000
server.listen(3000, () => {
  console.log('ecoute le port *:3000');
});