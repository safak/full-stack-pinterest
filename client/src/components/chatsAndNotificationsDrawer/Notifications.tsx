import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useDeleteNotification, useMarkNotificationAsRead } from "@/hooks/mutations/notification.mutations";
import { useGetNotifications } from "@/hooks/queries/notificaiton.queries";
import { Ellipsis, Search } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";


// const PINS_RELATED = [
//   "PIN_LIKE",
//   "PIN_COMMENT",
//   "COMMENT_LIKE",
//   "COMMENT_REPLY",
// ]

const Notifications = () => {
  const { data: notifications, status, error } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  }

  const handleMarkAsRead = (type: "single" | "all", notificationId?: string) => {
    if (notifications?.data.filter(n => !n.isRead).length === 0) return

    if (type === "single" && notificationId) {
      markAsRead({ notificationId, type });
    }

    else if (type === "all") {
      markAsRead({ type: "all" });
    }
  }

  // const handleCheckNotification = (e: React.MouseEvent, notificationId: string) => {
  //   e.stopPropagation();
  //   if (!notifications?.data) return;
  //   const notification = notifications.data.find(n => n._id === notificationId);
  //   if (notification) {
  //     if (PINS_RELATED.includes(notification.type)) {
  //       setDrawerState({ open: false, type: null });
  //       navigate(`/pin/${notification.entityId}`);
  //     } else if (notification.type === "FOLLOW") {
  //       setDrawerState({ open: false, type: null });
  //       navigate(`/profile/${notification.sender}`);
  //     } else if (notification.type === "MESSAGE") {
  //       setDrawerState({ open: false, type: null });
  //       // Navigate to messages view
  //     }
  //     if (!notification.isRead) {
  //       markAsRead({ notificationId, type: "single" });
  //     }
  //   }
  // }

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Updates</DrawerTitle>
        <DrawerDescription>
          News
        </DrawerDescription>
      </DrawerHeader>
      <Separator className="mb-4" />
      {status === "pending" ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : status === "error" ? (
        <div className="flex justify-center w-full">
          <p className="text-red-500">{error?.message || "An error occurred"}</p>
        </div>
      ) : (
        <div className="no-scrollbar overflow-y-auto px-4">
          {notifications.data.filter((notification) => notification.type !== "MESSAGE").map((notification) => (
            <div
              key={notification._id}
              className={`flex justify-between items-center gap-2 mb-4 rounded-2xl p-2 hover:bg-black/10 cursor-pointer ${notification.isRead ? "bg-black/5" : "border-2 bg-transparent"}`}
            >
              <div className="flex w-15 p-4 rounded-full justify-center items-center bg-black/20">
                <Search />
              </div>
              <p
                className="w-full text-start leading-normal"
              >
                {notification.message}
              </p>
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className="hover:bg-gray-300 rounded-full z-50" size={"sm"}>
                    <Ellipsis size={8} className="cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {/* <DropdownMenuItem onClick={(e) => handleCheckNotification(e, notification._id!)}>Check notification</DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => handleMarkAsRead("single", notification._id!)} disabled={notification.isRead}>Mark as read</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleDeleteNotification(e, notification._id!)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
      <DrawerFooter>
        <Button onClick={() => handleMarkAsRead("all")}>Mark all as read</Button>
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Notifications