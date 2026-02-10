import type { Socket } from "socket.io-client";
import { create } from "zustand";


type SocketState = {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  removeSocket: () => void;
};

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
  removeSocket: () => set({ socket: null }),
}));

export default useSocketStore;