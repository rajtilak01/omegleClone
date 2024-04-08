import { Socket } from "socket.io";
import { RoomManager } from "./RoomManagers";

export interface User {
    socket: Socket;
    name: string;
}
export class UserManager{
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager;
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager =  new RoomManager();
    }

    addUser(name: string, socket: Socket){
        this.users.push({
            name, socket
        })
        this.queue.push(socket.id);
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUSer(socketId: string) {
        this.users = this.users.filter(x=> x.socket.id === socketId);
        this.queue = this.queue.filter(x => x=== socketId);
    }

    clearQueue() {
        if(this.queue.length<2){
            return;
        }
       const user1 = this.users.find(x => x.socket.id === this.queue.pop());
       const user2 = this.users.find(x => x.socket.id === this.queue.pop());
       if(!user1 || !user2) return;

       const room = this.roomManager.createRoom(user1, user2);

       
    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({sdp, roomid} : {sdp: string, roomid: string}) => {
            this.roomManager.onOffer(roomid, sdp);
        })
        socket.on("answer", ({sdp, roomid} : {sdp: string, roomid: string}) => {
            this.roomManager.onAnswer(roomid, sdp);
        })
      }
}