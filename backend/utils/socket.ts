import { Server } from "socket.io"

let io: Server | null = null

export function setIO(serverIO: Server) {
  io = serverIO
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized")
  return io
}

export default getIO
