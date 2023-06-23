import express from "express";
import http from "http";
// import WebSocket from "ws";
import {Server} from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


// 동일 서버에서 http, webSocket을 둘 다 작동시킴
// express.js를 이용하여 http 서버 구동
const httpServer = http.createServer(app);
// http 서버 위 webSocket 서버 구동
// const wss = new WebSocket.Server({ server });
// const sockets = [];

// SocketIO 서버 구동 
const wsServer = new Server(httpServer);
wsServer.on("connection", (socket) => {
    console.log(socket);
})



// socket: 연결된 브라우저 => 내부 메서드들은 socket의 메서드 (wss는 서버 전체를 위한 객체)
// wss.on("connection", (socket) => {
//     console.log("Connected to Browser ✔");
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     socket.on("close", () => {
//         console.log("Disconnected from Browser ❌");
//     });
//     socket.on("message", msg => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break
//             }
//         });
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

