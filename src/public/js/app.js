// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");
// // socket: 서버로의 연결(브라우저는 백엔드와의 연결을 제공)
// const socket = new WebSocket(`ws://${window.location.host}`);

// // 새로운 메시지 생성: 객체 생성 -> JSON 타입으로 변환 -> 백엔드로 전송
// function makeMessage(type, payload) {
//     const msg = { type, payload };
// }
// socket.addEventListener("open", () => {
//     console.log("Connected to Server ✔");
// });

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server ❌");
// })


// function handleSubmit(event) {
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     const li = document.createElement("li");
//     li.innerText = `You: ${input.value}`;
//     messageList.append(li);
//     input.value = "";
// }

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
// }
// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);

const socket = io(); // SocketIO: io function은 알아서 socket.io를 실행하고 있는 서버를 찾음