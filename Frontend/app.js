const API_URL = "http://localhost:3000";

async function loadMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    const data = await res.json();

    const container = document.getElementById("messages");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No messages yet 👋</p>";
      return;
    }

    data.forEach((msg) => {
      const div = document.createElement("div");

      div.innerHTML = `
        <strong>${msg.username}</strong><br/>
        ${msg.text}<br/>
        <small>${new Date(msg.timestamp).toLocaleTimeString()}</small><br/>
        <button onclick="react(${msg.id}, 'like')">👍 ${msg.likes}</button>
        <button onclick="react(${msg.id}, 'dislike')">👎 ${msg.dislikes}</button>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const usernameInput = document.getElementById("username");

  const text = input.value.trim();
  const username = usernameInput.value.trim();

  if (!text || !username) {
    alert("Enter username and message");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, username }),
    });

    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    input.value = "";
    loadMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

async function react(id, type) {
  try {
    await fetch(`${API_URL}/messages/${id}/${type}`, {
      method: "POST",
    });

    loadMessages();
  } catch (err) {
    console.error("Reaction failed:", err);
  }
}

document
  .getElementById("messageInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

setInterval(loadMessages, 3000);

loadMessages();
