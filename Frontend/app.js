const socket = io("http://localhost:3000");

const messagesDiv = document.getElementById("messages");

socket.on("init", (messages) => {
  messagesDiv.innerHTML = "";
  messages.forEach(renderMessage);
});

socket.on("newMessage", (msg) => {
  renderMessage(msg);
});

socket.on("updateMessage", (msg) => {
  const el = document.getElementById(`msg-${msg.id}`);
  if (el) {
    el.querySelector(".likes").textContent = msg.likes;
    el.querySelector(".dislikes").textContent = msg.dislikes;
  }
});

function sendMessage() {
  const text = document.getElementById("messageInput").value.trim();
  const username = document.getElementById("username").value.trim();

  if (!text || !username) {
    alert("Enter username and message");
    return;
  }

  socket.emit("sendMessage", { text, username });
  document.getElementById("messageInput").value = "";
}

function react(id, type) {
  socket.emit(type, id);
}

function renderMessage(msg) {
  const div = document.createElement("div");
  div.id = `msg-${msg.id}`;

  div.innerHTML = `
    <strong>${msg.username}</strong><br/>
    ${msg.text}<br/>
    <small>${new Date(msg.timestamp).toLocaleTimeString()}</small><br/>
    <button onclick="react(${msg.id}, 'like')">
      👍 <span class="likes">${msg.likes}</span>
    </button>
    <button onclick="react(${msg.id}, 'dislike')">
      👎 <span class="dislikes">${msg.dislikes}</span>
    </button>
  `;

  messagesDiv.appendChild(div);
}

document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
