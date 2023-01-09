(function () {
  const app = document.querySelector(".app");
  const socket = io();

  //uname et uavatar contiennent le nom et l'avatar de l'utilisateur
  let uname;
  let uavatar;
  let boolEstEnTrainDEcrire = 0;

  //Sidebar : Contenu de l'onglet "Que se passe-t-il"
  const sidebar = document.getElementsByClassName("sidebar")[0];

  //Quand on clique sur le bouton "Joindre"
  app.querySelector("#join-user").addEventListener("click", function (event) {
    //Récupère le nom entré pour l'utilisateur
    let username = app.querySelector(".join-screen #username").value;
    //Prend une valeur random entre 0 et 50 puis associe un avatar à l'utilisateur selon la valeur obtenue
    let rand = Math.floor(Math.random() * 50);
    let avatar = `img/${rand}.png`;
    //Force l'utiliateur à avoir un nom d'au moins un caractère
    if (username.length === 0) {
      return;
    }
    //Envoie un signal socket.io pour signaler l'arrivée d'un nouvel utilisateur
    socket.emit("newuser", username);
    uname = username;
    uavatar = avatar;
    //Change l'affichage de la page
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });
  //Quand on clique sur "Envoyer" Envoie le message
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function (event) {
      //Stock le contenu de la textbox dans message
      let message = app.querySelector(".chat-screen #message-input").value;
      //Si la textbox est vide, n'envoie rien
      if (message.length === 0) {
        return;
      }
      //Crée le rendu du message avec le nom, l'avatar de l'utilisateur et le contenu du message
      renderMessage("my", {
        username: uname,
        text: message,
        img: uavatar,
      });

      //Envoi un signal socket avec les données du message
      socket.emit("chat", {
        username: uname,
        text: message,
        img: uavatar,
      });
      //Vide la textbox
      app.querySelector(".chat-screen #message-input").value = "";
    });

  //Fait la même chose quand on appuie sur la touche "Entrée"
  document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length === 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
        img: uavatar,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
        img: uavatar,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    }
  });
  //Quand on clique sur le bouton Quitter
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      //Envoi un signal socket de deconnexion
      socket.emit("exituser", uname);
      //Refresh la page (Retour à l'écran de connexion)
      window.location.href = window.location.href;
    });

  msginput = document.getElementById("message-input");
  msginput.addEventListener("input", function(){
    //Si l'event n'a pas été trigger il y a moins de x secondes
    if(boolEstEnTrainDEcrire == 0){
      socket.emit("usertyping", uname);
      sidebar.insertAdjacentHTML(
        "beforeend",
        `<h3>Vous êtes en train d'écrire :</h3>
      <span>Votre barre de text a été modifié, ce qui a envoyé un signal au serveur et prévenir les autres utilisateurs.</span>`
      );
      boolEstEnTrainDEcrire = 1;
      setTimeout(function () {
        boolEstEnTrainDEcrire = 0;
      }, 10000);
    }
  });

  //Quand un signal socket est detecté, envoie ses informations à la fonction renderMessage
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
  socket.on("usertyping", function (usertyping) {
    renderMessage("usertyping", usertyping);
  });

  //Fonction de tri des signaux sockets
  function renderMessage(type, message) {
    //MessageContainer : Contenu du tchat
    let messageContainer = app.querySelector(".chat-screen .messages");

    /*Si le signal socket est de type "my" 
    >>>> MESSAGE ENVOYE PAR SOIT MEME <<<<*/
    if (type === "my") {
      //Crée une div "Mon message" qui s'affichera à droite avec notre avatar et le contenu du message
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
           <div>
           <div class="name"><img class="avatar" src=${message.img}>Toi</div>
           <div class="text">${message.text}</div>
           </div>
           `;
      messageContainer.appendChild(el);

      //Envoie ce qu'il se passe pour la sidebar
      aecrire = `<h3>Message envoyé :</h3>
      <span>Votre message est découpé en binaire comme dans l'activité à laquelle vous 
       avez participé et il est envoyé au serveur par le tuyau.</span>`;
      sidebar.insertAdjacentHTML(
        "beforeend",
        aecrire
      );

      /*Si le signal socket est de type "other" 
    >>>> MESSAGE RECU DE QUELQU'UN D'AUTRE <<<<*/
    } else if (type === "other") {
      //Crée une div "Autre message" qui s'affichera à gauche avec l'avatar, le nom et le contenu du message de l'auteur
      let el = document.createElement("div");
      el.setAttribute("class", "message  other-message");
      el.innerHTML = `
        <div>
        <div class="name"><img class="avatar" src=${message.img}> ${message.username}</div>
        <div class="texte">${message.text}</div>
        </div>
              `;
      messageContainer.appendChild(el);
      //Envoie ce qu'il se passe pour la sidebar
      aecrire = `<h3>Message reçu :</h3>
      <span>Le message est reçu en binaire depuis le serveur via le tuyau, votre ordinateur
        le restitue sous forme de texte comme vous l'avez fait dans l'activité.</span>`;
      sidebar.insertAdjacentHTML(
        "beforeend",
        aecrire
      );

      /*Si le signal socket est de type "update" 
    >>>> QUELQU'UN S'EST DECONNECTE <<<<*/
    } else if (type == "update") {
      //Crée une div "update" qui s'affichera au milieu avec le nom de l'utilisateur concerné
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
      //Si le message reçu contient "rejoint", alors c'est une connexion
      var seConnecte = message.indexOf("rejoint");
      //Envoie ce qu'il se passe pour la sidebar
      if(seConnecte !== -1){
        aecrire = `<h3>Utilisateur connecté :</h3>
        <span>Un nouvel utilisateur écoute dans le tuyau qui le relie au serveur
         pour essayer d'entendre des messages.</span>`
      } else {
        aecrire = `<h3>Utilisateur déconnecté :</h3>
        <span>Un utilisateur a arrêté d'écouter dans le tuyau qui le relie au serveur,
         il n'entend donc plus les messages.</span>`
      }
      
      sidebar.insertAdjacentHTML(
        "beforeend",
        aecrire
      );
    /*Si le signal socket est de type "usertyping" 
    >>>> QUELQU'UN EST EN TRAIN D'ECRIRE <<<<*/
    } else if (type == "usertyping") {
      //Change le placeholder de la zone de text pour dire que quelqu'un écrit
      msginput.placeholder = message;
      setTimeout(function () {
        msginput.placeholder = "";
      }, 10000);

      //Message pour la sidebar
      aecrire = `<h3>Utilisateur en train d'écrire :</h3>
      <span>Quelqu'un a modifié le contenu de sa barre de text, ce qui vous permet de savoir qu'il écrit.</span>`
      sidebar.insertAdjacentHTML(
        "beforeend",
        aecrire
      );
    }

    const queSePasseIl = document.getElementById("QSPT");
    sidebar.addEventListener('scroll', () => {
        queSePasseIl.style.width = 'calc(25% - 17px)';
    });

    // Permer de scroller automatiquement sur les derniers messages
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
    // De même pour la sidebar
    sidebar.scrollTop =
      sidebar.scrollHeight - sidebar.clientHeight;
    
  }

})();
