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
    url: "/explore",
    icon: Compass
  },
  {
    title: "yourBoard",
    url: "#",
    icon: Table2,

  },
  {
    title: "Add",
    url: "#",
    icon: SquarePlusIcon
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    msgs: 3
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageCircleMore,
    msgs: 7
  },
]

function AppSidebar() {
  return (
    <Sidebar className="max-w-18" variant="inset" collapsible="none">
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
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="w-6! h-6!" />
                    </a>
                  </SidebarMenuButton>
                  {item.msgs && (
                    <SidebarMenuBadge>{item.msgs}</SidebarMenuBadge>
                  )
                  }
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
                <SidebarMenuButton >
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
