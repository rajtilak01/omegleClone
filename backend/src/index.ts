import { Socket } from "socket.io";
import http from "http"

import express from "express";
import {Server} from "socket.io"
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(http)

const io = new Server(server, {
    cors: {
        origin: "*"
      }
});

const userManager = new UserManager();

io.on('connection', (socket:Socket) => {
    console.log("a user connected");
    userManager.addUser("random", socket);
    socket.on("disconnect", () => {
        userManager.removeUSer(socket.id);
    })
});

server.listen(3000, () => {
    console.log("listening on port 3000");
})

