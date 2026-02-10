import { create } from "zustand";

type DrawerValue = { open: boolean; type: string | null };

type DrawerState = {
  drawerState: DrawerValue;
  setDrawerState: (s: DrawerValue | ((prev: DrawerValue) => DrawerValue)) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null | ((prev: string | null) => string | null)) => void;
  selectedParticipantId: string | null;
  setSelectedParticipantId: (id: string | null | ((prev: string | null) => string | null)) => void;
};

const useDrawerStore = create<DrawerState>((set, get) => ({
  drawerState: { open: false, type: null },
  setDrawerState: (s) => {
    if (typeof s === "function") {
      set({ drawerState: (s as (p: DrawerValue) => DrawerValue)(get().drawerState) });
    } else {
      set({ drawerState: s });
    }
  },
  selectedConversationId: null,
  setSelectedConversationId: (id) => {
    if (typeof id === "function") {
      set({ selectedConversationId: (id as (p: string | null) => string | null)(get().selectedConversationId) });
    } else {
      set({ selectedConversationId: id });
    }
  },
  selectedParticipantId: null,
  setSelectedParticipantId: (id) => {
    if (typeof id === "function") {
      set({ selectedParticipantId: (id as (p: string | null) => string | null)(get().selectedParticipantId) });
    } else {
      set({ selectedParticipantId: id });
    }
  },
}));

export default useDrawerStore;
