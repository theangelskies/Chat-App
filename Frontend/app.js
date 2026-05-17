const API_URL = "http://localhost:3003";

async function loadMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    const container = document.getElementById("messages");
    container.innerHTML = "";

    data.forEach((msg) => {
      const div = document.createElement("div");
      div.textContent = msg.text;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

async function sendMessage() {
  try {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    console.log("Sending:", text);

    if (!text) return;

    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Sent:", data);

    input.value = "";

    loadMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

loadMessages();
