const API_URL = "http://localhost:3000";

// Load messages when page opens
async function loadMessages() {
  const res = await fetch(`${API_URL}/messages`);
  const data = await res.json();

  const container = document.getElementById("messages");
  container.innerHTML = "";

  data.forEach((msg) => {
    const div = document.createElement("div");
    div.textContent = msg.text;
    container.appendChild(div);
  });
}

// Send message
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value;

  if (!text) return;

  await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  input.value = "";
  loadMessages(); // refresh after sending
}

// Initial load
loadMessages();
