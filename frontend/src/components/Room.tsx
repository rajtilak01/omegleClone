import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:3000";

function Room() {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [socket, seSocket] = useState<null | Socket>(null);
  const [lobby, setLobby] = useState(true);

  useEffect(() => {
    const socket = io(URL, {
      autoConnect: true,
    });

    socket.on("send-offer", ({ roomid }) => {
      alert("send offer please");
      setLobby(false);
      socket.emit("offer", {
        sdp: "",
        roomid,
      });
    });

    socket.on("offer", ({ roomid, offer }): void => {
      setLobby(false);
      alert("send answer please");
      socket.emit("answer", {
        roomid,
        sdp: "",
      });
    });

    socket.on("answer", ({ roomid, answer }) => {
      setLobby(false)
      alert("connected");
    });

    socket.on("lobby", () => {
      setLobby(true);
    });
  }, [name]);

  if (lobby) return <div>Waiting to connect you to someone</div>;
  return (
    <div>
      <div>Hi {name}</div>
      <video width={400} height={400} />
      <video width={400} height={400} />
    </div>
  );
}

export default Room;
