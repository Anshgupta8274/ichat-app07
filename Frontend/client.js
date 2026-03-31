const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.getElementById("message-container");

const audio = new Audio("notification.mp3");

const name = prompt("Enter your name");
socket.emit("new-user-joined", name);

// Append messages
const append = (message, position) => {
    const msg = document.createElement("div");
    msg.innerText = message;
    msg.classList.add("message", position);
    messageContainer.append(msg);

    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Send message
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = messageInput.value;
    if (message.trim() === "") return;

    append(`You: ${message}`, "right");

    socket.emit("send-message", {
        name: name,
        message: message
    });

    messageInput.value = "";
});

// Receive message
socket.on("receive-message", (data) => {
    append(`${data.name}: ${data.message}`, "left");
    audio.play().catch(() => {});
});