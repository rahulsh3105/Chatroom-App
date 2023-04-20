// established a connection
const socket = io();

let username = "";

document.getElementById("join-btn").addEventListener("click", (event) => {
  event.preventDefault();

  username = document.getElementById("username-input").value;
  if (username.trim() != "") {
    document.querySelector(".form-username").style.display = "none";
    document.querySelector(".chatroom-container").style.display = "block";
    document.querySelector(
      ".chatroom-header"
    ).innerText = `Chatroom - ${username}`;

    socket.emit("username enter", username);
  } else {
    alert("Username cannot be empty");
  }
});

document.getElementById("send-btn").addEventListener("click", (event) => {
  event.preventDefault();

  const data = {
    username: username,
    message: document.getElementById("message-input").value,
    timestamp: new Date().getTime(), // add timestamp to the message
  };

  // emit the message to the server
  socket.emit("message", data);

  // add the message to the chatroom
  addMessage(data, true);
});

// receive message
socket.on("message", (data) => {
  if (data.username !== username) {
    const msgDiv = addMessage(data, false);
  }
});

function addMessage(data, flag) {
  const msgDiv = document.createElement("div");
  msgDiv.innerText = `${data.message}`;
  if (flag) {
    msgDiv.setAttribute("class", "message sent");
    // Add sent time and double tick icon
    const timeSpan = document.createElement("span");
    timeSpan.style.fontSize = "10px";
    timeSpan.innerText = new Date(data.timestamp).toLocaleTimeString();
    msgDiv.appendChild(document.createTextNode("\u00A0")); // add a non-breaking space
    msgDiv.appendChild(timeSpan);
  }

  else {
    msgDiv.setAttribute("class", "message received");

    // Add received time
    const timeSpan = document.createElement("span");
    timeSpan.style.fontSize = "10px";
    timeSpan.innerText = new Date(data.timestamp).toLocaleTimeString();
    msgDiv.appendChild(document.createTextNode("\u00A0")); // add a non-breaking space
    msgDiv.appendChild(timeSpan);
  }

  document.querySelector("#messages-container").appendChild(msgDiv);
  document.querySelector("#messages-container").style.fontFamily = "monospace";
}

// handle user exit
document.getElementById("exit-btn").addEventListener("click", () => {
  socket.emit("username left", username);
  document.querySelector(".form-username").style.display = "block";
  document.querySelector(".chatroom-container").style.display = "none";
});

// receive user exit
socket.on("username left", (data) => {
  if (data !== username) {
    const msgDiv = document.createElement("div");
    msgDiv.innerText = `${data} has left!`;
    document.querySelector("#messages-container").appendChild(msgDiv);
  }
});
