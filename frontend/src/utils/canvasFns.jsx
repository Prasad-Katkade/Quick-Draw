import { socket } from "./socket";

export function clearAll(roomId) {
    console.log("Clear All clicked (client)", roomId);
    // Emit clear event for this room
    socket.emit("clear", { roomId });
}
