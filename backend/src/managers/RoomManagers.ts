import { User } from "./UserManager";

let GLOBAR_ROOM_ID = 1;

interface Room {
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }
  createRoom(user1: User, user2: User) {
    const roomid = this.generate();
    this.rooms.set(roomid.toString(), {
      user1,
      user2,
    });

    user1?.socket.emit("send-offer", {
        roomid
       })
  }

  onOffer(roomid: string, sdp: string){
    const user2 = this.rooms.get(roomid)?.user2;
    user2?.socket.emit("offer", {
        sdp
    })
  }

  onAnswer(roomid: string, sdp: string) {
    const user1 = this.rooms.get(roomid)?.user1;
    user1?.socket.emit("offer", {
        sdp
    })
  }
  generate() {

    return GLOBAR_ROOM_ID++;
  }

}
