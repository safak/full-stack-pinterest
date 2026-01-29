import type { PostUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  currentUser: PostUser | null;
  setCurrentUser: (user: PostUser) => void;
  removeCurrentUser: () => void;
  updateCurrentUser: (newUser: PostUser) => void;
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => {
        return set({ currentUser: user });
      },
      removeCurrentUser: () => set({ currentUser: null }),
      updateCurrentUser: (newUser) => set({ currentUser: newUser }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;