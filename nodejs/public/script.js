(function () {
  const app = document.querySelector(".app");
  const socket = io();

  //uname et uavatar contiennent le nom et l'avatar de l'utilisateur
  let uname;
  let uavatar;

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

  //Quand un signal socket est detecté, envoie ses informations à la fonction renderMessage
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  //Fonction de tri des signaux sockets
  function renderMessage(type, message) {
    //Sidebar : Contenu de l'onglet "Que se passe-t-il"
    const sidebar = document.getElementsByClassName("sidebar")[0];
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
      aecrire = "Message envoyé ";
      sidebar.insertAdjacentHTML(
        "beforeend",
        `<div class="qui">${aecrire}</div>`
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
      aecrire = "Message reçu : ";
      sidebar.insertAdjacentHTML(
        "beforeend",
        `<div class="qui">${aecrire}</div>`
      );

      /*Si le signal socket est de type "update" 
    >>>> QUELQU'UN S'EST DECONNECTE <<<<*/
    } else if (type == "update") {
      //Crée une div "update" qui s'affichera au milieu avec le nom de l'utilisateur concerné
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
      //Envoie ce qu'il se passe pour la sidebar
      aecrire = "Une personne s'est connectée ";
      sidebar.insertAdjacentHTML(
        "beforeend",
        `<div class="qui">${aecrire}</div>`
      );
    }

    // Permer de scroller si il y a trop de message
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
  /*app.addEventListener(
    "click",
    () => {
      // const button = document.querySelector("button");
      // button.addEventListener("click", function () {
      //   alert("bonjour");
      //});
      const server = document.domain;
      // let html = "<p>paragraphe</p>"
      document.getElementById("sidebar").insertAdjacentHTML(
        "beforeend",
        `<div>Bonjour Ali</div>
      ${server}
      <div></div>`
      );
      //document.querySelector("input").addEventListener("keydown", (e) => {
      // console.log("keydown", e);
      //});
      // event.stopPropagation();
      document
        .getElementById("sidebar")
        .insertAdjacentHTML("beforeend", `<p>coucou</p>`);
    },
    { once: true }
  );/** */
  //function maFunction(/**event*/) {
  // const button = document.querySelector("button");
  // button.addEventListener("click", function () {
  //   alert("bonjour");
  //});
  //const server = document.domain;
  // let html = "<p>paragraphe</p>"
  //document.getElementById("sidebar").insertAdjacentHTML(
  //  "beforeend",
  //  `<div>Bonjour Ali</div>
  //  ${server}
  //  <div></div>`
  //  );
  // event.stopPropagation();
  //  document
  //    .getElementById("sidebar")
  //    .insertAdjacentHTML("beforeend", `<p>coucou</p>`);
  // }

  //*/

  //Envoi un signal socket lorqu'un utilisateur écrit
  //NON FONCTIONNEL
  socket.on("usertyping", (type, msg) => {
    const writting = document.querySelector("#writting");
    writting.innerHTML = `${type.name} est entrain d'ecrire...`;
    setTimeout(function () {
      writting.innerHTML = "";
    }, 5000);
  });
})();
