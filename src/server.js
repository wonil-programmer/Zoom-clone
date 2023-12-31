import express from "express";
import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui"

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
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(wsServer, {
    auth: false,
});

function publicRooms() {
    const {
        sockets: {
            // sids: 모든 소켓(private room) / rooms: 모든 방 => rooms는 sids를 포함
            adapter: {sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    // 공개방 필터링
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter.rooms);
        console.log(`Socket Event: ${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        // 백엔드에서 실행시키는게 아님(보안문제 발생)
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
        })
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname)
});



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

