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
    count: 3
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageCircleMore,
    count: 7
  },
]

function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}  >
                  <SidebarMenuButton className="relative" asChild>
                    <>
                      <a href={item.url} className="flex justify-center">
                        <item.icon className="w-6! h-6!" />
                      </a>
                      <span className="absolute left-14 bottom-8 ">
                        {item.count && (
                          <SidebarMenuBadge className="bg-red-600 rounded-full text-white text-xs font-semibold">{item.count}</SidebarMenuBadge>
                        )}
                      </span>
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
