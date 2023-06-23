// socket: 서버로의 연결(브라우저는 백엔드와의 연결을 제공)
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server ✔");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
})

setTimeout(() => {
    socket.send("hello from the browser");
}, 10000);