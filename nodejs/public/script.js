(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;
  let uavatar;

  app.querySelector("#join-user").addEventListener("click", function (event) {
    let username = app.querySelector(".join-screen #username").value;
    let rand = Math.floor(Math.random() * 50);
    let avatar = `img/${rand}.png`;
    if (username.length === 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;
    uavatar = avatar;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function (event) {
      let message = app.querySelector(".chat-screen #message-input").value;
<<<<<<< HEAD
      if (message.length === 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
        img: uavatar,
      });
      app.querySelector(".chat-screen #message-input").value = "";
=======
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
>>>>>>> 1356f0d437c73cba4e3c39a05ca251e77b8605b6
    });

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

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  // ils sont chargé de recuperer les messages des autres
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
  function renderMessage(type, message) {
    const sidebar = document.getElementsByClassName("sidebar")[0];
    sidebar.insertAdjacentHTML("afterbegin", `<div class="qui">${type}</div>`);
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type === "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
           <div>
           <div class="name"><img class="avatar" src=${message.img}>Toi</div>
           <div class="text">${message.text}</div>
           </div>
           `;
      messageContainer.appendChild(el);
    } else if (type === "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message  other-message");
      el.innerHTML = `
        <div>
        <div class="name"><img class="avatar" src=${message.img}> ${message.username}</div>
        <div class="texte">${message.text}</div>
        </div>
              `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // scroller les messages à partie du dernier
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
  socket.on("usertyping", (type, msg) => {
    const writting = document.querySelector("#writting");
    writting.innerHTML = `${type.name} est entrain d'ecrire...`;
    setTimeout(function () {
      writting.innerHTML = "";
    }, 5000);
  });
})();
