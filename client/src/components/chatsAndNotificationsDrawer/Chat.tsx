import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useMarkMessagesAsRead, useSendMessage } from "@/hooks/mutations/message.mutation";
import { useMarkNotificationAsRead } from "@/hooks/mutations/notification.mutations";
import { useGetMessages } from "@/hooks/queries/message.queries";
import { useGetUser } from "@/hooks/queries/user.queries";
import useAuthStore from "@/lib/authStore";
import useDrawerStore from "@/lib/drawerStore";
import useSocketStore from "@/lib/socketStore";
import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import InputField from "../inputField/InputField";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Chat = () => {
  const { setDrawerState, selectedConversationId: conversationId, selectedParticipantId, setSelectedConversationId } = useDrawerStore();
  const [message, setMessage] = useState("");
  const { currentUser } = useAuthStore();
  const { data: messagesData, refetch} = useGetMessages({ conversationId: conversationId ?? "" });
  const { mutate: sendMessage } = useSendMessage()
  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead()
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
  const { socket } = useSocketStore();

  const { data: senderData } = useGetUser(selectedParticipantId || "");
  const currentConversation = messagesData?.pages[0]?.data || []

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
  }, [messagesData, conversationId]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    sendMessage({
      content: message,
      receiver: selectedParticipantId!,
      ...(conversationId && { conversationId: conversationId || "" })
    }, {
      onSuccess: (response) => {
        setMessage("");
        setSelectedConversationId(response.data.conversationId);
      },
      onError: (error) => {
        console.error("Error sending message:", error);
        toast.error(`${error.message}, Please try again.`);
      }
    });

  }
  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', () => {
      refetch();
    }
    );
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    return () => {
      socket.off('newMessage');
      socket.off('disconnect');
    }
  }, [socket, refetch]);

  useEffect(() => {
    if (conversationId) {
      markMessagesAsRead(conversationId);
    }
  }, [conversationId, markMessagesAsRead]);

  useEffect(() => {
    if (messagesData?.pages[0]?.data[0]?.sender !== currentUser?._id && conversationId) {
      markNotificationAsRead({ entityId: conversationId || "" });
    }
  }, [messagesData, markNotificationAsRead, currentUser?._id, conversationId]);

  return (
    <DrawerContent>
      <DrawerHeader className="">
        <div className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={senderData?.data.img || ""} />
            <AvatarFallback>{senderData?.data.username?.[0].toUpperCase() || "CN"}</AvatarFallback>
          </Avatar>
          <DrawerTitle className="w-full">{senderData?.data.displayName}</DrawerTitle>
          <Button variant={"outline"} className="flex items-center rounded-xl" onClick={() => {
            setSelectedConversationId(null);
            setDrawerState({ open: false, type: null })
          }}>
            <X />
          </Button>
        </div>
      </DrawerHeader>
      <Separator className="mb-4" />
      {/* Scroll the messages to the bottom */}
      <div ref={containerRef} className="no-scrollbar overflow-y-auto px-4 h-full">

        {currentConversation?.length > 0 && currentConversation.map((message) => (
          <div className={`w-full mb-6 flex gap-2 items-center ${message.sender === currentUser!._id ? "flex-row-reverse" : "justify-start"}`} key={message._id}>
            <Avatar >
              <AvatarImage src={message.sender === currentUser!._id ? currentUser?.img || "" : senderData?.data.img || ""} />
              <AvatarFallback>{message.sender === currentUser!._id ? currentUser?.username?.[0].toUpperCase() || "CN" : senderData?.data.username?.[0].toUpperCase() || "CN"}</AvatarFallback>
            </Avatar>
            <p
              className={`text-black/80 text-wrap! wrap-break-word font-semibold max-w-72.5 rounded-xl ${message.sender === currentUser!._id ? "text-right bg-red-100" : "text-left bg-black/10"} p-2 `}
            >
              {typeof message.content === 'string' && message.content.startsWith('sticker::') ? (
                <img src={message.content.replace('sticker::', '')} alt="sticker" className="max-w-20 rounded-lg" />
              ) : (
                message.content
              )}
            </p>
          </div>
        ))}
      </div>
      <DrawerFooter>
        <Separator className="mb-2" />
        <InputField
          userId={currentUser!._id}
          handleSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSendMessage(message);
          }}
          inputPlaceholder="Write a message"
          input={message}
          setInput={setMessage}
          inputType="chat"
          addRequest={(message: string) => { handleSendMessage(message) }}
        />
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Chat