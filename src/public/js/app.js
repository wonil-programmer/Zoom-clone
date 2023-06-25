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

const socket = io(); 
// SocketIO: io function은 알아서 socket.io를 실행하고 있는 서버를 찾음

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        // input.value를 출력하고, 후에 입력값을 비워주게 되면 서버에서 콜백함수를 호출 시 이미 비워진 값이므로 비워진 값이 출력되는 에러 발생 => 입력값을 잠시 저장해 둘 변수 필요
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const roomNameTitle = room.querySelector("#roomName");
    roomNameTitle.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit: 
    // event명: 특정한 event를 보내거나 받을 수 있으며, 해당 event는 어느 것이든 될 수 있음
    // arg1: message => 이 경우 JSON이며, socketio는 알아서 stringify, parse과정을 수행함
    // arg2: callback function => 콜백함수를 실행(서버에 던져줌), 백엔드는 해당 함수를 호출
    socket.emit("enter_room", {payload: input.value}, showRoom);
    roomName = input.value;
    input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left!`);
})

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});