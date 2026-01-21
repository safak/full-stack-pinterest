import type { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  removeCurrentUser: () => void;
  updateCurrentUser: (newUser: User) => void;
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => {
        console.log("Setting current user:", user);

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