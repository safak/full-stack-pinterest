import {
  Drawer
} from "@/components/ui/drawer";
import useDrawerStore from "@/lib/drawerStore";
import Chat from "./Chat";
import Conversations from "./Conversations";
import Notifications from "./Notifications";

const ChatsAndNotificationsDrawer = () => {
  const { drawerState, setDrawerState, selectedParticipantId } = useDrawerStore();

  return (
    <div className="w-full flex-2">
      <div className="flex flex-wrap gap-2">
        <Drawer
          open={drawerState.open}
          dismissible={drawerState.type === "Chat" || drawerState.type === "Messages" ? false : true}
          onDrag={() => { }}
          onOpenChange={(open) =>
            setDrawerState((prev) => (open ? { open, type: prev.type } : { open, type: null }))
          }
          direction={"right"}
        >
          {drawerState.type === "Messages" ? (
            <Conversations />
          ) : drawerState.type === "Notifications" ? (
            <Notifications />
          ) : selectedParticipantId !== null ? (
            <Chat />
          ) : null}
        </Drawer>
      </div>
    </div>
  )
}

export default ChatsAndNotificationsDrawer