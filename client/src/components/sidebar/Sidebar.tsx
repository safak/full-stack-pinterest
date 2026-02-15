import { Bell, Compass, Home, MessageCircleMore, Settings, SquarePlusIcon, Table2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";

import AppLogo from "../AppLogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useEffect } from "react";
import { Button } from "../ui/button";
import ChatsAndNotificationsDrawer from "../chatsAndNotificationsDrawer/ChatsAndNotificationsDrawer";
import { useGetNotifications } from "@/hooks/queries/notificaiton.queries";
import type { NotificationType } from "@/types/domain/notification.types";
import type { Messages } from "@/types/domain/message.type";
import useSocketStore from "@/lib/socketStore";
import { toast } from "sonner";


const items = [
  {
    title: "Home",
    url: "/",
    icon: Home
  },
  {
    title: "explore",
    url: "#",
    icon: Compass
  },
  {
    title: "yourBoard",
    url: "#",
    icon: Table2,

  },
  {
    title: "Add",
    url: "/create",
    icon: SquarePlusIcon
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    count: 0
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageCircleMore,
    count: 0
  },
]

const handleGetCount = ({ title, data = [] }: { title: string; data: NotificationType[] }) => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  if (title === "Notifications") {
    return (data).filter(n => n.type !== "MESSAGE" && !n.isRead).length || 0;
  }

  if (title === "Messages") {
    return (data).filter(m => m.type === "MESSAGE" && !m.isRead).length || 0;
  }

  return 0;
}

import useDrawerStore from "@/lib/drawerStore";

function AppSidebar() {
  const { setDrawerState } = useDrawerStore();
  const { data: notifications, refetch } = useGetNotifications();
  const { socket } = useSocketStore();


  const handleClickMessagesAndNotifications = (e: React.MouseEvent<HTMLButtonElement>, item: { title: string }) => {
    e.stopPropagation();
    if (item.title === "Messages") {
      setDrawerState({ open: true, type: "Messages" });
    }
    else if (item.title === "Notifications") {
      setDrawerState({ open: true, type: "Notifications" });
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (message: Messages) => {
      console.log('Someone sent a new message!', message);
      toast.success(`You have a new message!`);
      refetch();
    }
    );
    socket.on('notification', (notification: NotificationType) => {
      console.log('You have a new notification!', notification);
      if (notification.type === "MESSAGE") {
        toast.success(`You have a new message!`);
      } else {
        toast.success(`You have a new notification!`);
      }
      refetch();
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    return () => {
      socket.off('newMessage');
      socket.off('notification');
      socket.off('disconnect');
    }
  }, [socket, refetch]);

  return (
    <Sidebar className="max-w-18" variant="floating" collapsible="none">
      <SidebarHeader className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem className="text-center">
            <SidebarMenuButton asChild >
              <AppLogo showFull={false} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-7" >
              {items.map((item) => {
                let count = 0;
                if (item.title === "Notifications") {
                  count = handleGetCount({ title: item.title, data: notifications?.data || [] });
                }
                else if (item.title === "Messages") {
                  count = handleGetCount({ title: item.title, data: notifications?.data || [] });
                }
                return (
                  <SidebarMenuItem key={item.title}  >
                    <SidebarMenuButton className="relative" asChild>
                      <>
                        {item.title === "Messages" || item.title === "Notifications" ? (
                          <Button variant={"ghost"} onClick={(e) => handleClickMessagesAndNotifications(e, item)} className="flex justify-center">
                            <item.icon className="w-6! h-6!" />
                          </Button>
                        ) : (
                          <a href={item.url} className="flex justify-center">
                            <item.icon className="w-6! h-6!" />
                          </a>
                        )}
                        <span className="absolute left-13 bottom-10 ">
                          {count > 0 && (
                            <SidebarMenuBadge
                              className="bg-red-600 rounded-full text-white text-xs font-semibold"
                              onClick={(e: any) => handleClickMessagesAndNotifications(e, item)}
                            >
                              {count > 99 ? "99+" : count}
                            </SidebarMenuBadge>
                          )}
                        </span>
                      </>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <ChatsAndNotificationsDrawer />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex justify-center">
                  <Settings className="w-6! h-6! cursor-pointer" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <a className="flex gap-2" href="/users/1">
                    Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;
