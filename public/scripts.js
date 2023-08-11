const socket = io();

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("message");
  const message = messageInput.value;
  messageInput.value = "";

  socket.emit("chatMessage", message);
});

socket.on("message", (data) => {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("article");
  messageElement.innerHTML = `<div class="bg-gray-600 text-white p-4 pt-2 rounded-xl w-4/5"><h3 class="font-semibold text-blue-300">${data.username}</h3><p>${data.message}</p></div>`;
  chatMessages.appendChild(messageElement);
});

document.getElementById("username-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value;

  socket.emit("newUser", username);

  Swal.fire({
    icon: "success",
    title: "Welcome to the chat!",
    text: `You are now connected as ${username}`,
  });

  document.getElementById("user-login").style.display = "none";
  document.getElementById("chat-main").style.display = "block";
});

socket.on("userConnected", (username) => {
  Swal.fire({
    icon: "success",
    text: `${username} is now connected`,
  });
});
