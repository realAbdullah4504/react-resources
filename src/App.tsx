import '@livekit/components-styles';
import { useState } from "react";
import Meeting from "./Meeting";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";

function App() {
  const serverUrl = "wss://streamin-app-1wvl2zft.livekit.cloud";
  const [roomName, setRoomName] = useState("");
  const [identity, setIdentity] = useState("");
  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  const joinMeeting = async () => {
    const response = await fetch("http://localhost:3001/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identity, roomName }),
    });
    const data = await response.json();
    console.log(data);
    await room.connect(serverUrl, data.token);
  };
  return (
    <>
      <div>
        <label htmlFor="room">Room:</label>
        <input
          type="text"
          id="room"
          name="room"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <label htmlFor="identity">Identity:</label>
        <input
          type="text"
          id="identity"
          name="identity"
          onChange={(e) => setIdentity(e.target.value)}
        />
        <button type="button" onClick={joinMeeting}>
          Join
        </button>
        <RoomContext.Provider value={room}>
          <Meeting />
        </RoomContext.Provider>
      </div>
    </>
  );
}

export default App;
