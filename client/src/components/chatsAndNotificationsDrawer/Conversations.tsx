import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useGetConversations } from "@/hooks/queries/message.queries";
import useAuthStore from "@/lib/authStore";
import useDrawerStore from "@/lib/drawerStore";
import useSocketStore from "@/lib/socketStore";
import type { Conversation } from "@/types/domain/message.type";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import { UserSearch } from "./UserSearch";

const Conversations = () => {
  const { currentUser } = useAuthStore();
  const { data: conversations, refetch, status, error } = useGetConversations();
  const { setDrawerState, setSelectedConversationId, setSelectedParticipantId } = useDrawerStore();
  const { socket } = useSocketStore();

  const handleOpenChat = ({ chat }: { chat: Conversation }) => {
    setSelectedConversationId(chat._id);
    setSelectedParticipantId(chat.participants.find(p => p._id !== currentUser?._id)?._id || null);
    setDrawerState({ open: true, type: "Chat" });
  }

  useEffect(() => {
    if (!socket) return
    socket.on('newMessage', () => {
      refetch();
    });
  }, [socket, refetch]);

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="mb-4">Messages</DrawerTitle>
        <Separator className="mb-3" />
        <div className="w-full h-full min-w-50 rounded-lg border-2 flex justify-start items-center py-1 px-2 bg-gray-200">
          <UserSearch
            onUserSelect={(user) => {
              console.log("Selected user:", user)
              setSelectedParticipantId(user._id!);
              setDrawerState({ open: true, type: "Chat" })
            }}
          />
        </div>
      </DrawerHeader>
      <Separator className="mb-4" />
      <div className="no-scrollbar overflow-y-auto px-4">
        {status === "pending" ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : status === "error" ? (
          <div className="flex justify-center w-full">
            <p className="text-red-500">{error?.message || "An error occurred"}</p>
          </div>
        ) : (
          conversations?.data.map((chat: Conversation) => {
            const participant = chat.participants.find(p => p._id !== currentUser?._id);
            return (
              <div
                key={chat._id}
                className={`flex justify-between items-center gap-2 mb-4 rounded-2xl p-2 ${chat.lastMessage.sender === currentUser?._id || chat?.lastMessage?.isRead ? "bg-black/10" : "border-2 bg-transparent"} hover:bg-black/20 cursor-pointer`}
                onClick={() => handleOpenChat({ chat })}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={participant?.img || ""} />
                  <AvatarFallback>{participant?.username?.[0].toUpperCase() || "CN"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full">
                  <p
                    className="w-full text-start font-semibold"
                  >
                    {participant?.displayName}
                  </p>
                  <p
                    className="w-full text-start leading-normal"
                  >
                    {typeof chat?.lastMessage?.content === 'string' && chat?.lastMessage?.content.startsWith('sticker::') ? (
                      <img src={chat?.lastMessage?.content.replace('sticker::', '')} alt="sticker" className="max-w-10 rounded-lg" />
                    ) : (
                      chat?.lastMessage?.content || "No messages yet."
                    )}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button
            variant="outline"
            onClick={() => setDrawerState({ open: false, type: null })}
          >
            Close
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Conversations