import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => conso le.log(`Listening on http://localhost:3000`);

// 동일 서버에서 http, webSocket을 둘 다 작동시킴
// express.js를 이용하여 http 서버 구동
const server = http.createServer(app);
// http 서버 위 webSocket 서버 구동
const wss = new WebSocket.Server({ server });

// socket: 연결된 브라우저 => 내부 메서드들은 socket을 위한 (wss는 서버 전체를 위한 객체)
wss.on("connection", (socket) => {
    console.log("Connected to Browser ✔");
    socket.on("close", () => {
        console.log("Disconnected from Browser ❌");
    });
    socket.on("message", message => {
        console.log(message.toString('utf8'));
    });
    socket.send("hello!!!");
});

server.listen(3000, handleListen);
